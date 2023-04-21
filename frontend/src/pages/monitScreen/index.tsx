import services from '@/services';
import type ServiceTypes from '@/services/serviceTypes';
import { Badge, Card, List, Spin, message } from 'antd';
import { observer } from 'mobx-react';
import { type FC, useEffect, useState } from 'react';
import Styles from './index.module.less';
import constants from '@/constants';
import HlsPlayer from '../../components/hlsPlayer';

const MonitScreen: FC = () => {
  const [data, setData] = useState<
    ServiceTypes['GET /api/user/getMonitList']['res']['data']
  >([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setData((await services['GET /api/user/getMonitList']()).data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={Styles.content}>
      <Spin spinning={loading}>
        <List
          grid={{ column: 3, gutter: 16 }}
          dataSource={data}
          pagination={{
            defaultPageSize: 6,
            size: 'small',
            position: 'bottom',
            align: 'center',
            pageSizeOptions: [6, 12, 18, 24],
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: () => {
              setUpdate(!update);
            },
            hideOnSinglePage: true,
          }}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.cameraName}
                size="small"
                extra={
                  item.cameraStatus === constants.cameraStatus.NORMAL ? (
                    <Badge status="success" text="正常" />
                  ) : item.cameraStatus === constants.cameraStatus.OFFLINE ? (
                    <Badge status="default" text="离线" />
                  ) : (
                    <Badge status="error" text="报警" />
                  )
                }
              >
                <HlsPlayer item={item} className={Styles.video} />
              </Card>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

export default observer(MonitScreen);
