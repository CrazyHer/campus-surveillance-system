import ServiceTypes from '@/services/serviceTypes';
import { observer } from 'mobx-react';
import { FC, useEffect, useRef } from 'react';
import hls from 'hls.js';
import { Badge, Button, Card, Descriptions, Table } from 'antd';
import Styles from './index.module.less';
import { ColumnType } from 'antd/es/table';
import constants from '@/constants';
const CameraInfo: FC<{
  data?: ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'][0];
}> = (props) => {
  const tableColumns: ColumnType<
    ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'][0]['alarmEvents'][0]
  >[] = [
    {
      title: '报警时间',
      dataIndex: 'alarmTime',
      render: (value, record) =>
        record.alarmStatus === constants.alarmStatus.PENDING ? (
          <div style={{ color: 'red' }}>{value}</div>
        ) : (
          <div>{value}</div>
        ),
    },
    {
      title: '报警类型',
      dataIndex: 'alarmType',
      render: (value, record) =>
        record.alarmStatus === constants.alarmStatus.PENDING ? (
          <div style={{ color: 'red' }}>{value}</div>
        ) : (
          <div>{value}</div>
        ),
    },
    {
      title: '操作',
      render: (_value, record) =>
        record.alarmStatus === 'solved' ? (
          '已处理'
        ) : (
          <Button
            type="link"
            onClick={() => {
              console.log(record);
            }}
          >
            处理
          </Button>
        ),
    },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (
      videoRef.current &&
      props.data &&
      props.data?.cameraStatus !== constants.cameraStatus.OFFLINE
    ) {
      console.log('videoRef.current', videoRef.current);
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = props.data?.hlsUrl || '';
      } else if (hls.isSupported()) {
        const hlsPlayer = new hls({ lowLatencyMode: true });
        hlsPlayer.loadSource(props.data?.hlsUrl || '');
        hlsPlayer.attachMedia(videoRef.current);
      } else {
        videoRef.current.innerText = '您的浏览器不支持查看摄像头视频';
      }
    }
  }, [props.data, videoRef.current]);

  return (
    <Card
      title="摄像头信息"
      className={Styles.cameraInfoCard}
      bordered={false}
      size="small"
      extra={<Button>关闭</Button>}
    >
      <Descriptions
        layout="vertical"
        column={1}
        size="small"
        className={Styles.cameraDesc}
      >
        <Descriptions.Item label="实时画面">
          <video
            ref={videoRef}
            className={Styles.cameraVideo}
            autoPlay={true}
            muted
          />
        </Descriptions.Item>
      </Descriptions>

      <Descriptions column={1} size="small" className={Styles.cameraDesc}>
        <Descriptions.Item label="名称">
          {props?.data?.cameraName}
        </Descriptions.Item>
        <Descriptions.Item label="坐标">
          纬度：{props.data?.latlng[0]} <br />
          经度：{props?.data?.latlng[1]}
        </Descriptions.Item>
        <Descriptions.Item label="型号">
          {props?.data?.cameraModel}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {props?.data?.cameraStatus === constants.cameraStatus.NORMAL ? (
            <Badge status="success" text="正常" />
          ) : props?.data?.cameraStatus === constants.cameraStatus.OFFLINE ? (
            <Badge status="default" text="离线" />
          ) : (
            <Badge status="error" text="报警" />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="报警规则">
          {props?.data?.alarmRules}
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
            size="small"
            columns={tableColumns}
            dataSource={props.data?.alarmEvents}
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
