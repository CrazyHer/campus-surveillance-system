export interface AlarmRuleBase {
  alarmRuleID: number;
  alarmRuleName: string;
}

export interface AlarmRuleFull extends AlarmRuleBase {
  relatedCameras: {
    cameraName: string;
    cameraID: number;
  }[];
  enabled: boolean;
  algorithmType: 'body' | 'vehicle';
  triggerCondition: {
    time: {
      dayOfWeek: number[];
      timeRange: [string, string];
    };
    count: {
      min: number;
      max: number;
    };
  };
}

export interface UserInfo {
  username: string;
  role: 'admin' | 'user';
  avatarURL: string;
  tel: string;
  email: string;
}

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
        alarmRules: AlarmRuleBase[];
        alarmEvents: {
          eventID: number;
          alarmTime: string;
          alarmRule: AlarmRuleBase;
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
        alarmRule: AlarmRuleBase;
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
      data: UserInfo;
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateUserInfo': {
    req: Omit<UserInfo, 'role'>;
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
  'GET /api/getCameraList': {
    req: void;
    res: {
      data: {
        cameraName: string;
        cameraID: number;
        cameraStatus: 'normal' | 'offline' | 'alarm';
        hlsUrl: string;
        latlng: [number, number];
        cameraModel: string;
        alarmRules: AlarmRuleBase[];
      }[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/addCamera': {
    req: {
      cameraName: string;
      hlsUrl: string;
      latlng: [number, number];
      cameraModel: string;
      alarmRuleIDs: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateCamera': {
    req: {
      cameraID: number;
      cameraName: string;
      hlsUrl: string;
      latlng: [number, number];
      cameraModel: string;
      alarmRuleIDs: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/deleteCamera': {
    req: {
      cameraID: number;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'GET /api/getAlarmRuleList': {
    req: void;
    res: {
      data: AlarmRuleFull[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/addAlarmRule': {
    req: Omit<AlarmRuleFull, 'alarmRuleID' | 'relatedCameras'> & {
      relatedCameraIds: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateAlarmRule': {
    req: Omit<AlarmRuleFull, 'relatedCameras'> & {
      relatedCameraIds: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/deleteAlarmRule': {
    req: {
      alarmRuleID: number;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'GET /api/getUserList': {
    req: void;
    res: {
      data: UserInfo[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/addUser': {
    req: {
      username: string;
      role: 'admin' | 'user';
      tel?: string;
      email?: string;
      password: string;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/updateUser': {
    req: UserInfo;
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/deleteUser': {
    req: {
      username: string;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
}
