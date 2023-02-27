import { Form, Input, Button, message, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import crypto from 'crypto-js';
import Style from './index.module.less';
import sdudocIcon from '@/assets/filmIcon.svg';
import { history, useIntl } from 'umi';
import mobxStore from '@/mobxStore';
import { services } from '@/services';

interface IFormData {
  userID: string;
  password: string;
}

const Login: FC = () => {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [loading, setLoading] = useState<boolean>(false);
  const [isRegisterForm, setRegisterForm] = useState<boolean>(false);

  const [registerForm] = Form.useForm<IFormData>();
  const [loginForm] = Form.useForm<IFormData>();

  useEffect(() => {
    if (mobxStore.user.token) {
      // 已登陆，跳转至首页
      history.push('/');
    }
  }, [mobxStore.user.token]);

  const handleLogin = async (formData: IFormData) => {
    setLoading(true);
    try {
      const res = await services['POST /login']({
        username: formData.userID,
        // 对密码进行SHA256加密
        password: crypto
          .HmacSHA256(formData.password, 'sdudoc')
          .toString(crypto.enc.Base64),
      });

      if (res.success) {
        const { token } = res.data;
        mobxStore.user.setToken(token);
      } else {
        message.warning(`登陆失败`);
        console.error(res);
      }
    } catch (error) {
      message.error(`登陆失败，请求异常`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: IFormData) => {
    try {
      setLoading(true);
      console.log(data);
      // const res = await fetch['POST/register']({
      //   userID: data.userID,
      //   // 对密码进行SHA256加密
      //   password: crypto
      //     .HmacSHA256(data.password, 'sdudoc')
      //     .toString(crypto.enc.Base64),
      // });
      // if (res.code === 0) {
      //   message.success('注册成功，请登录！');
      //   setRegisterForm(false);
      //   registerForm.resetFields();
      // } else {
      //   message.error(`注册失败! ${res.message}`);
      // }
    } catch (error) {
      console.error(error);
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.body}>
      <div className={Style.header}>
        <span />
        <h1>{f('title')}</h1>
        <span />
      </div>
      <div className={Style.content}>
        <img className={Style.icon} alt="sdudoc" src={sdudocIcon} />

        <div className={Style.loginFrame}>
          {isRegisterForm ? (
            <Form
              key="registerForm"
              className={Style['register-form']}
              labelCol={{ span: 6 }}
              labelAlign="left"
              form={registerForm}
              onReset={() => registerForm.resetFields()}
              onFinish={handleRegister}
            >
              <Form.Item
                label="账号"
                name="userID"
                hasFeedback
                validateFirst
                rules={[
                  { required: true, message: '请输入账号' },
                  {
                    pattern: /^[\w@]*$/i,
                    message: '账号只允许字母、@和下划线_',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                hasFeedback
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                hasFeedback
                dependencies={['password']}
                rules={[
                  { required: true, message: '请再次输入密码！' },
                  ({ getFieldValue }) => ({
                    validator(_rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('重复密码输入不符！'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  className={Style['register-btn']}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  注册
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setRegisterForm(false);
                  }}
                >
                  返回登录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              key="loginForm"
              className={Style.loginForm}
              onFinish={handleLogin}
              form={loginForm}
            >
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
                <Input
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
                <Button
                  type="link"
                  onClick={() => {
                    setRegisterForm(true);
                  }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};
export default observer(Login);
