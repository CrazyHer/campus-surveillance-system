from model import YOLOModel
from wsClient import WSClient
import asyncio
import multiprocessing
import os

# Windows推流本机摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -list_devices true -f dshow -i dummy
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -g 30 -f flv rtmp://192.169.3.3:1515/live/3


def ffmpegStreamToRtmpServer(streamUrl, rtmpUrl):
    cmd = f'/bin/ffmpeg -hide_banner -loglevel error -i "{streamUrl}" -c:v libx264 -preset:v ultrafast -tune:v zerolatency -g 30 -f flv "{rtmpUrl}"'
    print(cmd)
    os.system(command=cmd)
    pass


async def beginWork(ws: WSClient):
    model = YOLOModel()

    rtmpUrl = ws.rtmpServerUrl + "/" + ws.cameraID
    ffmpegProcess = multiprocessing.Process(
        target=ffmpegStreamToRtmpServer, args=(ws.rtspUrl, rtmpUrl)
    )
    ffmpegProcess.start()

    print(f"Begin to detect video for camera {ws.cameraID}, rtmpUrl: {ws.rtspUrl}")
    print(f"if wait too long, please check if the stream url is correct")
    results = model.detectVideo(ws.rtspUrl, classList=[0, 2])  # 0:person, 2:car

    for frameResult in results:
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
        if not ffmpegProcess.is_alive():
            print(f"ffmpeg process for camera {ws.cameraID} is dead")
            break
        await asyncio.sleep(1)
    pass


async def detectVideoAndSendAlarmForCamera(
    wsServerUrl="", rtmpServerUrl="", adminUsername="", password="", cameraID=""
):
    await WSClient(
        wsServerUrl,
        rtmpServerUrl,
        adminUsername,
        password,
        str(cameraID),
        beginWork,
    ).stayConnected()
    pass


def main(
    serverUrl="",
    rtmpServerUrl="",
    adminUsername="",
    password="",
    cameraID="",
):
    asyncio.run(
        detectVideoAndSendAlarmForCamera(
            serverUrl,
            rtmpServerUrl,
            adminUsername,
            password,
            cameraID,
        )
    )
    pass


if __name__ == "__main__":
    multiprocessing.freeze_support()

    wsServerUrl = os.getenv("WS_SERVER_URL", "ws://localhost/ws")
    rtmpServerUrl = os.getenv("RTMP_SERVER_URL", "rtmp://localhost:1515/live")
    adminUsername = os.getenv("ADMIN_USERNAME", "admin123")
    password = os.getenv("ADMIN_PASSWORD", "admin123")
    cameraIDs = os.getenv("CAMERA_IDS", "11,13").split(",")

    processes = []
    # start a process for each camera
    for cameraID in cameraIDs:
        p = multiprocessing.Process(
            target=main,
            args=(wsServerUrl, rtmpServerUrl, adminUsername, password, cameraID),
        )
        p.start()
        processes.append(p)
        pass

    # wait for all processes to finish
    for p in processes:
        p.join()

    pass
