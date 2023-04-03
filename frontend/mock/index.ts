import constants from '../src/constants';
import ServiceTypes from '../src/services/serviceTypes';

export default {
  'POST /api/login': {
    data: {
      token: '123',
      userInfo: {
        avatarURL:
          'https://himg.bdimg.com/sys/portrait/item/pp.1.2c68ba76.fN8DC9UiXh1lKjACEyEBTg.jpg',
        username: 'admin',
        role: constants.userRole.ADMIN,
      },
    },
    message: '',
    success: true,
  },
  'GET /api/getCampusState': {
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
      mapConfig: {
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
    },
    message: '',
    success: true,
  },
  'POST /api/resolveAlarm': {
    data: {},
    success: true,
    message: '',
  },
  'GET /api/getCameraInfo': {
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
          alarmStatus: 'pending',
        },
        {
          eventID: 2,
          alarmTime: '2020-01-01 00:00:00',
          alarmRule: { alarmRuleID: 1, alarmRuleName: '报警规则1' },
          alarmStatus: 'pending',
        },
      ],
    },
    message: '',
    success: true,
  },
  'GET /api/getAlarmEvents': {
    data: [
      {
        eventID: 1,
        alarmTime: '2020-01-01 00:00:00',
        alarmRule: { alarmRuleID: 1, alarmRuleName: '报警规则1' },
        alarmStatus: 'pending',
        cameraID: 1,
        cameraName: '摄像头1',
        cameraModel: '摄像头型号1',
        cameraLatlng: [36.666394717516695, 117.13263524798919],
        alarmPicUrl:
          'https://p3.itc.cn/images01/20200823/1b25064515b946838b0794507a647cf0.jpeg',
      },
      {
        eventID: 2,
        alarmTime: '2020-01-01 00:00:00',
        alarmRule: { alarmRuleID: 2, alarmRuleName: '报警规则2' },
        alarmStatus: 'solved',
        cameraID: 1,
        cameraName: '摄像头1',
        cameraModel: '摄像头型号1',
        cameraLatlng: [36.666394717516695, 117.13263524798919],
        alarmPicUrl:
          'https://p3.itc.cn/images01/20200823/1b25064515b946838b0794507a647cf0.jpeg',
      },
    ],
    message: '',
    success: true,
  },
  'GET /api/getMonitList': {
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
  'GET /api/getUserInfo': {
    data: {
      avatarURL:
        'https://himg.bdimg.com/sys/portrait/item/pp.1.2c68ba76.fN8DC9UiXh1lKjACEyEBTg.jpg',
      username: 'admin',
      role: constants.userRole.ADMIN,
      tel: '12345678901',
      email: '123@mail.com',
    },
    message: '',
    success: true,
  },
  'POST /api/updateUserInfo': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/updatePassword': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/getMapConfig': {
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
  'POST /api/updateMapConfig': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/getCameraList': {
    data: [
      {
        cameraName: '摄像头1',
        cameraID: 1,
        cameraStatus: 'normal',
        latlng: [36.666394717516695, 117.13263524798919],
        cameraModel: '摄像头型号1',
        alarmRules: [{ alarmRuleID: 1, alarmRuleName: '报警规则1' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头2',
        cameraID: 2,
        cameraStatus: 'offline',
        latlng: [36.66553375772535, 117.13452323144844],
        cameraModel: '摄像头型号2',
        alarmRules: [{ alarmRuleID: 2, alarmRuleName: '报警规则2' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
      {
        cameraName: '摄像头3',
        cameraID: 3,
        cameraStatus: 'alarm',
        latlng: [36.666747708247264, 117.13250652184426],
        cameraModel: '摄像头型号3',
        alarmRules: [{ alarmRuleID: 3, alarmRuleName: '报警规则3' }],
        hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
      },
    ],
    message: '',
    success: true,
  },
  'POST /api/addCamera': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/updateCamera': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/deleteCamera': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/getAlarmRuleList': {
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
  'POST /api/addAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/updateAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/deleteAlarmRule': {
    data: {},
    message: '',
    success: true,
  },
  'GET /api/getUserList': {
    data: [
      {
        username: 'admin',
        role: 'admin',
        tel: '12345678901',
        email: '123@456.com',
        avatarURL:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        username: 'user',
        role: 'user',
        tel: '12345678901',
        email: '123@456.com',
        avatarURL:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
    message: '',
    success: true,
  },
  'POST /api/addUser': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/updateUser': {
    data: {},
    message: '',
    success: true,
  },
  'POST /api/deleteUser': {
    data: {},
    message: '',
    success: true,
  },
} as { [api in keyof ServiceTypes]: ServiceTypes[api]['res'] };
