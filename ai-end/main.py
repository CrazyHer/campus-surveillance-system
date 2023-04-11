from model import YOLOModel
from wsClient import WSClient
import cv2
import asyncio

model = YOLOModel()
print("model created")


def onFrame(frameResult):
    cv2.imshow("image", frameResult.plot())
    cv2.waitKey(25)
    print(frameResult.clsCount)
    pass


# Windows推流摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -f flv rtmp://localhost:1515/hls/3
def test_detectVideo():
    model.detectVideo("rtmp://localhost:1515/hls/3", onFrame=onFrame)
    pass


def test_detectImage():
    result = model.detectImage("./test-images/2.jpeg")
    cv2.imshow("image", result.plot())
    print(result.clsCount)
    pass


async def main():
    ws = WSClient(
        "http://localhost:3000",
        "admin123",
        "admin123",
        "3",
        "http://localhost/hls/3.m3u8",
    )
    await ws.sendMessage("Hello from Python")

    await ws.sio.wait()
    pass


test_detectVideo()
# asyncio.run(main())
