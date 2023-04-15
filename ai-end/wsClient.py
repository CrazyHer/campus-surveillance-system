from typing import Any
import socketio
import hashlib
import hmac
import base64
import json
import cv2
import asyncio
from datetime import datetime, timedelta


class WSClient:
    __SHA256KEY = "campus-surveillance-system".encode("utf-8")
    sio = socketio.AsyncClient()
    serverUrl = None

    connected = False
    ready = False
    onReady = lambda: None

    username = None
    password = None
    cameraID = None

    rtmpUrl = None
    alarmRules = None
    """
    @type alarmRule: [{
        'id': 1,
        'name': '测试规则',
        'enabled': True, 
        'algorithmType':'body', 
        'triggerDayOfWeek': [1, 2, 3, 4, 5], 
        'triggerTimeStart': '09:00:00', 
        'triggerTimeEnd': '18:00:00', 
        'triggerCountMin': 0, 
        'triggerCountMax': -1
        }]
    """

    alarmThrottle = {}
    """
    @type alarmThrottle: {
        [ alarmRuleID:str ]: datetime
    }
    """

    throttleTime = 60  # seconds

    def __init__(
        self, serverUrl, username, password, cameraID, onReady=lambda: Any
    ) -> None:
        self.serverUrl = serverUrl
        self.username = username
        self.password = base64.b64encode(
            hmac.new(
                self.__SHA256KEY, password.encode("utf-8"), hashlib.sha256
            ).digest()
        ).decode("utf-8")
        self.cameraID = cameraID
        self.onReady = onReady

        self.sio.on("cameraConfigChange", self.onCameraConfigChange)

        self.sio.on("connect", self.onConnect)
        self.sio.on("disconnect", self.onDisconnect)
        self.sio.on("connect_error", self.onConnectError)

        print(f"ws client for camera {cameraID} created")
        pass

    async def connect(self):
        if self.connected:
            return
        data = json.dumps(
            {
                "username": self.username,
                "password": self.password,
                "cameraID": self.cameraID,
            }
        )
        await self.sio.connect(
            self.serverUrl, socketio_path="/ws/ai/", headers={"data": data}
        )
        self.connected = True
        pass

    async def sendMessage(self, msg):
        await self.connect()
        await self.sio.emit("message", msg)
        print("message sent")
        pass

    def matchAlarmRule(self, data):
        """
        @type data: {
            'algorithmType': 'body',
            'count': 1,
            'predictResult': Any
        }
        """
        if not self.ready or self.alarmRules is None:
            return None
        for rule in self.alarmRules:
            if (
                rule["enabled"]
                and rule["algorithmType"] == data["algorithmType"]
                and (datetime.now().weekday() + 1) in rule["triggerDayOfWeek"]
                and datetime.now().time()
                >= datetime.strptime(rule["triggerTimeStart"], "%H:%M:%S").time()
                and datetime.now().time()
                <= datetime.strptime(rule["triggerTimeEnd"], "%H:%M:%S").time()
                and data["count"] >= rule["triggerCountMin"]
                and (
                    data["count"] <= rule["triggerCountMax"]
                    or rule["triggerCountMax"] == -1
                )
                and (
                    self.alarmThrottle.get(rule["id"]) is None
                    or (datetime.now() - self.alarmThrottle[rule["id"]]).seconds
                    > self.throttleTime
                )
            ):
                return rule
        return None

    async def trySendAlarm(self, data):
        """
        @type data: {
            'algorithmType': 'body',
            'count': 1,
            'predictResult': Any
        }
        """
        await self.connect()
        rule = self.matchAlarmRule(data)
        if rule is None:
            return

        """
        AlarmData: {
            picBase64: string;
            alarmRuleID: number;
        }
        """
        await self.sio.emit(
            "alarm",
            {
                "alarmRuleID": rule["id"],
                "picBase64": "data:image/jpg;base64,"
                + base64.b64encode(
                    cv2.imencode(".jpg", data["predictResult"].plot())[1]
                ).decode("utf-8"),
            },
        )

        # 防止短时间内重复发送
        self.alarmThrottle[rule["id"]] = datetime.now()

        print(f"camera {self.cameraID} alarm sent: {rule['name']}")
        pass

    async def disconnect(self):
        await self.sio.disconnect()
        pass

    async def onCameraConfigChange(self, data):
        self.rtmpUrl = data["rtmpUrl"]
        self.alarmRules = data["alarmRules"]
        print(f"Camera {self.cameraID} config updated")

        if self.ready is False:
            self.ready = True
            asyncio.get_event_loop().create_task(self.onReady(self))
        pass

    async def stayConnected(self):
        await self.connect()
        await self.sio.wait()
        pass

    def onConnect(self):
        print(f"connection for camera {self.cameraID} established")
        pass

    def onDisconnect(self):
        print(f"camera {self.cameraID} disconnected from server")
        pass

    def onConnectError(self, err):
        print(err)
        pass
