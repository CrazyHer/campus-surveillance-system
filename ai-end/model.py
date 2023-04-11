from ultralytics import YOLO
import cv2


class YOLOModel:
    __model = None

    def __init__(self):
        self.__model = YOLO(model="./yolov8n.pt", task="detect")

    def detectImage(self, image):
        result = self.__model.predict(source=image, verbose=False)[0]
        clsCount = dict()
        detectedCls = result.boxes.cls
        for clsValue in detectedCls.unique():
            clsName = str(result.names[int(clsValue)])
            count = int((detectedCls == clsValue).sum())
            clsCount[clsName] = count
        result.clsCount = clsCount
        return result

    def detectVideo(self, video, onFrame=lambda frameResult: None):
        result = self.__model.predict(source=video, verbose=False, stream=True)
        for frame in result:
            clsCount = dict()
            detectedCls = frame.boxes.cls
            for clsValue in detectedCls.unique():
                clsName = str(frame.names[int(clsValue)])
                count = int((detectedCls == clsValue).sum())
                clsCount[clsName] = count
            frame.clsCount = clsCount
            onFrame(frame)

        return result
