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
  nickname: string;
  role: 'admin' | 'user';
  avatarURL: string;
  tel: string;
  email: string;
}

export default interface ServiceTypes {
  'POST /api/user/login': {
    req: { username: string; password: string };
    res: {
      success: boolean;
      message: string;
      data: {
        token: string;
        userInfo: UserInfo;
      };
    };
  };
  'GET /api/user/getCampusState': {
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
  'GET /api/user/getCameraInfo': {
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
  'POST /api/user/resolveAlarm': {
    req: { eventID: number };
    res: { success: boolean; message: string; data: {} };
  };
  'GET /api/user/getAlarmEvents': {
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
  'GET /api/user/getMonitList': {
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
  'GET /api/user/getUserInfo': {
    req: void;
    res: {
      data: UserInfo;
      message: string;
      success: boolean;
    };
  };
  'POST /api/user/updateUserInfo': {
    req: Omit<UserInfo, 'role'>;
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/user/updatePassword': {
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
  'GET /api/user/getMapConfig': {
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
  'POST /api/admin/updateMapConfig': {
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
  'GET /api/admin/getCameraList': {
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
  'POST /api/admin/addCamera': {
    req: {
      cameraName: string;
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
  'POST /api/admin/updateCamera': {
    req: {
      cameraID: number;
      cameraName: string;
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
  'POST /api/admin/deleteCamera': {
    req: {
      cameraID: number;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'GET /api/admin/getAlarmRuleList': {
    req: void;
    res: {
      data: AlarmRuleFull[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/addAlarmRule': {
    req: Omit<AlarmRuleFull, 'alarmRuleID' | 'relatedCameras'> & {
      relatedCameraIds: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/updateAlarmRule': {
    req: Omit<AlarmRuleFull, 'relatedCameras'> & {
      relatedCameraIds: number[];
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/deleteAlarmRule': {
    req: {
      alarmRuleID: number;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'GET /api/admin/getUserList': {
    req: void;
    res: {
      data: UserInfo[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/addUser': {
    req: {
      username: string;
      role: 'admin' | 'user';
      nickname: string;
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
  'POST /api/admin/updateUser': {
    req: {
      username: string;
      role: 'admin' | 'user';
      nickname: string;
      tel?: string;
      email?: string;
      newPassword?: string;
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/deleteUser': {
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
