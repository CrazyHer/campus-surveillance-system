import services from '@/services';
import type ServiceTypes from '@/services/serviceTypes';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Descriptions, message, Modal, Table, Tag } from 'antd';
import { type ColumnType } from 'antd/es/table';
import { observer } from 'mobx-react';
import { type FC, useEffect, useState } from 'react';
import Styles from './index.module.less';

type DataType = ServiceTypes['GET /api/user/getAlarmEvents']['res']['data'][0];
const Alarms: FC = () => {
  const columns: Array<ColumnType<DataType>> = [
    { title: '事件ID', dataIndex: 'eventID' },
    { title: '报警源摄像头名称', dataIndex: 'cameraName' },
    {
      title: '报警类型',
      dataIndex: 'alarmType',
      render: (_v, record) => <Tag>{record.alarmRule.alarmRuleName}</Tag>,
    },
    {
      title: '监控位置',
      dataIndex: 'cameraLatLng',
      render: (_v, record) =>
        `${record.cameraLatlng[0]},${record.cameraLatlng[1]}`,
    },
    {
      title: '状态',
      dataIndex: 'alarmStatus',
      render: (_v, record) =>
        record.resolved ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已处理
          </Tag>
        ) : (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            未处理
          </Tag>
        ),
    },
    { title: '报警时间', dataIndex: 'alarmTime' },
    {
      title: '操作',
      render: (_v, record) => (
        <Button
          type="link"
          onClick={() => {
            setModalContext(record);
            setModalVisible(true);
          }}
        >
          {record.resolved ? '查看' : '查看并处理'}
        </Button>
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setData((await services['GET /api/user/getAlarmEvents']({})).data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();

    // const timer = setInterval(() => {
    //   fetchData();
    // }, 10000);
    // return () => {
    //   clearInterval(timer);
    // };
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContext, setModalContext] = useState<DataType | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const handleCheck = async (eventID: number) => {
    try {
      setCheckLoading(true);
      await services['POST /api/user/resolveAlarm']({ eventID });
      message.success('处理成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className={Styles.content}>
      <Card title="异常报警事件查询">
        <Table
          loading={loading}
          columns={columns}
          size="small"
          dataSource={data}
          rowKey="eventID"
        />
      </Card>

      <Modal
        open={modalVisible}
        centered
        onCancel={() => {
          setModalVisible(false);
        }}
        okText
        closable={false}
        width={800}
        footer={
          <>
            {modalContext?.resolved === false && (
              <Button
                type="primary"
                onClick={async () => {
                  await handleCheck(modalContext.eventID);
                }}
                loading={checkLoading}
              >
                处理
              </Button>
            )}
            <Button
              onClick={() => {
                setModalVisible(false);
              }}
            >
              关闭
            </Button>
          </>
        }
      >
        {modalContext != null && (
          <Descriptions title="报警事件详情" bordered column={2}>
            <Descriptions.Item label="事件ID">
              {modalContext.eventID}
            </Descriptions.Item>
            <Descriptions.Item label="报警类型">
              {modalContext.alarmRule.alarmRuleName}
            </Descriptions.Item>
            <Descriptions.Item label="报警时间">
              {modalContext.alarmTime}
            </Descriptions.Item>
            <Descriptions.Item label="报警源摄像头名称">
              {modalContext.cameraName}
            </Descriptions.Item>
            <Descriptions.Item label="摄像头型号">
              {modalContext.cameraModel}
            </Descriptions.Item>

            <Descriptions.Item label="状态">
              {modalContext.resolved ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  已处理
                </Tag>
              ) : (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  未处理
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="监控位置" span={2}>
              {modalContext.cameraLatlng[0]}
              <br />
              {modalContext.cameraLatlng[1]}
            </Descriptions.Item>
            <Descriptions.Item label="报警图片" span={2}>
              <img
                src={modalContext.alarmPicUrl}
                alt="报警图片"
                style={{ width: '100%' }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
export default observer(Alarms);
