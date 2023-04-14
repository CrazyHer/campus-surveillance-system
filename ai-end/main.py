from model import YOLOModel
from wsClient import WSClient
import cv2
import asyncio


# Windows推流本机摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -list_devices true -f dshow -i dummy
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -f flv rtmp://192.169.3.3:1515/hls/3


async def detectVideoAndSendAlarmForCameras(
    serverUrl="", adminUsername="", password="", cameraIDs=[]
):
    model = YOLOModel()

    async def beginWork(ws: WSClient):
        print(f"begin to detect video for camera {ws.cameraID}, rtmpUrl: {ws.rtmpUrl}")
        print(f"if wait too long, please check if ffmpeg is running")
        results = model.detectVideo(ws.rtmpUrl, classList=[0, 2])  # 0:person, 2:car

        for frameResult in results:
            cv2.imshow("image", frameResult.plot())
            cv2.waitKey(1)
            clsCount = model.getResultClsCount(frameResult)
            await ws.trySendAlarm(
                {
                    "algorithmType": "body",
                    "count": clsCount.get("person", 0),
                    "predictResult": frameResult,
                }
            )
            await ws.trySendAlarm(
                {
                    "algorithmType": "vehicle",
                    "count": clsCount.get("car", 0),
                    "predictResult": frameResult,
                }
            )

            await asyncio.sleep(0.5)
        pass

    tasks = []
    for cameraID in cameraIDs:
        client = WSClient(
            serverUrl,
            adminUsername,
            password,
            str(cameraID),
            beginWork,
        )
        tasks.append(asyncio.create_task(client.stayConnected()))
    await asyncio.gather(*tasks)
    pass


async def main():
    await detectVideoAndSendAlarmForCameras(
        serverUrl="http://localhost:3000",
        adminUsername="admin123",
        password="admin123",
        cameraIDs=[3],
    )
    pass


asyncio.run(main())
