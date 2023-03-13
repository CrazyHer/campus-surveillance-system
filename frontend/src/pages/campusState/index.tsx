import services from '@/services';
import ServiceTypes from '@/services/serviceTypes';
import { Button, message, Spin } from 'antd';
import { observer } from 'mobx-react';
import { FC, useCallback, useEffect, useState } from 'react';
import CampusMap from './campusMap';
import Styles from './index.module.less';
const CampusState: FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] =
    useState<ServiceTypes['GET /api/getCampusState']['res']['data']>();
  const fetchCampusState = async () => {
    try {
      setLoading(true);
      const res = await services['GET /api/getCampusState']();
      setData(res.data);
    } catch (error) {
      message.error(String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = useCallback(
    (
      cameraInfo: ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'][0],
    ) => {
      console.log('cameraInfo', cameraInfo);
    },
    [],
  );

  useEffect(() => {
    fetchCampusState();
  }, []);

  return (
    <Spin spinning={loading}>
      <div>
        <CampusMap
          className={Styles.map}
          cameraList={data?.cameraList}
          onCameraClick={handleCameraClick}
        />
        <div className={Styles.leftPanel}>
          <Button
            onClick={() => {
              setData({
                ...data!,
                cameraList: [
                  {
                    cameraName: '摄像头2',
                    cameraID: 2,
                    cameraStatus: 'offline',
                    latlng: [36.66553375772535, 117.13452323144844],
                    cameraModel: '摄像头型号2',
                    alarmRules: '报警规则2',
                    alarmEvents: [],
                  },
                ],
              });
            }}
          >
            +1
          </Button>
        </div>
        <div className={Styles.rightPanel}>
          <Button>1234</Button>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CampusState);
