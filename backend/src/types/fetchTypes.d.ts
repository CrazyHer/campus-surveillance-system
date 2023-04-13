/* eslint-disable @typescript-eslint/ban-types */

// Stay consistent with the frontend/src/services/serviceTypes.ts

export interface FetchTypes {
  'POST /api/user/login': {
    req: { username: string; password: string };
    res: {
      success: boolean;
      message: string;
      data: {
        token: string;
        userInfo: {
          username: string;
          nickname: string;
          role: string;
          avatarURL: string;
          tel: string;
          email: string;
        };
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
          cameraStatus: string;
          latlng: [number, number];
        }[];
      };
    };
  };
  'GET /api/user/getCameraInfo': {
    req: { cameraID: number };
    res: {
      data: {
        cameraName: string;
        cameraID: number;
        cameraStatus: string;
        hlsUrl: string;
        latlng: [number, number];
        cameraModel: string;
        alarmRules: {
          alarmRuleID: number;
          alarmRuleName: string;
        }[];
        alarmEvents: {
          eventID: number;
          alarmTime: string;
          alarmRule: {
            alarmRuleID: number;
            alarmRuleName: string;
          };
          resolved: boolean;
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
        alarmRule: {
          alarmRuleID: number;
          alarmRuleName: string;
        };
        resolved: boolean;
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
        cameraStatus: string;
        hlsUrl: string;
      }[];
      message: string;
      success: boolean;
    };
  };
  'GET /api/user/getUserInfo': {
    req: void;
    res: {
      data: {
        username: string;
        nickname: string;
        role: string;
        avatarURL: string;
        tel: string;
        email: string;
      };
      message: string;
      success: boolean;
    };
  };
  'POST /api/user/updateUserInfo': {
    req: {
      username: string;
      nickname: string;
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
        cameraStatus: string;
        hlsUrl: string;
        rtmpUrl: string;
        latlng: [number, number];
        cameraModel: string;
        alarmRules: {
          alarmRuleID: number;
          alarmRuleName: string;
        }[];
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
      hlsUrl: string;
      rtmpUrl: string;
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
      hlsUrl: string;
      rtmpUrl: string;
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
      data: {
        alarmRuleID: number;
        alarmRuleName: string;
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
      }[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/addAlarmRule': {
    req: {
      relatedCameraIds: number[];
      alarmRuleName: string;
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
    };
    res: {
      data: {};
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/updateAlarmRule': {
    req: {
      alarmRuleID: number;
      alarmRuleName: string;
      relatedCameraIds: number[];
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
      data: {
        username: string;
        nickname: string;
        role: string;
        avatarURL: string;
        tel: string;
        email: string;
      }[];
      message: string;
      success: boolean;
    };
  };
  'POST /api/admin/addUser': {
    req: {
      username: string;
      role: string;
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
      role: string;
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

export type fetchUrls = keyof FetchTypes extends `${string} ${infer Url}`
  ? Url
  : never;

declare module '@nestjs/common' {
  export const Get: (path?: fetchUrls) => MethodDecorator;
  export const Post: (path?: fetchUrls) => MethodDecorator;
}
