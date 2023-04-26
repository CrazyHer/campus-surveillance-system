from model import YOLOModel
from wsClient import WSClient
import asyncio
import multiprocessing
import os
import requests
import base64
import hashlib
import hmac


def getOfflineCameraIDs(httpServerUrl, adminUsername, password):
    __SHA256KEY = "campus-surveillance-system".encode("utf-8")
    r = requests.get(
        httpServerUrl + "/api/ai/getOfflineCameraList",
        params={
            "adminUsername": adminUsername,
            "password": base64.b64encode(
                hmac.new(__SHA256KEY, password.encode("utf-8"), hashlib.sha256).digest()
            ).decode("utf-8"),
        },
    )
    res = r.json()
    if not res["success"]:
        raise Exception(res["message"])

    return list(map(lambda x: x["cameraID"], res["data"]))


# Windows推流本机摄像头到rtmp://localhost:1515/hls/3
# ffmpeg -list_devices true -f dshow -i dummy
# ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -g 30 -f flv rtmp://192.169.3.3:1515/live/3


def ffmpegStreamToRtmpServer(streamUrl, rtmpUrl):
    print("exec ffmpeg...")
    os.execvp(
        "/usr/bin/ffmpeg",
        f"/usr/bin/ffmpeg -hide_banner -loglevel error -i {streamUrl} -c:v libx264 -preset:v ultrafast -tune:v zerolatency -g 30 -f flv {rtmpUrl}".split(
            " "
        ),
    )
    pass


async def beginWork(ws: WSClient):
    rtmpUrl = ws.rtmpServerUrl + "/" + ws.cameraID
    ffmpegProcess = multiprocessing.Process(
        target=ffmpegStreamToRtmpServer, args=(ws.rtspUrl, rtmpUrl), daemon=True
    )
    try:
        model = YOLOModel()

        ffmpegProcess.start()

        print(
            f"Begin to detect video for camera {ws.cameraID}, streamUrl: {ws.rtspUrl}"
        )
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
            await asyncio.sleep(ws.context.get("interval", 1))

            pass
    finally:
        ffmpegProcess.kill()
        await ws.disconnect()
        print("error, kill ffmpeg process")

    pass


def main(
    wsServerUrl="",
    rtmpServerUrl="",
    adminUsername="",
    password="",
    cameraID="",
    detectionInterval=1,
):
    asyncio.run(
        WSClient(
            wsServerUrl,
            rtmpServerUrl,
            adminUsername,
            password,
            str(cameraID),
            beginWork,
            {"interval": detectionInterval},
        ).stayConnected()
    )
    pass


if __name__ == "__main__":
    multiprocessing.freeze_support()
    httpServerUrl = os.getenv("HTTP_SERVER_URL", "http://localhost")
    wsServerUrl = httpServerUrl + "/ws"
    rtmpServerUrl = os.getenv("RTMP_SERVER_URL", "rtmp://localhost:1515/live")
    adminUsername = os.getenv("ADMIN_USERNAME", "admin123")
    password = os.getenv("ADMIN_PASSWORD", "admin123")
    cameraIDs = []
    if os.getenv("CAMERA_IDS") is not None:
        cameraIDs = os.getenv("CAMERA_IDS").split(",")
    else:
        cameraIDs = getOfflineCameraIDs(httpServerUrl, adminUsername, password)

    detectionInterval = os.getenv("DETECTION_INTERVAL", 1)

    processes = []
    # start a process for each camera
    for cameraID in cameraIDs:
        p = multiprocessing.Process(
            target=main,
            args=(
                wsServerUrl,
                rtmpServerUrl,
                adminUsername,
                password,
                cameraID,
                detectionInterval,
            ),
        )
        p.start()
        processes.append(p)
        pass

    # wait for all processes to finish
    for p in processes:
        p.join()

    pass
