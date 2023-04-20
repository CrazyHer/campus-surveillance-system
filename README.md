# 基于服务器本地地图的园区视频监控 web 系统

[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/crazyher/campus-surveillance-system?label=Docker%20Image%3A%20campus-surveillance-system)](https://hub.docker.com/r/crazyher/campus-surveillance-system)
[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/crazyher/campus-surveillance-ai-end?label=Docker%20Image%3A%20campus-surveillance-ai-end)](https://hub.docker.com/r/crazyher/campus-surveillance-ai-end)

## 题目介绍

摄像头已经成为公共区域和园区监控的主要检测设备。相较于公共区域，园区安防所使用的监控摄像头数量更多、分布也较为复杂。当今主流的传统视频监控系统并没有精确记录各个摄像头的地理位置信息和相对位置关系，而管理人员也只是将摄像头按照地理区域进行命名编号以区分，并不能在系统上直观地找到并分析各个摄像头之间的位置关系。当园区层数较多、地域空间复杂时，不便于监控的调取和管理。

同时，传统园区监控系统还需要工作人员值守监视画面，并在出现异常情况时需人工研判并上报事件。这大大限制了园区监控的可靠性、安全性、效率，并抬高了时间成本和人力成本。

因此，针对上述传统园区监控所面临的问题，设计并实现了一套基于服务器本地地图和深度学习技术的智能园区视频监控 web 系统，加载自定义本地园区地图数据，在摄像头位置加载到地图上，并进行视频流显示和管理；基于深度学习算法，对监控画面实时监测区域入侵、人员聚集、人员离岗等异常事件，能够自动识别并进行异常报警。

## 主要功能截图

待补充

## 系统说明

### 架构

系统架构主要由 web 前后端、监控算法端以及 RTMP 服务器几个部分组成，如下图：  
![系统架构图](docs/system-framework.png)

其中 RTMP 服务器只需要提供 RTMP 和 HLS 流的支持即可，在本系统中我们不关心其具体实现。可以使用 [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module) 在 nginx 上简单配置即可支持。

若要自搭建地图切片服务器，可参考[openstreetmap-tile-server](https://github.com/Overv/openstreetmap-tile-server)，使用 Docker 搭建服务器提供本地 OpenStreetMap 地图切片

### 部署和使用

前后端统一打包构建为 Docker Image：[crazyher/campus-surveillance-system](https://hub.docker.com/repository/docker/crazyher/campus-surveillance-system)

```shell
docker run -p 8080:80 -e MYSQL_HOST=localhost \
                      -e MYSQL_PORT=3306 \
                      -e MYSQL_DATABASE=campus-surveillance-system \
                      -e MYSQL_USER=root \
                      -e MYSQL_PASSWORD=root \
                      -e JWT_SECRET=secret \
                      -e JWT_EXPIRES_IN=30d \
                      -e URL_TO_PUBLIC_DIR=http://localhost:3000/public \
                      -- name campus-surveillance-system \
                      crazyher/campus-surveillance-system:latest
```

算法端单独打包构建为 Docke Image：[crazyher/campus-surveillance-ai-end](https://hub.docker.com/repository/docker/crazyher/campus-surveillance-ai-end/general)

```shell
docker run -e SERVER_URL="ws://localhost:8080" \
           -e ADMIN_USERNAME="admin" \
           -e ADMIN_PASSWORD="admin" \
           -e CAMERA_IDS="1,2,3" \
           --name campus-surveillance-ai-end \
           crazyher/campus-surveillance-ai-end:latest
```

### 前端

前端页面采用 React 技术栈编写，并嵌入 leaflet 地图渲染引擎以加载自定义图层。监控视频的实时流播放采用 HLS 协议。其中的 HLS 播放器使用 hls.js。

### 后端

后端使用 Typescript 语言并基于 Node.js 的 Nest 框架编写，主要负责处理业务逻辑，包括保存自定义园区地图数据、数据库 IO、提供前端管理操作的接口和监控算法端的事件上报接口。通过与监控算法端的解耦，以避免 AI 算法影响后端性能和稳定性。

### 监控算法端

监控算法端使用 Python 编写，主要任务是拉取监控摄像头的 RTMP 推流，并对流画面基于深度学习算法进行截帧分析。

主要工作是基于 YOLO v8 模型做目标检测，将监控视频 RTMP 流的每帧（或固定间隔取一帧）画面做目标检测和分类，实时统计监控画面中目标（根据目前的功能要求，目标为人）的位置和数量，并判断是否触发异常报警。

区域入侵事件，是指画面中人的位置与监控划定的非法区域发生重叠；人员聚集事件，是指画面中划定的区域内人的数量超过阈值；人员离岗事件，是指画面中划定的区域内人的数量低于阈值。

得益于 YOLO v8 算法的高性能、低开销特点，监控算法端可以做到分布式边缘计算，即部署到监控摄像头侧；也可以统一部署在高性能集群上，对所有摄像头的推流画面进行计算。

摄像头配置的获取、异常事件的上报通过与后端 Websocket 实时通信完成。
