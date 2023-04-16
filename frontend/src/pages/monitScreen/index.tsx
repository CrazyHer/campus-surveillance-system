import services from '@/services';
import type ServiceTypes from '@/services/serviceTypes';
import { Badge, Card, List, message } from 'antd';
import { observer } from 'mobx-react';
import { type FC, useEffect, useRef, useState } from 'react';
import Styles from './index.module.less';
import HLS from 'hls.js';
import constants from '@/constants';
const MonitScreen: FC = () => {
  const videosRef = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [data, setData] = useState<
    ServiceTypes['GET /api/user/getMonitList']['res']['data']
  >([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setData((await services['GET /api/user/getMonitList']()).data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const disposeFuncs: Array<() => void> = [];
    // init video
    data.forEach((item) => {
      const videoRef = videosRef.current?.get(item.cameraID);
      if (
        videoRef &&
        !videoRef.src &&
        !videoRef.currentSrc &&
        item.cameraStatus !== constants.cameraStatus.OFFLINE
      ) {
        if (videoRef.canPlayType('application/vnd.apple.mpegurl').length > 0) {
          videoRef.src = item.hlsUrl;
        } else if (HLS.isSupported()) {
          const hlsPlayer = new HLS({ lowLatencyMode: true });
          hlsPlayer.loadSource(item.hlsUrl);
          hlsPlayer.attachMedia(videoRef);
          disposeFuncs.push(() => {
            hlsPlayer.detachMedia();
            hlsPlayer.destroy();
          });
        } else {
          videoRef.innerText = '您的浏览器不支持查看摄像头视频';
        }
      }
    });
    return () => {
      disposeFuncs.forEach((func) => {
        func();
      });
    };
  }, [data, update]);

  return (
    <div className={Styles.content}>
      <List
        loading={loading}
        grid={{ column: 3, gutter: 16 }}
        dataSource={data}
        pagination={{
          defaultPageSize: 6,
          size: 'small',
          position: 'bottom',
          align: 'center',
          pageSizeOptions: [6, 12, 18, 24],
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: () => {
            setUpdate(!update);
          },
          hideOnSinglePage: true,
        }}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.cameraName}
              size="small"
              extra={
                item.cameraStatus === constants.cameraStatus.NORMAL ? (
                  <Badge status="success" text="正常" />
                ) : item.cameraStatus === constants.cameraStatus.OFFLINE ? (
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
                autoPlay={item.cameraStatus !== constants.cameraStatus.OFFLINE}
                ref={(nodeRef) =>
                  nodeRef != null &&
                  videosRef.current?.set(item.cameraID, nodeRef)
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
