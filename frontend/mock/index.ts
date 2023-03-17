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
          cameraModel: '摄像头型号1',
          alarmRules: '报警规则1',
          hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
          alarmEvents: [
            {
              eventID: 1,
              alarmTime: '2020-01-01 00:00:00',
              alarmType: '人脸报警',
              alarmStatus: 'pending',
            },
            {
              eventID: 2,
              alarmTime: '2020-01-01 00:00:00',
              alarmType: '人脸报警',
              alarmStatus: 'pending',
            },
          ],
        },
        {
          cameraName: '摄像头2',
          cameraID: 2,
          cameraStatus: 'offline',
          latlng: [36.66553375772535, 117.13452323144844],
          cameraModel: '摄像头型号2',
          alarmRules: '报警规则2',
          alarmEvents: [],
          hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
        },
        {
          cameraName: '摄像头3',
          cameraID: 3,
          cameraStatus: 'alarm',
          latlng: [36.666747708247264, 117.13250652184426],
          cameraModel: '摄像头型号3',
          alarmRules: '报警规则3',
          hlsUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
          alarmEvents: [
            {
              eventID: 3,
              alarmTime: '2020-01-01 00:00:00',
              alarmType: '人脸报警',
              alarmStatus: 'pending',
            },
          ],
        },
      ],
    },
    message: '',
    success: true,
  },
} as { [api in keyof ServiceTypes]: ServiceTypes[api]['res'] };
