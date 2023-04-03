import { FC, useEffect, useMemo, useState } from 'react';
import { Layout as AntdLayout, Menu, Dropdown, Avatar, MenuProps } from 'antd';
import { observer } from 'mobx-react';
import Style from './index.module.less';
import { history, Outlet, useLocation } from 'umi';
import brandIcon from '@/assets/icon.png';
import mobxStore from '@/mobxStore';
import constants from '@/constants';
import { useFmtMsg } from '@/hooks/useFmtMsg';
import AccessAuth from '@/components/accessAuth';

const Layout: FC = () => {
  const f = useFmtMsg();
  const { pathname } = useLocation();

  const siderMenuItems = useMemo(() => {
    const items: MenuProps['items'] = [
      { label: '园区态势', key: '/campusState' },
      { label: '监控大屏', key: '/monitScreen' },
      { label: '异常报警', key: '/alarms' },
      { label: '个人信息维护', key: '/userInfo' },
      mobxStore.user.role === constants.userRole.ADMIN
        ? {
            label: '系统管理',
            key: '/admin',
            children: [
              { label: '园区地图管理', key: '/admin/mapManage' },
              { label: '摄像头管理', key: '/admin/camerasManage' },
              { label: '报警规则配置', key: '/admin/alarmRulesManage' },
              { label: '系统用户管理', key: '/admin/usersManage' },
            ],
          }
        : null,
    ];
    return items;
  }, [mobxStore.user.role]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
  const handleSelect: MenuProps['onSelect'] = (info) => {
    const { key } = info;
    console.log(info);
    setSelectedKeys([key]);
    history.push(key);
  };

  useEffect(() => {
    document.title = `${f(pathname as any)} - ${f('title')}`;
  }, [pathname]);

  const handleLogoff = () => {
    mobxStore.user.logoff();
    history.replace('/login');
  };
  return (
    <AccessAuth>
      <AntdLayout style={{ position: 'fixed', height: '100%', width: '100%' }}>
        <AntdLayout.Header className={Style.header}>
          <div className={Style.title}>
            <img src={brandIcon} alt="LOGO" />
            <h1>
              <b>{f('title')}</b>
            </h1>
          </div>

          <div>
            <Dropdown
              menu={{
                items: [{ label: '注销登录', key: 1, onClick: handleLogoff }],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  className={Style.avatar}
                  shape="circle"
                  size="large"
                  icon={<img src={mobxStore.user.avatarURL} alt="头像" />}
                />
                <div className={Style['username']}>
                  {mobxStore.user.nickname}
                </div>
              </div>
            </Dropdown>
          </div>
        </AntdLayout.Header>
        <AntdLayout>
          <AntdLayout.Sider theme="dark" breakpoint="lg" collapsedWidth="48px">
            <Menu
              theme="dark"
              mode="inline"
              items={siderMenuItems}
              onSelect={handleSelect}
              selectedKeys={selectedKeys}
              defaultOpenKeys={['/admin']}
            />
          </AntdLayout.Sider>
          <AntdLayout.Content className={Style.content}>
            <Outlet />
          </AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AccessAuth>
  );
};
export default observer(Layout);
