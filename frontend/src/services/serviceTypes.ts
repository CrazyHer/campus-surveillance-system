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
        mapConfig: {
          mapOptions: {
            center: [number, number];
            zoom: number;
            minZoom: number;
            maxZoom: number;
            attributionControl: boolean;
            zoomControl: boolean;
          };
          layer:
            | {
                type: 'imageOverlay';
                url: string;
                bounds: [[number, number], [number, number]];
              }
            | {
                type: 'tileLayer';
                url: string;
              };
        };
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
      cameraID?: number;
    };
    res: {
      data: {
        eventID: number;
        alarmTime: string;
        alarmType: string;
        alarmStatus: 'solved' | 'pending';
        cameraID: number;
        cameraName: string;
        cameraLatlng: [number, number];
        cameraModel: string;
        alarmPicUrl: string;
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
  'GET /api/getUserInfo': {
    req: void;
    res: {
      data: {
        username: string;
        role: 'admin' | 'user';
        avatarURL: string;
        tel: string;
        email: string;
      };
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateUserInfo': {
    req: {
      username: string;
      avatarURL: string;
      tel: string;
      email: string;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/updatePassword': {
    req: {
      oldPassword: string;
      newPassword: string;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'GET /api/getMapConfig': {
    req: void;
    res: {
      data: {
        mapOptions: {
          center: [number, number];
          zoom: number;
          minZoom: number;
          maxZoom: number;
          attributionControl: boolean;
          zoomControl: boolean;
        };
        layer:
          | {
              type: 'imageOverlay';
              url: string;
              bounds: [[number, number], [number, number]];
            }
          | {
              type: 'tileLayer';
              url: string;
            };
      };
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateMapConfig': {
    req: {
      mapOptions: {
        center: [number, number];
        zoom: number;
        minZoom: number;
        maxZoom: number;
        attributionControl: boolean;
        zoomControl: boolean;
      };
      layer:
        | {
            type: 'imageOverlay';
            url: string;
            bounds: [[number, number], [number, number]];
          }
        | {
            type: 'tileLayer';
            url: string;
          };
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
}
