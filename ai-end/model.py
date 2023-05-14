from ultralytics import YOLO


class YOLOModel:
    __model = None
    conf = 0.5
    device = "cpu"

    def __init__(self, conf=0.5, device="cpu"):
        self.conf = conf
        self.device = device
        self.__model = YOLO(model="./yolov8n.pt", task="detect")

    def detectImage(self, image, classList=[0, 2]):
        result = self.__model.predict(
            source=image,
            verbose=False,
            conf=self.conf,
            line_thickness=1,
            classes=classList,
            device=self.device,
        )[0]
        result.clsCount = self.getResultClsCount(result)
        return result

    def detectVideo(self, video, classList=[0, 2]):
        result = self.__model.predict(
            source=video,
            verbose=False,
            stream=True,
            line_thickness=1,
            conf=self.conf,
            classes=classList,
            device=self.device,
        )
        return result

    def getResultClsCount(self, result):
        clsCount = dict()
        detectedCls = result.boxes.cls
        for clsValue in detectedCls.unique():
            clsName = str(result.names[int(clsValue)])
            count = int((detectedCls == clsValue).sum())
            clsCount[clsName] = count
        return clsCount

    def getSupportedClsList(self):
        return self.__model.names


pass
