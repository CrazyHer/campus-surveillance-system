import { Form, Input, Button, message, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import crypto from 'crypto-js';
import Style from './index.module.less';
import { history } from 'umi';
import mobxStore from '@/mobxStore';
import services from '@/services';
import loginIcon from '@/assets/loginIcon.png';

interface IFormData {
  userID: string;
  password: string;
}

const Login: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [loginForm] = Form.useForm<IFormData>();

  useEffect(() => {
    if (mobxStore.user.token) {
      // 已登陆，跳转至首页
      history.push('/campusState');
    }
  }, [mobxStore.user.token]);

  const handleLogin = async (formData: IFormData) => {
    setLoading(true);
    try {
      const res = await services['POST /api/login']({
        username: formData.userID,
        // 对密码进行SHA256加密
        password: crypto
          .HmacSHA256(formData.password, 'sdudoc')
          .toString(crypto.enc.Base64),
      });

      const { token, userInfo } = res.data;
      mobxStore.user.setToken(token);
      mobxStore.user.setUserInfo(userInfo);
    } catch (error) {
      message.error(`登陆失败`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.body}>
      <div className={Style.leftPic} />
      <div className={Style.rightContent}>
        <img className={Style.icon} src={loginIcon} />
        <div className={Style.title}>智慧园区 · 监控管理系统</div>
        <div className={Style.loginForm}>
          <Form key="loginForm" onFinish={handleLogin} form={loginForm}>
            <Form.Item
              name="userID"
              rules={[{ required: true, message: '请输入账号!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="账号" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: '100%', marginTop: '15px' }}
                type="primary"
                htmlType="submit"
                className={Style['login-form-button']}
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default observer(Login);
