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
    connected = False
    serverUrl = None
    username = None
    password = None
    cameraID = None
    hlsUrl = None

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
    alarmRule = None

    """
    @type alarmThrottle: {
        [ alarmRuleID:str ]: datetime
    }
    """
    alarmThrottle = {}
    throttleTime = 60  # seconds

    def __init__(self, serverUrl, username, password, cameraID, hlsUrl) -> None:
        self.serverUrl = serverUrl
        self.username = username
        self.password = base64.b64encode(
            hmac.new(
                self.__SHA256KEY, password.encode("utf-8"), hashlib.sha256
            ).digest()
        ).decode("utf-8")
        self.cameraID = cameraID
        self.hlsUrl = hlsUrl

        self.sio.on("alarmRuleChange", self.onAlarmRuleChange)

        self.sio.on("connect", self.onConnect)
        self.sio.on("disconnect", self.onDisconnect)
        self.sio.on("connect_error", self.onConnectError)
        pass

    async def connect(self):
        if self.connected:
            return
        data = json.dumps(
            {
                "username": self.username,
                "password": self.password,
                "cameraID": self.cameraID,
                "hlsUrl": self.hlsUrl,
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
        print("I sent a message!")
        pass

    def matchAlarmRule(self, data):
        """
        @type data: {
            'algorithmType': 'body',
            'count': 1,
            'predictResult': Any
        }
        """
        if self.alarmRule is None:
            print(f"Alarm rule not loaded")
            return None
        for rule in self.alarmRule:
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

        print(f"I sent an alarm")
        pass

    async def disconnect(self):
        await self.sio.disconnect()
        pass

    def onAlarmRuleChange(self, data):
        self.alarmRule = data
        print(f"Alarm rule updated")
        pass

    def onConnect(self):
        print("connection established")
        pass

    def onDisconnect(self):
        print("disconnected from server")
        pass

    def onConnectError(self, err):
        print(err)
        pass
