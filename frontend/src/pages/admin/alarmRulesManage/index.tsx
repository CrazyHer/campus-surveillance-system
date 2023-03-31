import { FC } from 'react';
import Styles from './index.module.less';
import { Card } from 'antd';
import { observer } from 'mobx-react';

const AlarmRulesManage: FC = () => {
  return (
    <div className={Styles.content}>
      <Card title="报警规则管理"></Card>
    </div>
  );
};

export default observer(AlarmRulesManage);
