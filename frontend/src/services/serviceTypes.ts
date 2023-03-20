export default interface ServiceTypes {
  'POST /api/login': {
    req: { username: string; password: string };
    res: {
      success: boolean;
      message: string;
      data: {
        token: string;
        userInfo: { avatarURL: string; username: string; role: string };
      };
    };
  };
  'GET /api/getCampusState': {
    req: void;
    res: {
      success: boolean;
      message: string;
      data: {
        cameraTotal: number;
        cameraOnline: number;
        cameraAlarm: number;
        alarmEventPending: number;
        cameraList: {
          cameraName: string;
          cameraID: number;
          cameraStatus: 'normal' | 'offline' | 'alarm';
          latlng: [number, number];
        }[];
      };
    };
  };
  'GET /api/getCameraInfo': {
    req: { cameraID: number };
    res: {
      data: {
        cameraName: string;
        cameraID: number;
        cameraStatus: 'normal' | 'offline' | 'alarm';
        hlsUrl: string;
        latlng: [number, number];
        cameraModel: string;
        alarmRules: string;
        alarmEvents: {
          eventID: number;
          alarmTime: string;
          alarmType: string;
          alarmStatus: 'solved' | 'pending';
        }[];
      };
      message: string;
      success: boolean;
    };
  };
  'POST /api/resolveAlarm': {
    req: { eventID: number };
    res: { success: boolean; message: string; data: {} };
  };
  'GET /api/getAlarmEvents': {
    req: {
      cameraID: number;
    };
    res: {
      data: {
        eventID: number;
        alarmTime: string;
        alarmType: string;
        alarmStatus: 'solved' | 'pending';
      }[];
      message: string;
      success: boolean;
    };
  };
  'GET /api/getMonitList': {
    req: void;
    res: {
      data: {
        cameraName: string;
        cameraID: number;
        cameraStatus: 'normal' | 'offline' | 'alarm';
        hlsUrl: string;
      }[];
    };
  };
}
