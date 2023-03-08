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
} as { [api in keyof ServiceTypes]: ServiceTypes[api]['res'] };
