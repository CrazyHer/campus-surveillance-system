from model import YOLOModel
from wsClient import WSClient
import cv2
import asyncio


# Windows推流摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -f flv rtmp://localhost:1515/hls/3
def test_detectVideo():
    def onFrame(frameResult):
        cv2.imshow("image", frameResult.plot())
        cv2.waitKey(25)
        print(frameResult.clsCount)
        pass

    model = YOLOModel()
    model.detectVideo("rtmp://localhost:1515/hls/3", onFrame=onFrame)
    pass


def test_detectImage():
    model = YOLOModel()
    result = model.detectImage("./test-images/2.jpeg")
    cv2.imshow("image", result.plot())
    print(result.clsCount)
    cv2.waitKey(0)
    pass


async def test_wsClient():
    ws = WSClient(
        "http://localhost:3000",
        "admin123",
        "admin123",
        "3",
        "http://localhost/hls/3.m3u8",
    )
    await ws.connect()
    await ws.sio.wait()


async def test_sendAlarm():
    ws = WSClient(
        "http://localhost:3000",
        "admin123",
        "admin123",
        "3",
        "http://localhost/hls/3.m3u8",
    )
    await ws.connect()

    model = YOLOModel()
    result = model.detectImage("./test-images/2.jpeg")
    print(result.clsCount)
    await ws.trySendAlarm(
        {
            "algorithmType": "body",
            "count": result.clsCount["person"],
            "predictResult": result,
        }
    )
    await ws.sio.wait()
    pass


async def test_detectVideoAndSendAlarm():
    model = YOLOModel()
    ws = WSClient(
        "http://localhost:3000",
        "admin123",
        "admin123",
        "3",
        "http://localhost/hls/3.m3u8",
    )
    await ws.connect()
    await asyncio.sleep(1)

    results = model.detectVideo("rtmp://localhost:1515/hls/3")
    for frameResult in results:
        cv2.imshow("image", frameResult.plot())
        cv2.waitKey(1)
        await ws.trySendAlarm(
            {
                "algorithmType": "body",
                "count": model.getClsCount(frameResult)["person"],
                "predictResult": frameResult,
            }
        )
        await asyncio.sleep(1)
        pass

    pass


async def main():
    # await test_sendAlarm()
    # await test_wsClient()
    await test_detectVideoAndSendAlarm()
    pass


asyncio.run(main())
