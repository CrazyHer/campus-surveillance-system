import { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import mobxStore from '@/mobxStore';
import { history, Outlet, useLocation } from 'umi';
import { message } from 'antd';
const AccessAuth: FC<{}> = () => {
  const location = useLocation();

  // 控制登陆才可访问的页面
  const requiredLoginPages = ['/'];
  useEffect(() => {
    if (
      !mobxStore.user.token &&
      requiredLoginPages.some((page) => location.pathname === page)
    ) {
      message.warning('请登录!');
      history.push('/login');
    }
  }, [location.pathname]);

  return <Outlet />;
};
export default observer(AccessAuth);
