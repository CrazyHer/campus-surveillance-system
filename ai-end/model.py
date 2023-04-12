from ultralytics import YOLO


class YOLOModel:
    __model = None
    conf = 0.25

    def __init__(self, conf=0.25):
        self.conf = conf
        self.__model = YOLO(model="./yolov8n.pt", task="detect")

    def detectImage(self, image):
        result = self.__model.predict(
            source=image, verbose=False, conf=self.conf, line_thickness=1
        )[0]
        result.clsCount = self.getClsCount(result)
        return result

    def detectVideo(self, video):
        result = self.__model.predict(
            source=video,
            verbose=False,
            stream=True,
            line_thickness=1,
            conf=self.conf,
        )
        return result

    def getClsCount(self, result):
        clsCount = dict()
        detectedCls = result.boxes.cls
        for clsValue in detectedCls.unique():
            clsName = str(result.names[int(clsValue)])
            count = int((detectedCls == clsValue).sum())
            clsCount[clsName] = count
        return clsCount


pass
