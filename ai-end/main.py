from model import YOLOModel
from wsClient import WSClient
import asyncio
import multiprocessing
import os

# Windows推流本机摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -list_devices true -f dshow -i dummy
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -f flv rtmp://192.169.3.3:1515/hls/3


async def beginWork(ws: WSClient):
    model = YOLOModel()
    print(f"begin to detect video for camera {ws.cameraID}, rtmpUrl: {ws.rtmpUrl}")
    print(f"if wait too long, please check if ffmpeg is running")
    results = model.detectVideo(ws.rtmpUrl, classList=[0, 2])  # 0:person, 2:car

    for frameResult in results:
        # cv2.imshow(f"camera {ws.cameraID}", frameResult.plot())
        # cv2.waitKey(1)
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
        await asyncio.sleep(1)
    pass


async def detectVideoAndSendAlarmForCamera(
    serverUrl="", adminUsername="", password="", cameraID=""
):
    await WSClient(
        serverUrl,
        adminUsername,
        password,
        str(cameraID),
        beginWork,
    ).stayConnected()
    pass


def main(
    serverUrl="",
    adminUsername="",
    password="",
    cameraID="",
):
    asyncio.run(
        detectVideoAndSendAlarmForCamera(
            serverUrl,
            adminUsername,
            password,
            cameraID,
        )
    )
    pass


if __name__ == "__main__":
    multiprocessing.freeze_support()

    serverUrl = os.getenv("SERVER_URL", "ws://localhost/ws")
    adminUsername = os.getenv("ADMIN_USERNAME", "admin123")
    password = os.getenv("ADMIN_PASSWORD", "admin123")
    cameraIDs = os.getenv("CAMERA_IDS", "3").split(",")

    processes = []
    # start a process for each camera
    for cameraID in cameraIDs:
        p = multiprocessing.Process(
            target=main, args=(serverUrl, adminUsername, password, cameraID)
        )
        p.start()
        processes.append(p)
        pass

    # wait for all processes to finish
    for p in processes:
        p.join()

    pass
