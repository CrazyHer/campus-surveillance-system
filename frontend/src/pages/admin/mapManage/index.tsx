import CampusMap from '@/components/campusMap';
import mobxStore from '@/mobxStore';
import services from '@/services';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Space,
  Spin,
  Upload,
  type UploadFile,
} from 'antd';
import { type FormProps, useForm, useWatch } from 'antd/es/form/Form';
import { CRS, ImageOverlay, type MapOptions, TileLayer } from 'leaflet';
import { observer } from 'mobx-react';
import { type FC, useEffect, useState } from 'react';
import Styles from './index.module.less';

const getBase64 = async (file: File): Promise<string> =>
  await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { resolve(reader.result as string); };
    reader.onerror = (error) => { reject(error); };
  });

type IFormData =
  | {
      sourceType: 'osm';
      sourceURL: string;
      centerLat: number;
      centerLnt: number;
      zoomLevel: number;
    }
  | {
      sourceType: 'custom';
      sourceFile: [UploadFile];
      borderLeftBottomY: number;
      borderLeftBottomX: number;
      borderRightTopY: number;
      borderRightTopX: number;
      centerY: number;
      centerX: number;
      zoomLevel: number;
    };

const MapManage: FC = () => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [mapConfig, setMapConfig] = useState<MapOptions>({
    center: [0, 0],
    zoom: 0,
    attributionControl: false,
    zoomControl: false,
  });
  const [form] = useForm<IFormData>();
  const sourceType = useWatch('sourceType', form);
  const [submitLoading, setSubmitLoading] = useState(false);

  const previewMap = async (formData: IFormData) => {
    if (formData.sourceType === 'osm') {
      setMapConfig({
        center: [formData.centerLat, formData.centerLnt],
        zoom: formData.zoomLevel,
        minZoom: formData.zoomLevel,
        maxZoom: formData.zoomLevel,
        zoomControl: false,
        attributionControl: false,
        layers: [new TileLayer(formData.sourceURL)],
      });
    } else if (formData.sourceType === 'custom') {
      let sourceURL: string;
      if ((formData.sourceFile?.[0]?.originFileObj) != null) {
        sourceURL = await getBase64(formData.sourceFile[0].originFileObj);
      } else {
        sourceURL = formData.sourceFile?.[0]?.url ?? '';
      }

      setMapConfig({
        center: [formData.centerY, formData.centerX],
        zoom: formData.zoomLevel,
        minZoom: formData.zoomLevel,
        maxZoom: formData.zoomLevel,
        zoomControl: false,
        attributionControl: false,
        crs: CRS.Simple,
        layers: [
          new ImageOverlay(sourceURL, [
            [formData.borderLeftBottomY, formData.borderLeftBottomX],
            [formData.borderRightTopY, formData.borderRightTopX],
          ]),
        ],
      });
    }
  };

  const fetchAndInitData = async () => {
    try {
      setFetchLoading(true);
      const data = await mobxStore.mapConfig.fetchAndSetMapConfig();

      if (data.layer.type === 'imageOverlay') {
        const formData: IFormData = {
          sourceType: 'custom',
          sourceFile: [
            {
              uid: '1',
              name: 'map.png',
              status: 'done',
              url: data.layer.url,
            },
          ],
          borderLeftBottomY: data.layer.bounds[0][0],
          borderLeftBottomX: data.layer.bounds[0][1],
          borderRightTopY: data.layer.bounds[1][0],
          borderRightTopX: data.layer.bounds[1][1],
          centerY: data.mapOptions.center[0],
          centerX: data.mapOptions.center[1],
          zoomLevel: data.mapOptions.zoom,
        };
        form.setFieldsValue(formData);
        previewMap(formData);
      } else if (data.layer.type === 'tileLayer') {
        const formData: IFormData = {
          sourceType: 'osm',
          sourceURL: data.layer.url,
          centerLat: data.mapOptions.center[0],
          centerLnt: data.mapOptions.center[1],
          zoomLevel: data.mapOptions.zoom,
        };
        form.setFieldsValue(formData);
        previewMap(formData);
      }
    } catch (error) {
      console.error(error);
      message.error(String(error));
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAndInitData();
  }, []);

  const handleSubmit = async (formData: IFormData) => {
    try {
      setSubmitLoading(true);
      if (formData.sourceType === 'osm') {
        await services['POST /api/admin/updateMapConfig']({
          layer: {
            type: 'tileLayer',
            url: formData.sourceURL,
          },
          mapOptions: {
            center: [formData.centerLat, formData.centerLnt],
            zoom: formData.zoomLevel,
            minZoom: formData.zoomLevel,
            maxZoom: formData.zoomLevel,
            zoomControl: false,
            attributionControl: false,
          },
        });
      } else {
        let sourceURL: string;
        if ((formData.sourceFile?.[0]?.originFileObj) != null) {
          sourceURL = await getBase64(formData.sourceFile[0].originFileObj);
        } else {
          sourceURL = formData.sourceFile?.[0]?.url ?? '';
        }

        await services['POST /api/admin/updateMapConfig']({
          layer: {
            type: 'imageOverlay',
            url: sourceURL,
            bounds: [
              [formData.borderLeftBottomY, formData.borderLeftBottomX],
              [formData.borderRightTopY, formData.borderRightTopX],
            ],
          },
          mapOptions: {
            center: [formData.centerY, formData.centerX],
            zoom: formData.zoomLevel,
            minZoom: formData.zoomLevel,
            maxZoom: formData.zoomLevel,
            zoomControl: false,
            attributionControl: false,
          },
        });
      }
      message.success('保存成功');
      fetchAndInitData();
    } catch (error) {
      console.error(error);
      message.error(String(error));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePreview = async () => {
    const formData = await form.validateFields();
    await previewMap(formData);
  };

  const handleReset: FormProps['onReset'] = (e) => {
    e?.preventDefault();
    fetchAndInitData();
  };

  return (
    <Spin spinning={fetchLoading}>
      <div className={Styles.content}>
        <Card title="地图管理">
          <Form
            form={form}
            onFinish={handleSubmit}
            onReset={handleReset}
            requiredMark={false}
          >
            <Form.Item
              label="地图源"
              name="sourceType"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="osm">OpenStreetMap</Radio>
                <Radio value="custom">自定义</Radio>
              </Radio.Group>
            </Form.Item>

            {sourceType === 'osm' && (
              <>
                <Form.Item
                  label="地图源地址"
                  name="sourceURL"
                  rules={[{ required: true }]}
                >
                  <Input type="url" />
                </Form.Item>

                <Form.Item label="中心坐标" required>
                  <Space>
                    <Form.Item
                      label="中心坐标纬度"
                      name="centerLat"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <InputNumber addonBefore="纬度" />
                    </Form.Item>
                    <Form.Item
                      label="中心坐标经度"
                      name="centerLnt"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <InputNumber addonBefore="经度" />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="缩放等级"
                  name="zoomLevel"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </>
            )}

            {sourceType === 'custom' && (
              <>
                <Form.Item
                  label="自定义地图源文件"
                  name="sourceFile"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                  rules={[{ required: true }]}
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>上传</Button>
                  </Upload>
                </Form.Item>

                <Form.Item label="边界坐标" required>
                  <Space direction="vertical">
                    <Space>
                      <Form.Item
                        label="边界左下角坐标X轴"
                        name="borderLeftBottomX"
                        noStyle
                        rules={[{ required: true }]}
                      >
                        <InputNumber addonBefore="左下角X轴" />
                      </Form.Item>
                      <Form.Item
                        label="边界左下角坐标Y轴"
                        name="borderLeftBottomY"
                        noStyle
                        rules={[{ required: true }]}
                      >
                        <InputNumber addonBefore="左下角Y轴" />
                      </Form.Item>
                    </Space>
                    <Space>
                      <Form.Item
                        label="边界右上角坐标X轴"
                        name="borderRightTopX"
                        noStyle
                        rules={[{ required: true }]}
                      >
                        <InputNumber addonBefore="右上角X轴" />
                      </Form.Item>
                      <Form.Item
                        label="边界右上角坐标Y轴"
                        name="borderRightTopY"
                        noStyle
                        rules={[{ required: true }]}
                      >
                        <InputNumber addonBefore="右上角Y轴" />
                      </Form.Item>
                    </Space>
                  </Space>
                </Form.Item>

                <Form.Item label="中心坐标" required>
                  <Space>
                    <Form.Item
                      label="中心坐标X轴"
                      name="centerX"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <InputNumber addonBefore="X轴" />
                    </Form.Item>
                    <Form.Item
                      label="中心坐标Y轴"
                      name="centerY"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <InputNumber addonBefore="Y轴" />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="缩放等级"
                  name="zoomLevel"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  保存
                </Button>
                <Button
                  type="default"
                  htmlType="button"
                  onClick={handlePreview}
                >
                  预览
                </Button>
                <Button type="link" htmlType="reset">
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Form layout="vertical">
            <Form.Item label="地图预览">
              <CampusMap className={Styles.campusMap} mapConfig={mapConfig} />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default observer(MapManage);
