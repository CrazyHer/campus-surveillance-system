import { type FC, useEffect, useState } from 'react';
import Styles from './index.module.less';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
  TimePicker,
  message,
} from 'antd';
import { observer } from 'mobx-react';
import services from '@/services';
import { type ColumnType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import dayjs, { type Dayjs } from 'dayjs';
import type ServiceTypes from '@/services/serviceTypes';
import constants from '@/constants';

interface EditFormData {
  alarmRuleID: number;
  alarmRuleName: string;
  relatedCameraIds: number[];
  enabled: boolean;
  algorithmType: 'body' | 'vehicle';
  triggerCondition: {
    time: {
      dayOfWeek: number[];
      timeRange: [Dayjs, Dayjs];
    };
    count: {
      min: number;
      max: number;
    };
  };
}

type AddFormData = Omit<EditFormData, 'alarmRuleID'>;
type AlarmRuleFull =
  ServiceTypes['GET /api/admin/getAlarmRuleList']['res']['data'][number];

const AlarmRulesManage: FC = () => {
  const [alarmRuleList, setAlarmRuleList] = useState<AlarmRuleFull[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [editForm] = useForm<EditFormData>();
  const [addForm] = useForm<AddFormData>();
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [cameraList, setCameraList] = useState<AlarmRuleFull['relatedCameras']>(
    [],
  );

  const fetchAlarmRuleList = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      setAlarmRuleList(
        (await services['GET /api/admin/getAlarmRuleList']()).data,
      );
    } catch (error) {
      console.error(error);
      void message.error(String(error));
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCameraList = async (): Promise<void> => {
    try {
      setCameraList((await services['GET /api/admin/getCameraList']()).data);
    } catch (error) {
      console.error(error);
      void message.error(String(error));
    }
  };

  useEffect(() => {
    void fetchAlarmRuleList();
    void fetchCameraList();
  }, []);

  const handleAdd = () => {
    addForm.resetFields();
    addForm.setFieldValue('enabled', true);
    setAddModalVisible(true);
  };

  const handleEdit = async (data: AlarmRuleFull) => {
    editForm.resetFields();
    editForm.setFieldsValue({
      ...data,
      relatedCameraIds: data.relatedCameras?.map((v) => v.cameraID) ?? [],
      triggerCondition: {
        ...data.triggerCondition,
        time: {
          ...data.triggerCondition.time,
          timeRange: [
            dayjs(data.triggerCondition.time.timeRange[0], 'HH:mm:ss'),
            dayjs(data.triggerCondition.time.timeRange[1], 'HH:mm:ss'),
          ],
        },
      },
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (alarmRuleID: number) => {
    try {
      await services['POST /api/admin/deleteAlarmRule']({
        alarmRuleID,
      });
      void message.success('删除成功');
      void fetchAlarmRuleList();
    } catch (error) {
      console.error(error);
      void message.error(String(error));
    }
  };

  const handleAddSubmit = async () => {
    const formData = await addForm.validateFields();
    try {
      await services['POST /api/admin/addAlarmRule']({
        alarmRuleName: formData.alarmRuleName,
        algorithmType: formData.algorithmType,
        enabled: formData.enabled,
        relatedCameraIds: formData.relatedCameraIds,
        triggerCondition: {
          count: {
            max: formData.triggerCondition.count.max,
            min: formData.triggerCondition.count.min,
          },
          time: {
            dayOfWeek: formData.triggerCondition.time.dayOfWeek,
            timeRange: [
              formData.triggerCondition.time.timeRange[0].format('HH:mm:ss'),
              formData.triggerCondition.time.timeRange[1].format('HH:mm:ss'),
            ],
          },
        },
      });
      void message.success('添加成功');
      setAddModalVisible(false);
      void fetchAlarmRuleList();
    } catch (error) {
      console.error(error);
      void message.error(String(error));
    }
  };

  const handleEditSubmit = async () => {
    const formData = await editForm.validateFields();
    try {
      await services['POST /api/admin/updateAlarmRule']({
        alarmRuleID: formData.alarmRuleID,
        alarmRuleName: formData.alarmRuleName,
        algorithmType: formData.algorithmType,
        enabled: formData.enabled,
        relatedCameraIds: formData.relatedCameraIds,
        triggerCondition: {
          count: {
            max: formData.triggerCondition.count.max,
            min: formData.triggerCondition.count.min,
          },
          time: {
            dayOfWeek: formData.triggerCondition.time.dayOfWeek,
            timeRange: [
              formData.triggerCondition.time.timeRange[0].format('HH:mm:ss'),
              formData.triggerCondition.time.timeRange[1].format('HH:mm:ss'),
            ],
          },
        },
      });
      void message.success('修改成功');
      setEditModalVisible(false);
      void fetchAlarmRuleList();
    } catch (error) {
      console.error(error);
      void message.error(String(error));
    }
  };

  const columns: Array<ColumnType<AlarmRuleFull>> = [
    {
      title: '规则ID',
      dataIndex: 'alarmRuleID',
    },
    {
      title: '规则名称',
      dataIndex: 'alarmRuleName',
    },
    {
      title: '关联摄像头',
      dataIndex: 'relatedCameraIDs',
      render: (_v, record) =>
        record.relatedCameras?.map((v) => (
          <Tag key={v.cameraID}>{v.cameraName}</Tag>
        )),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_v, record) =>
        record.enabled ? (
          <Tag color="green">已启用</Tag>
        ) : (
          <Tag color="grey">已禁用</Tag>
        ),
    },
    {
      title: '监控算法',
      dataIndex: 'algorithmType',
      render: (_v, record) =>
        record.algorithmType === constants.alarmRuleAlgorithmType.BODY
          ? '人体检测'
          : '车辆检测',
    },
    {
      title: '操作',
      render: (_v, record) => (
        <Button.Group>
          <Button
            type="link"
            onClick={() => {
              void handleEdit(record);
            }}
          >
            配置
          </Button>
          <Popconfirm
            title="确认删除该条规则?"
            onConfirm={() => {
              void handleDelete(record.alarmRuleID);
            }}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Button.Group>
      ),
    },
  ];

  const commonFormItems = (
    <>
      <Form.Item
        label="规则名称"
        name="alarmRuleName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="关联摄像头"
        name="relatedCameraIds"
        rules={[{ required: true }]}
      >
        <Select<number[], AlarmRuleFull['relatedCameras'][number]>
          mode="multiple"
          allowClear
          options={cameraList}
          fieldNames={{ label: 'cameraName', value: 'cameraID' }}
        />
      </Form.Item>

      <Form.Item
        label="启用"
        name="enabled"
        valuePropName="checked"
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="监控算法"
        name="algorithmType"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: '人体检测', value: 'body' },
            { label: '车辆检测', value: 'vehicle' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name={['triggerCondition', 'time', 'dayOfWeek']}
        label="触发周期"
        rules={[{ required: true }]}
      >
        <Select<number[]>
          mode="multiple"
          allowClear
          options={[
            { label: '周一', value: 1 },
            { label: '周二', value: 2 },
            { label: '周三', value: 3 },
            { label: '周四', value: 4 },
            { label: '周五', value: 5 },
            { label: '周六', value: 6 },
            { label: '周日', value: 7 },
          ]}
        />
      </Form.Item>

      <Form.Item
        name={['triggerCondition', 'time', 'timeRange']}
        label="触发时间"
        rules={[{ required: true }]}
      >
        <TimePicker.RangePicker />
      </Form.Item>

      <Form.Item
        label="最小触发数量"
        name={['triggerCondition', 'count', 'min']}
        rules={[{ required: true }]}
      >
        <InputNumber min={-1} />
      </Form.Item>

      <Form.Item
        label="最大触发数量"
        name={['triggerCondition', 'count', 'max']}
        help="设置为-1表示不限制"
        rules={[{ required: true }]}
      >
        <InputNumber min={-1} />
      </Form.Item>
    </>
  );

  return (
    <Spin spinning={fetchLoading}>
      <div className={Styles.content}>
        <Card
          title="报警规则管理"
          extra={
            <Button type="primary" onClick={handleAdd}>
              新增规则
            </Button>
          }
        >
          <Table<AlarmRuleFull>
            columns={columns}
            dataSource={alarmRuleList}
            rowKey="alarmRuleID"
          />
        </Card>

        <Modal
          open={addModalVisible}
          title="新增规则"
          onCancel={() => {
            setAddModalVisible(false);
          }}
          footer={
            <Button.Group>
              <Button type="primary" onClick={handleAddSubmit}>
                提交
              </Button>
              <Button
                onClick={() => {
                  setAddModalVisible(false);
                }}
              >
                返回
              </Button>
            </Button.Group>
          }
        >
          <Form form={addForm} requiredMark={false}>
            {commonFormItems}
          </Form>
        </Modal>

        <Modal
          open={editModalVisible}
          title="配置规则"
          onCancel={() => {
            setEditModalVisible(false);
          }}
          footer={
            <Button.Group>
              <Button type="primary" onClick={handleEditSubmit}>
                保存
              </Button>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                }}
              >
                返回
              </Button>
            </Button.Group>
          }
        >
          <Form form={editForm} requiredMark={false}>
            <Form.Item
              label="规则ID"
              name="alarmRuleID"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>

            {commonFormItems}
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default observer(AlarmRulesManage);
