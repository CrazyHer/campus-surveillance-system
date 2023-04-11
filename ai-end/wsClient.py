import socketio
import hashlib
import hmac
import base64
import json


class WSClient:
    __SHA256KEY = "campus-surveillance-system".encode("utf-8")
    sio = socketio.AsyncClient()
    connected = False
    serverUrl = None
    username = None
    password = None
    cameraID = None
    hlsUrl = None

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

        self.sio.on("message", self.on_message)
        self.sio.on("connect", self.on_connect)
        self.sio.on("disconnect", self.on_disconnect)
        self.sio.on("connect_error", self.on_connect_error)
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

    async def sendMessage(self, data):
        if not self.connected:
            await self.connect()
        await self.sio.emit("message", data)
        print(f"I sent a message: {data}")
        pass

    async def disconnect(self):
        await self.sio.disconnect()
        pass

    def on_message(self, data):
        print(f"I received a message: {data}")
        pass

    def on_connect(self):
        print("connection established")
        pass

    def on_disconnect(self):
        print("disconnected from server")
        pass

    def on_connect_error(self, err):
        print(err)
        pass
