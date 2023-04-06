import { type FC, type ReactElement, useEffect } from 'react';
import { observer } from 'mobx-react';
import mobxStore from '@/mobxStore';
import { history, useLocation } from 'umi';
import { message } from 'antd';

const AccessAuth: FC<{ children: ReactElement }> = ({ children }) => {
  const location = useLocation();

  // 管理员才可访问的页面
  const requiredAdminPages: string[] = [];
  useEffect(() => {
    if (mobxStore.user.token === '') {
      void message.warning('请登录');
      history.replace('/login');
      return;
    }
    if (
      mobxStore.user.role !== 'admin' &&
      requiredAdminPages.some((page) => location.pathname === page)
    ) {
      void message.warning('无权限');
      history.back();
    }
  }, [location.pathname, mobxStore.user.token, mobxStore.user.role]);

  return children;
};
export default observer(AccessAuth);
