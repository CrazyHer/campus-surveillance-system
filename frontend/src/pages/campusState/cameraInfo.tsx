import type ServiceTypes from '@/services/serviceTypes';
import { observer } from 'mobx-react';
import { type FC, useEffect, useRef, useState } from 'react';
import HLS from 'hls.js';
import { Button, Card, Descriptions, message, Spin, Table, Tag } from 'antd';
import Styles from './index.module.less';
import { type ColumnType } from 'antd/es/table';
import constants from '@/constants';
import services from '@/services';
import CameraStatusBadge from '@/components/cameraStatusBadge';
const CameraInfo: FC<{
  cameraID: number;
}> = (props) => {
  const [data, setData] =
    useState<ServiceTypes['GET /api/user/getCameraInfo']['res']['data']>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);

  const fetchCameraInfo = async () => {
    try {
      setFetchLoading(true);
      setData(
        (
          await services['GET /api/user/getCameraInfo']({
            cameraID: props.cameraID,
          })
        ).data,
      );
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };
  useEffect(() => {
    fetchCameraInfo();

    // const timer = setInterval(() => {
    //   fetchCameraInfo();
    // }, 10000);
    // return () => {
    //   clearInterval(timer);
    // };
  }, [props.cameraID]);

  const handleResolveAlarm = async (eventID: number) => {
    try {
      setResolveLoading(true);
      await services['POST /api/user/resolveAlarm']({ eventID });
      setData(
        (
          await services['GET /api/user/getCameraInfo']({
            cameraID: props.cameraID,
          })
        ).data,
      );
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setResolveLoading(false);
    }
  };

  const tableColumns: Array<
    ColumnType<
      ServiceTypes['GET /api/user/getCameraInfo']['res']['data']['alarmEvents'][0]
    >
  > = [
    {
      title: '报警时间',
      dataIndex: 'alarmTime',
      render: (value, record) =>
        record.resolved ? (
          <div>{value}</div>
        ) : (
          <div style={{ color: 'red' }}>{value}</div>
        ),
    },
    {
      title: '报警类型',
      render: (_v, record) =>
        record.resolved ? (
          <div>{record.alarmRule.alarmRuleName}</div>
        ) : (
          <div style={{ color: 'red' }}>{record.alarmRule.alarmRuleName}</div>
        ),
    },
    {
      title: '操作',
      render: (_value, record) =>
        record.resolved ? (
          '已处理'
        ) : (
          <Button
            type="link"
            onClick={async () => {
              await handleResolveAlarm(record.eventID);
            }}
            loading={resolveLoading}
          >
            处理
          </Button>
        ),
    },
  ];

  const [videoLoading, setVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (
      videoRef.current != null &&
      data != null &&
      data?.cameraStatus !== constants.cameraStatus.OFFLINE
    ) {
      setVideoLoading(true);
      if (
        videoRef.current.canPlayType('application/vnd.apple.mpegurl').length > 0
      ) {
        videoRef.current.src = data.hlsUrl;
      } else if (HLS.isSupported()) {
        const hlsPlayer = new HLS({ lowLatencyMode: true });
        hlsPlayer.loadSource(data.hlsUrl);
        hlsPlayer.attachMedia(videoRef.current);
        return () => {
          hlsPlayer.detachMedia();
          hlsPlayer.destroy();
        };
      } else {
        videoRef.current.innerText = '您的浏览器不支持查看摄像头视频';
        setVideoLoading(false);
      }
    }
  }, [data?.hlsUrl, data?.cameraStatus]);

  const handleError = () => {
    setVideoLoading(false);
    message.error('视频加载失败');
  };

  return (
    <Card
      title="摄像头信息"
      className={Styles.cameraInfoCard}
      bordered={false}
      size="small"
      loading={fetchLoading}
    >
      {data?.cameraStatus !== constants.cameraStatus.OFFLINE && (
        <Spin spinning={videoLoading}>
          <video
            onPlay={() => {
              setVideoLoading(false);
            }}
            onError={handleError}
            ref={videoRef}
            className={Styles.cameraVideo}
            autoPlay={true}
            muted
          />
        </Spin>
      )}

      <Descriptions column={1} size="small" className={Styles.cameraDesc}>
        <Descriptions.Item label="名称">{data?.cameraName}</Descriptions.Item>
        <Descriptions.Item label="坐标">
          纬度：{data?.latlng[0]} <br />
          经度：{data?.latlng[1]}
        </Descriptions.Item>
        <Descriptions.Item label="型号">{data?.cameraModel}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <CameraStatusBadge
            status={data?.cameraStatus as 'normal' | 'offline' | 'alarm'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="报警规则">
          {data?.alarmRules.map((rule) => (
            <Tag key={rule.alarmRuleID}>{rule.alarmRuleName}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        layout="vertical"
        column={1}
        size="small"
        className={Styles.cameraDesc}
      >
        <Descriptions.Item label="异常报警事件">
          <Table
            pagination={{ pageSizeOptions: [5, 10] }}
            size="small"
            columns={tableColumns}
            dataSource={data?.alarmEvents}
            showHeader={false}
            rowKey="eventID"
            className={Styles.alarmEventsTable}
          />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default observer(CameraInfo);
