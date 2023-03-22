import constants from '@/constants';
import { Badge } from 'antd';
import { FC } from 'react';

const CameraStatusBadge: FC<{ status?: 'normal' | 'offline' | 'alarm' }> = (
  props,
) => {
  return props.status === constants.cameraStatus.NORMAL ? (
    <Badge status="success" text="正常" />
  ) : props.status === constants.cameraStatus.OFFLINE ? (
    <Badge status="default" text="离线" />
  ) : (
    <Badge status="error" text="报警" />
  );
};

export default CameraStatusBadge;
