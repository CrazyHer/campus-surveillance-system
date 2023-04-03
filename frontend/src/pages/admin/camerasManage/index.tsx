import CameraStatusBadge from '@/components/cameraStatusBadge';
import CampusMap from '@/components/campusMap';
import mobxStore from '@/mobxStore';
import services from '@/services';
import ServiceTypes from '@/services/serviceTypes';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { LeafletMouseEvent, Map } from 'leaflet';
import { observer } from 'mobx-react';
import { FC, useEffect, useRef, useState } from 'react';
import Styles from './index.module.less';

type CameraList = ServiceTypes['GET /api/admin/getCameraList']['res']['data'];

interface AddFormData {
  cameraName: string;
  Lattitude: number;
  Longitude: number;
  cameraModel: string;
  alarmRuleIDs: number[];
}

interface EditFormData {
  cameraID: number;
  cameraName: string;
  Lattitude: number;
  Longitude: number;
  cameraModel: string;
  alarmRuleIDs: number[];
}

const CamerasManage: FC = () => {
  const [cameraList, setCameraList] = useState<CameraList>([]);
  const [alarmRuleList, setAlarmRuleList] = useState<
    ServiceTypes['GET /api/admin/getAlarmRuleList']['res']['data']
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedCameraIds, setSelectedCameraIds] = useState<number[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addCameraForm] = useForm<AddFormData>();
  const [editCameraForm] = useForm<EditFormData>();

  const fetchCameraList = async () => {
    try {
      setLoading(true);
      setCameraList((await services['GET /api/admin/getCameraList']()).data);
    } catch (error) {
      console.error(error);
      message.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchAlarmRuleList = async () => {
    try {
      setAlarmRuleList(
        (await services['GET /api/admin/getAlarmRuleList']()).data,
      );
    } catch (error) {
      console.error(error);
      message.error(String(error));
    }
  };

  useEffect(() => {
    fetchCameraList();
    fetchAlarmRuleList();
  }, []);

  const handleConfigCamera = (cameraInfo: CameraList[number]) => {
    editCameraForm.resetFields();
    editCameraForm.setFieldsValue({
      ...cameraInfo,
      Lattitude: cameraInfo.latlng[0],
      Longitude: cameraInfo.latlng[1],
      alarmRuleIDs: cameraInfo.alarmRules.map((item) => item.alarmRuleID),
    });
    setEditModalOpen(true);
  };

  const handleLocateCamera = (cameraID: number) => {
    setSelectedCameraIds([cameraID]);
  };

  const handleDeleteCamera = async (cameraID: number) => {
    try {
      await services['POST /api/admin/deleteCamera']({ cameraID });
      message.success('删除成功');
      fetchCameraList();
    } catch (error) {
      console.error(error);
      message.error(String(error));
    }
  };

  const handleMapCameraClick = (cameraID: number) => {
    if (selectedCameraIds[0] === cameraID) {
      const cameraInfo = cameraList.find((item) => item.cameraID === cameraID);
      cameraInfo && handleConfigCamera(cameraInfo);
      return;
    }
    setSelectedCameraIds([cameraID]);
  };

  const handleConfigSubmit = async () => {
    const formData = await editCameraForm.validateFields();

    try {
      await services['POST /api/admin/updateCamera']({
        cameraID: formData.cameraID,
        cameraName: formData.cameraName,
        latlng: [formData.Lattitude, formData.Longitude],
        cameraModel: formData.cameraModel,
        alarmRuleIDs: formData.alarmRuleIDs,
      });
      message.success('配置成功');
      setEditModalOpen(false);
      fetchCameraList();
    } catch (error) {
      console.error(error);
      message.error(String(error));
    }
  };

  const handleAddSubmit = async () => {
    const formData = await addCameraForm.validateFields();

    try {
      await services['POST /api/admin/addCamera']({
        cameraName: formData.cameraName,
        latlng: [formData.Lattitude, formData.Longitude],
        cameraModel: formData.cameraModel,
        alarmRuleIDs: formData.alarmRuleIDs,
      });
      message.success('添加成功');
      setAddModalOpen(false);
      fetchCameraList();
    } catch (error) {
      console.error(error);
      message.error(String(error));
    }
  };

  const handleMapClick = (e: LeafletMouseEvent) => {
    addCameraForm.resetFields();
    addCameraForm.setFieldsValue({
      Lattitude: e.latlng.lat,
      Longitude: e.latlng.lng,
    });
    setAddModalOpen(true);
  };
  const handleMapClickRef = useRef(handleMapClick);
  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  }, [handleMapClick]);

  const handleMapInit = async (map: Map) => {
    console.log('map init', map);
    map.on('click', handleMapClickRef.current);
  };

  const columns: ColumnsType<CameraList[number]> = [
    {
      title: '摄像头ID',
      dataIndex: 'cameraID',
    },
    {
      title: '摄像头名称',
      dataIndex: 'cameraName',
    },
    {
      title: '位置',
      dataIndex: 'latlng',
      render: (_v, { latlng }) => (
        <div>
          {latlng[0]}
          <br />
          {latlng[1]}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'cameraStatus',
      render: (_v, { cameraStatus }) => (
        <CameraStatusBadge status={cameraStatus} />
      ),
    },
    {
      title: '型号',
      dataIndex: 'cameraModel',
    },
    {
      title: '报警规则',
      dataIndex: 'alarmRules',
      render: (_v, { alarmRules }) => (
        <Space size="small" wrap>
          {alarmRules?.map((item) => (
            <Tag key={item.alarmRuleID}>{item.alarmRuleName}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      render: (_v, record) => (
        <Button.Group>
          <Button
            type="link"
            onClick={() => handleLocateCamera(record.cameraID)}
          >
            定位
          </Button>
          <Button type="link" onClick={() => handleConfigCamera(record)}>
            配置
          </Button>
          <Popconfirm
            title="确认删除该摄像头?"
            onConfirm={() => handleDeleteCamera(record.cameraID)}
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
        label="摄像头名称"
        name="cameraName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="位置坐标" required>
        <Space wrap>
          <Form.Item
            label="坐标经度"
            name="Longitude"
            noStyle
            rules={[{ required: true }]}
          >
            <InputNumber addonBefore="经度" />
          </Form.Item>
          <Form.Item
            label="坐标纬度"
            name="Lattitude"
            noStyle
            rules={[{ required: true }]}
          >
            <InputNumber addonBefore="纬度" />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="型号" name="cameraModel" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="报警规则" name="alarmRuleIDs">
        <Select<
          EditFormData['alarmRuleIDs'][number],
          (typeof alarmRuleList)[number]
        >
          mode="multiple"
          allowClear
          options={alarmRuleList}
          fieldNames={{ label: 'alarmRuleName', value: 'alarmRuleID' }}
        />
      </Form.Item>
    </>
  );

  return (
    <div className={Styles.content}>
      <Spin spinning={loading}>
        <Card title="摄像头管理">
          <CampusMap
            className={Styles.campusMap}
            mapConfig={mobxStore.mapConfig.config}
            cameraList={cameraList}
            selectedCameraIds={selectedCameraIds}
            onCameraClick={handleMapCameraClick}
            onInit={handleMapInit}
          />

          <Alert
            className={Styles.alert}
            message="提示：单击地图可在对应位置添加摄像头"
            type="info"
            showIcon
            closable
          />

          <Table<CameraList[number]>
            columns={columns}
            dataSource={cameraList}
            rowKey="cameraID"
          />
        </Card>
      </Spin>

      <Modal
        title="新增摄像头"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        centered
        footer={
          <>
            <Button type="primary" onClick={handleAddSubmit}>
              提交
            </Button>
            <Button onClick={() => setAddModalOpen(false)}>返回</Button>
          </>
        }
      >
        <Form form={addCameraForm}>{commonFormItems}</Form>
      </Modal>

      <Modal
        title="配置摄像头"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        centered
        footer={
          <>
            <Button type="primary" onClick={handleConfigSubmit}>
              提交
            </Button>
            <Popconfirm
              title="确认删除摄像头?"
              onConfirm={async () => {
                await handleDeleteCamera(
                  editCameraForm.getFieldValue('cameraID'),
                );
                setEditModalOpen(false);
              }}
            >
              <Button type="default" danger>
                删除
              </Button>
            </Popconfirm>

            <Button onClick={() => setEditModalOpen(false)}>返回</Button>
          </>
        }
      >
        <Form form={editCameraForm}>
          <Form.Item label="摄像头ID" name="cameraID">
            <Input disabled />
          </Form.Item>
          {commonFormItems}
        </Form>
      </Modal>
    </div>
  );
};

export default observer(CamerasManage);
