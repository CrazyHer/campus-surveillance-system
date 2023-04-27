import services from '@/services';
import type ServiceTypes from '@/services/serviceTypes';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
} from 'antd';
import { type ColumnType } from 'antd/es/table';
import { observer } from 'mobx-react';
import { type FC, useState } from 'react';
import Styles from './index.module.less';
import { useAntdTable } from 'ahooks';
import { useForm } from 'antd/es/form/Form';

type TableData =
  ServiceTypes['GET /api/user/getAlarmEvents']['res']['data']['list'][number];

interface FormData {
  alarmType?: string;
  cameraName?: string;
  alarmStatus?: string;
}

const Alarms: FC = () => {
  const columns: Array<ColumnType<TableData>> = [
    {
      title: '事件ID',
      dataIndex: 'eventID',
    },
    {
      title: '报警类型',
      dataIndex: ['alarmType'],
      render: (_v, record) => record.alarmRule.alarmRuleName,
    },

    { title: '报警源摄像头名称', dataIndex: 'cameraName' },

    {
      title: '摄像头型号',
      dataIndex: 'cameraModel',
    },
    { title: '摄像头ID', dataIndex: 'cameraID' },
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

  const [form] = useForm<FormData>();
  const { tableProps, refreshAsync, search, loading } = useAntdTable(
    async (params, formData: FormData) => {
      try {
        const res = await services['GET /api/user/getAlarmEvents']({
          current: params.current,
          pageSize: params.pageSize,
          ...formData,
        });
        return {
          total: res.data.total,
          list: res.data.list,
        };
      } catch (error) {
        message.error(String(error));
        console.error(error);
        return {
          total: 0,
          list: [],
        };
      }
    },
    { form },
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContext, setModalContext] = useState<TableData | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const handleCheck = async (eventID: number) => {
    try {
      setCheckLoading(true);
      await services['POST /api/user/resolveAlarm']({ eventID });
      message.success('处理成功');
      setModalVisible(false);
      refreshAsync();
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className={Styles.content}>
        <Card title="异常报警事件查询">
          <Form form={form} layout="inline">
            <Form.Item name="alarmType" label="报警类型">
              <Input />
            </Form.Item>
            <Form.Item name="cameraName" label="报警源摄像头名称">
              <Input />
            </Form.Item>
            <Form.Item name="resolved" label="状态">
              <Select
                placeholder="请选择"
                options={[
                  { label: '已处理', value: true },
                  { label: '未处理', value: false },
                ]}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={search.submit}>
                查询
              </Button>
              <Button type="link" onClick={search.reset}>
                重置
              </Button>
            </Form.Item>
          </Form>

          <Table columns={columns} rowKey="eventID" {...tableProps} />
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
    </Spin>
  );
};
export default observer(Alarms);
