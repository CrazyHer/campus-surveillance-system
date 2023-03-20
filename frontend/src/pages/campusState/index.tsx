import services from '@/services';
import ServiceTypes from '@/services/serviceTypes';
import { message, Spin } from 'antd';
import { observer } from 'mobx-react';
import { FC, useCallback, useEffect, useState } from 'react';
import CameraInfo from './cameraInfo';
import CameraList from './cameraList';
import CampusMap from './campusMap';
import Styles from './index.module.less';
import StatusHeader from './statusHeader';
const CampusState: FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] =
    useState<ServiceTypes['GET /api/getCampusState']['res']['data']>();
  const [selectedCameraIds, setSelectedCameraIds] = useState<number[]>([]);
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

  const handleSelectCamera = useCallback(
    (currentCameraId: number) => {
      if (selectedCameraIds.includes(currentCameraId)) {
        setSelectedCameraIds([]);
      } else {
        setSelectedCameraIds([currentCameraId]);
      }
    },
    [selectedCameraIds],
  );

  const handleCheckCamera = useCallback(
    (cameraID: number) => {
      if (selectedCameraIds.includes(cameraID)) return;
      console.log('handleCheckCamera', cameraID);
      setSelectedCameraIds([cameraID]);
    },
    [selectedCameraIds],
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
          onCameraSelect={handleSelectCamera}
          selectedCameraIds={selectedCameraIds}
        />

        <div className={Styles.topPanel}>
          <StatusHeader data={data} />
        </div>

        <div className={Styles.leftPanel}>
          <CameraList
            data={data?.cameraList}
            onCameraCheck={handleCheckCamera}
          />
        </div>

        <div className={Styles.rightPanel}>
          {selectedCameraIds.length > 0 && (
            <CameraInfo cameraID={selectedCameraIds[0]} />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default observer(CampusState);
