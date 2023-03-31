import { observer } from 'mobx-react';
import { FC } from 'react';
import Styles from './index.module.less';
import { Card } from 'antd';

const UsersManage: FC = () => {
  return (
    <div className={Styles.content}>
      <Card title="系统用户管理"></Card>
    </div>
  );
};
export default observer(UsersManage);
