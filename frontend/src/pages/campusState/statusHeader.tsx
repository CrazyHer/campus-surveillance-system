import ServiceTypes from '@/services/serviceTypes';
import { Card } from 'antd';
import { observer } from 'mobx-react';
import { FC, useEffect, useState } from 'react';

const StatusHeader: FC<{
  data?: ServiceTypes['GET /api/getCampusState']['res']['data'];
}> = (props) => {
  const [timeStr, setTimeStr] = useState(new Date().toLocaleString());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleString());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div>{timeStr}</div>
      <div>总监控数量：{props.data?.cameraTotal}</div>
      <div>监控在线数量：{props.data?.cameraOnline}</div>
      <div>异常报警监控数量：{props.data?.cameraAlarm}</div>
      <div>未处理异常报警事件数量：{props.data?.alarmEventPending}</div>
    </>
  );
};

export default observer(StatusHeader);
