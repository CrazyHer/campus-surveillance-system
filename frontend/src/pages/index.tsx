import { observer } from 'mobx-react';
import { FC, useEffect } from 'react';
import { history } from 'umi';
import mobxStore from '@/mobxStore';
const IndexPage: FC = () => {
  useEffect(() => {
    console.log(mobxStore.user.token);
    if (mobxStore.user.token) {
      // 已登陆，跳转至首页
      history.push('/campusState');
    } else {
      history.push('/login');
    }
  }, []);
  return <div></div>;
};

export default observer(IndexPage);
