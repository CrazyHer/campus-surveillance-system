import services from '@/services';
import ServiceTypes from '@/services/serviceTypes';
import { Badge, Card, List, message } from 'antd';
import { observer } from 'mobx-react';
import { FC, useEffect, useRef, useState } from 'react';
import Styles from './index.module.less';
import hls from 'hls.js';
const MonitScreen: FC<{}> = () => {
  const videosRef = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [data, setData] = useState<
    ServiceTypes['GET /api/getMonitList']['res']['data']
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setData((await services['GET /api/getMonitList']()).data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // init video
    data.forEach((item) => {
      const videoRef = videosRef.current?.get(item.cameraID);
      if (videoRef) {
        if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.src = item.hlsUrl;
        } else if (hls.isSupported()) {
          const hlsPlayer = new hls({ lowLatencyMode: true });
          hlsPlayer.loadSource(item.hlsUrl);
          hlsPlayer.attachMedia(videoRef);
        } else {
          videoRef.innerText = '您的浏览器不支持查看摄像头视频';
        }
      }
    });
  }, [data]);

  return (
    <div className={Styles.content}>
      <List
        loading={loading}
        grid={{ column: 3, gutter: 16 }}
        dataSource={data}
        pagination={{ pageSize: 9, size: 'small' }}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.cameraName}
              size="small"
              extra={
                item.cameraStatus === 'normal' ? (
                  <Badge status="success" text="正常" />
                ) : item.cameraStatus === 'offline' ? (
                  <Badge status="default" text="离线" />
                ) : (
                  <Badge status="error" text="报警" />
                )
              }
            >
              <video
                className={Styles.video}
                controls
                muted
                autoPlay
                ref={(nodeRef) =>
                  nodeRef && videosRef.current?.set(item.cameraID, nodeRef)
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default observer(MonitScreen);
