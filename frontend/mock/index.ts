import constants from '../src/constants';
import type ServiceTypes from '../src/services/serviceTypes';

const MockApis: { [api in keyof ServiceTypes]: ServiceTypes[api]['res'] } = {
  'POST /api/user/login': {
    data: {
      token: '123',
      userInfo: {
        avatarURL:
          'https://himg.bdimg.com/sys/portrait/item/pp.1.2c68ba76.fN8DC9UiXh1lKjACEyEBTg.jpg',
        nickname: 'admin',
        role: constants.userRole.ADMIN,
        tel: '12345678901',
        email: '',
        username: 'admin',
      },
    },
    message: '',
    success: true,
  },
  'GET /api/user/getCampusState': {
    data: {
      cameraTotal: 20,
      cameraOnline: 10,
      cameraAlarm: 5,
      alarmEventPending: 3,
      cameraList: [
        {
          cameraName: '摄像头1',
          cameraID: 1,
          cameraStatus: 'normal',
          latlng: [36.666394717516695, 117.13263524798919],
        },
        {
          cameraName: '摄像头2',
          cameraID: 2,
          cameraStatus: 'offline',
          latlng: [36.66553375772535, 117.13452323144844],
        },
        {
          cameraName: '摄像头3',
          cameraID: 3,
          cameraStatus: 'alarm',
          latlng: [36.666747708247264, 117.13250652184426],
        },
      ],
    },
    message: '',
    success: true,
  },
  'POST /api/user/resolveAlarm': {
    data: {},
    success: true,
    message: '',
  },
  'GET /api/user/getCameraInfo': {
    data: {
      cameraName: '摄像头1',
      cameraID: 1,
      cameraStatus: 'normal',
      latlng: [36.666394717516695, 117.13263524798919],
      cameraModel: '摄像头型号1',
      alarmRules: [
        {
          alarmRuleID: 1,
          alarmRuleName: '报警规则1',
        },
        {
          alarmRuleID: 2,
          alarmRuleName: '报警规则2',
        },
        {
          alarmRuleID: 3,
          alarmRuleName: '报警规则3',
        },
      ],
      hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      alarmEvents: [
        {
          eventID: 1,
          alarmTime: '2020-01-01 00:00:00',
          alarmRule: { alarmRuleID: 1, alarmRuleName: '报警规则1' },
          resolved: false,
        },
        {
          eventID: 2,
          alarmTime: '2020-01-01 00:00:00',
          alarmRule: { alarmRuleID: 1, alarmRuleName: '报警规则1' },
          resolved: false,
        },
      ],
    },
    message: '',
    success: true,
  },
  'GET /api/user/getAlarmEvents': {
    data: {
      list: [
        {
          eventID: 549,
          alarmTime: '2023-04-26 15:44:49',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/2141dae8fb8bea60d85b.jpg',
        },
        {
          eventID: 548,
          alarmTime: '2023-04-26 15:37:20',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/aba3863a01e7236920d5.jpg',
        },
        {
          eventID: 547,
          alarmTime: '2023-04-26 15:35:04',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/1f1ceed3f0c35bb87910.jpg',
        },
        {
          eventID: 546,
          alarmTime: '2023-04-26 15:26:14',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/75b9aebaa9b7fc58a79b.jpg',
        },
        {
          eventID: 545,
          alarmTime: '2023-04-26 14:12:00',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/ec08fa2c1ed46495370a.jpg',
        },
        {
          eventID: 544,
          alarmTime: '2023-04-26 13:45:49',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/744465efbe7d7b40fa34.jpg',
        },
        {
          eventID: 543,
          alarmTime: '2023-04-26 13:44:15',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/459467958020cade7923.jpg',
        },
        {
          eventID: 542,
          alarmTime: '2023-04-26 13:42:49',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/d537b15a67ce7cdef3ac.jpg',
        },
        {
          eventID: 541,
          alarmTime: '2023-04-26 13:41:47',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/61077f07aa8afd27e6ae.jpg',
        },
        {
          eventID: 540,
          alarmTime: '2023-04-26 13:40:03',
          alarmRule: {
            alarmRuleID: 1,
            alarmRuleName: '人体检测-2人以上',
          },
          resolved: false,
          cameraID: 3,
          cameraName: '本机测试摄像头',
          cameraLatlng: [36.6670821627257, 117.13324069971353],
          cameraModel: 'USB2.0 HD UVC WebCam',
          alarmPicUrl: '/public/668c2c59bab771870e4f.jpg',
        },
      ],
      total: 549,
    },
    message: '',
    success: true,
  },
  'GET /api/user/getMonitList': {
    data: [
      {
        cameraName: '摄像头1',
        cameraID: 1,
        cameraStatus: 'normal',
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头2',
        cameraID: 2,
        cameraStatus: 'normal',
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头3',
        cameraID: 3,
        cameraStatus: 'normal',
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头4',
        cameraID: 4,
        cameraStatus: 'normal',
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头5',
        cameraID: 5,
        cameraStatus: 'normal',
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
    ],
    message: '',
    success: true,
  },
  'GET /api/user/getUserInfo': {
    data: {
      avatarURL:
        'https://himg.bdimg.com/sys/portrait/item/pp.1.2c68ba76.fN8DC9UiXh1lKjACEyEBTg.jpg',
      username: 'admin',
      role: constants.userRole.ADMIN,
      tel: '12345678901',
      email: '123@mail.com',
      nickname: 'admin',
    },
    message: '',
    success: true,
  },
  'POST /api/user/updateUserInfo': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/user/updatePassword': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/user/getMapConfig': {
    data: {
      mapOptions: {
        attributionControl: false,
        center: [36.66669, 117.13272],
        zoom: 17,
        minZoom: 17,
        maxZoom: 17,
        zoomControl: false,
      },
      layer: {
        type: 'tileLayer',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
    message: '',
    success: true,
  },
  'POST /api/admin/updateMapConfig': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/admin/getCameraList': {
    data: [
      {
        cameraName: '摄像头1',
        cameraID: 1,
        cameraStatus: 'normal',
        latlng: [36.666394717516695, 117.13263524798919],
        cameraModel: '摄像头型号1',
        alarmRules: [{ alarmRuleID: 1, alarmRuleName: '报警规则1' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
        rtspUrl:
          'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      },
      {
        cameraName: '摄像头2',
        cameraID: 2,
        cameraStatus: 'offline',
        latlng: [36.66553375772535, 117.13452323144844],
        cameraModel: '摄像头型号2',
        alarmRules: [{ alarmRuleID: 2, alarmRuleName: '报警规则2' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
        rtspUrl:
          'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      },
      {
        cameraName: '摄像头3',
        cameraID: 3,
        cameraStatus: 'alarm',
        latlng: [36.666747708247264, 117.13250652184426],
        cameraModel: '摄像头型号3',
        alarmRules: [{ alarmRuleID: 3, alarmRuleName: '报警规则3' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
        rtspUrl:
          'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      },
    ],
    message: '',
    success: true,
  },
  'POST /api/admin/addCamera': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/updateCamera': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/deleteCamera': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/admin/getAlarmRuleList': {
    data: [
      {
        alarmRuleID: 1,
        alarmRuleName: '报警规则1',
        relatedCameras: [
          { cameraID: 1, cameraName: '摄像头1' },
          { cameraID: 2, cameraName: '摄像头2' },
        ],
        algorithmType: 'body',
        enabled: true,
        triggerCondition: {
          count: { max: 2, min: 1 },
          time: { dayOfWeek: [1, 2, 3], timeRange: ['00:00:00', '23:59:59'] },
        },
      },
      {
        alarmRuleID: 2,
        alarmRuleName: '报警规则2',
        relatedCameras: [
          { cameraID: 1, cameraName: '摄像头1' },
          { cameraID: 2, cameraName: '摄像头2' },
        ],
        algorithmType: 'vehicle',
        enabled: true,
        triggerCondition: {
          count: { max: 2, min: 1 },
          time: { dayOfWeek: [1, 2, 3], timeRange: ['00:00:00', '23:59:59'] },
        },
      },
      {
        alarmRuleID: 3,
        alarmRuleName: '报警规则3',
        relatedCameras: [
          { cameraID: 1, cameraName: '摄像头1' },
          { cameraID: 2, cameraName: '摄像头2' },
        ],
        algorithmType: 'body',
        enabled: false,
        triggerCondition: {
          count: { max: 2, min: 1 },
          time: { dayOfWeek: [1, 2, 3], timeRange: ['00:00:00', '23:59:59'] },
        },
      },
    ],
    message: '',
    success: true,
  },
  'POST /api/admin/addAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/updateAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/deleteAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/admin/getUserList': {
    data: [
      {
        username: 'admin',
        role: 'admin',
        tel: '12345678901',
        email: '123@456.com',
        nickname: 'admin1',
        avatarURL:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        username: 'user',
        role: 'user',
        tel: '12345678901',
        email: '123@456.com',
        nickname: 'admin2',
        avatarURL:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
    message: '',
    success: true,
  },
  'POST /api/admin/addUser': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/updateUser': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/admin/deleteUser': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/ai/getOfflineCameraList': {
    data: [{ cameraID: 1 }, { cameraID: 2 }, { cameraID: 3 }],
    message: '',
    success: true,
  },
};

export default MockApis;
