import constants from '@/constants';
import ServiceTypes from '@/services/serviceTypes';
import { Badge, Button, Card, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { observer } from 'mobx-react';
import { FC } from 'react';
import Styles from './index.module.less';
const CameraList: FC<{
  data?: ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'];
  onCameraCheck: (cameraID: number) => any;
}> = (props) => {
  const columns: ColumnType<
    ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'][0]
  >[] = [
    { title: '摄像头名称', dataIndex: 'cameraName' },
    {
      title: '状态',
      dataIndex: 'cameraStatus',
      render: (_value, record) =>
        record.cameraStatus === constants.cameraStatus.NORMAL ? (
          <Badge status="success" text="正常" />
        ) : record.cameraStatus === constants.cameraStatus.OFFLINE ? (
          <Badge status="default" text="离线" />
        ) : (
          <Badge status="error" text="报警" />
        ),
    },
    {
      title: '操作',
      render: (_value, record) => {
        return (
          <Button
            type="link"
            onClick={() => props.onCameraCheck(record.cameraID)}
          >
            查看
          </Button>
        );
      },
    },
  ];
  return (
    <Card title="摄像头列表" bordered={false} size="small">
      <Table
        className={Styles.table}
        size="small"
        columns={columns}
        dataSource={props.data}
        rowKey="cameraID"
      />
    </Card>
  );
};

export default observer(CameraList);
