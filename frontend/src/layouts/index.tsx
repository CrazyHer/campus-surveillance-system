import { FC } from 'react';
import { Layout as AntdLayout, Menu, Dropdown, Button, Avatar } from 'antd';
import { observer } from 'mobx-react';
import Style from './index.module.less';
import { useIntl, history, Outlet } from 'umi';
import sduIcon from '@/assets/filmIcon.svg';
import mobxStore from '@/mobxStore';

const Layout: FC = () => {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const user = mobxStore.user;

  const handleLogoff = () => {
    user.logoff();
    history.replace('/login');
  };

  return (
    <AntdLayout style={{ backgroundColor: 'white' }}>
      <AntdLayout.Header
        style={{
          backgroundColor: 'white',
          borderBottom: 'solid 1px #dbdbdb',
          boxShadow: '0 2.5px 0 #f4f5f7',
          height: '67.5px',
          width: '100%',
          position: 'fixed',
          zIndex: 99,
        }}
      >
        <div className={Style.header}>
          <div className={Style.title}>
            <img src={sduIcon} alt="LOGO" />
            <h1>
              <b>{f('title')}</b>
            </h1>
          </div>

          <div>
            <Dropdown
              overlayStyle={{ position: 'fixed' }}
              menu={{
                items: [
                  { label: '个人信息', key: 1 },
                  { label: '注销登录', key: 2 },
                ],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  style={{ marginRight: '20px' }}
                  shape="circle"
                  size="large"
                  icon={<img src={user.avatarURL} alt="头像" />}
                />
                <div className={Style['user-tag']}>{user.username}</div>
              </div>
            </Dropdown>
          </div>
        </div>
      </AntdLayout.Header>
      <AntdLayout.Content style={{ marginTop: '80px' }}>
        <Outlet />
      </AntdLayout.Content>
    </AntdLayout>
  );
};
export default observer(Layout);
