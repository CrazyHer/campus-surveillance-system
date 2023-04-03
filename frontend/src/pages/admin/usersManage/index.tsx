import { observer } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import Styles from './index.module.less';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  message,
} from 'antd';
import ServiceTypes, { UserInfo } from '@/services/serviceTypes';
import services from '@/services';
import { ColumnType } from 'antd/es/table';
import constants from '@/constants';
import { useForm } from 'antd/es/form/Form';
import CryptoJS from 'crypto-js';

type AddFormData = ServiceTypes['POST /api/admin/addUser']['req'];

type EditFormData = ServiceTypes['POST /api/admin/updateUser']['req'];

const UsersManage: FC = () => {
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [addForm] = useForm<AddFormData>();
  const [editForm] = useForm<EditFormData>();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchUserList = async () => {
    try {
      setFetchLoading(true);
      setUserList((await services['GET /api/admin/getUserList']()).data);
    } catch (error) {
      console.log(error);
      message.error(String(error));
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleAddUser = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleEditUser = (record: UserInfo) => {
    editForm.resetFields();
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await services['POST /api/admin/deleteUser']({ username });
      message.success('删除用户成功');
      fetchUserList();
    } catch (error) {
      console.log(error);
      message.error(String(error));
    }
  };

  const handleAddSubmit = async () => {
    const values = await addForm.validateFields();
    try {
      await services['POST /api/admin/addUser']({
        ...values,
        password: CryptoJS.HmacSHA256(
          values.password,
          constants.SHA256KEY,
        ).toString(CryptoJS.enc.Base64),
      });
      message.success('新增用户成功');
      setAddModalVisible(false);
      fetchUserList();
    } catch (error) {
      console.log(error);
      message.error(String(error));
    }
  };

  const handleEditSubmit = async () => {
    const values = await editForm.validateFields();
    try {
      await services['POST /api/admin/updateUser']({
        ...values,
        newPassword: values.newPassword
          ? CryptoJS.HmacSHA256(
              values.newPassword,
              constants.SHA256KEY,
            ).toString(CryptoJS.enc.Base64)
          : undefined,
      });
      message.success('编辑用户成功');
      setEditModalVisible(false);
      fetchUserList();
    } catch (error) {
      console.log(error);
      message.error(String(error));
    }
  };

  const columns: ColumnType<UserInfo>[] = [
    { title: '账号', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    {
      title: '权限',
      dataIndex: 'role',
      render: (_v, record) =>
        record.role === constants.userRole.ADMIN ? '管理员' : '普通用户',
    },
    { title: '邮箱', dataIndex: 'email' },
    { title: '电话', dataIndex: 'tel' },
    {
      title: '操作',
      render: (_v, record) => (
        <Button.Group>
          <Button type="link" onClick={() => handleEditUser(record)}>
            编辑
          </Button>

          <Popconfirm
            title="确认删除该用户?"
            onConfirm={() => handleDeleteUser(record.username)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Button.Group>
      ),
    },
  ];

  const commonFormItems = (
    <>
      <Form.Item label="权限" name="role" rules={[{ required: true }]}>
        <Select
          options={[
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' },
          ]}
        />
      </Form.Item>

      <Form.Item label="昵称" name="nickname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email" rules={[{ type: 'email' }]}>
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="电话"
        name="tel"
        rules={[{ pattern: /^\d{11}$/, message: '请输入11位手机号' }]}
      >
        <Input type="tel" />
      </Form.Item>
    </>
  );

  return (
    <Spin spinning={fetchLoading}>
      <div className={Styles.content}>
        <Card
          title="系统用户管理"
          extra={
            <Button type="primary" onClick={handleAddUser}>
              新增用户
            </Button>
          }
        >
          <Table<UserInfo>
            columns={columns}
            dataSource={userList}
            rowKey="username"
          />
        </Card>

        <Modal
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          title="新增用户"
          footer={
            <Button.Group>
              <Button type="primary" onClick={handleAddSubmit}>
                提交
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>取消</Button>
            </Button.Group>
          }
        >
          <Form form={addForm} requiredMark="optional">
            <Form.Item
              label="账号"
              name="username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true }]}
            >
              <Input type="password" />
            </Form.Item>

            {commonFormItems}
          </Form>
        </Modal>

        <Modal
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          title="编辑用户"
          footer={
            <Button.Group>
              <Button type="primary" onClick={handleEditSubmit}>
                提交
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            </Button.Group>
          }
        >
          <Form form={editForm} requiredMark="optional">
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>

            {commonFormItems}

            <Form.Item label="新密码" name="newPassword">
              <Input type="password" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
export default observer(UsersManage);
