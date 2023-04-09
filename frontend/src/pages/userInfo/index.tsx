import services from '@/services';
import type ServiceTypes from '@/services/serviceTypes';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Spin,
  Upload,
  type UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { observer } from 'mobx-react';
import { type FC, useEffect, useState } from 'react';
import Styles from './index.module.less';
import ImgCrop from 'antd-img-crop';
import { type UploadFile } from 'antd/es/upload';
import mobxStore from '@/mobxStore';
import constants from '@/constants';
import CryptoJS from 'crypto-js';

const getBase64 = async (file: File): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(String(reader.result));
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const UserInfo: FC = () => {
  const [data, setData] =
    useState<ServiceTypes['GET /api/user/getUserInfo']['res']['data']>();
  const [fetchLoading, setFetchLoading] = useState(false);
  type UserInfoForm = ServiceTypes['GET /api/user/getUserInfo']['res']['data'];
  const [userInfoForm] = useForm<UserInfoForm>();

  interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  const [passwordForm] = useForm<PasswordForm>();

  const [imgFileList, setImgFileList] = useState<UploadFile[]>([]);

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const res = await services['GET /api/user/getUserInfo']();
      setData(res.data);
      userInfoForm.setFieldsValue(res.data);
      setImgFileList([
        {
          name: res.data.username,
          url: res.data.avatarURL,
          uid: res.data.username,
        },
      ]);
      mobxStore.user.setUserInfo(res.data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAvatarChange: UploadProps['onChange'] = async ({ fileList }) => {
    setImgFileList(fileList);
  };

  const handleUserInfoSubmit = async (values: UserInfoForm) => {
    try {
      const avatarURL =
        (imgFileList[0]?.originFileObj != null
          ? await getBase64(imgFileList[0].originFileObj)
          : data?.avatarURL) ?? '';
      await services['POST /api/user/updateUserInfo']({
        ...values,
        avatarURL,
      });
      message.success('修改成功');
      fetchData();
    } catch (error) {
      message.error(String(error));
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (values: PasswordForm) => {
    try {
      await services['POST /api/user/updatePassword']({
        oldPassword: CryptoJS.HmacSHA256(
          values.oldPassword,
          constants.SHA256KEY,
        ).toString(CryptoJS.enc.Base64),
        newPassword: CryptoJS.HmacSHA256(
          values.newPassword,
          constants.SHA256KEY,
        ).toString(CryptoJS.enc.Base64),
      });
      message.success('修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error(String(error));
      console.error(error);
    }
  };

  return (
    <Spin spinning={fetchLoading}>
      <div className={Styles.content}>
        <Card title="修改个人信息" className={Styles.userInfoEditCard}>
          <Form
            form={userInfoForm}
            onFinish={handleUserInfoSubmit}
            onReset={(e) => {
              e.preventDefault();
              fetchData();
            }}
          >
            <Form.Item label="头像">
              <ImgCrop rotationSlider showReset cropShape="round">
                <Upload
                  accept="image/*"
                  listType="picture-circle"
                  showUploadList={{
                    showRemoveIcon: true,
                    showPreviewIcon: false,
                  }}
                  customRequest={({ onSuccess }) => {
                    setTimeout(() => {
                      onSuccess?.('ok');
                    }, 0);
                  }}
                  onRemove={() => {
                    setImgFileList([]);
                  }}
                  onChange={handleAvatarChange}
                  fileList={imgFileList}
                  maxCount={1}
                >
                  <div>
                    <div style={{ fontSize: 'large' }}>+</div>
                    <div>上传</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item
              label="账号"
              name="username"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true },
                { type: 'email', message: '请输入正确的邮箱' },
              ]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="tel"
              rules={[
                { required: true },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input type="tel" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button type="link" htmlType="reset" className={Styles.resetBtn}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="修改密码" className={Styles.passwordEditCard}>
          <Form form={passwordForm} onFinish={handlePasswordSubmit}>
            <Form.Item
              label="原密码"
              name="oldPassword"
              rules={[{ required: true }]}
            >
              <Input.Password type="password" />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[{ required: true }]}
            >
              <Input.Password type="password" />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  async validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      await Promise.resolve();
                      return;
                    }
                    return await Promise.reject(
                      new Error('两次输入的密码不一致'),
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password type="password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button type="link" htmlType="reset" className={Styles.resetBtn}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default observer(UserInfo);
