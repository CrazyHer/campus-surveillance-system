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
  'GET /api/list': {
    req: {};
    res: {};
  };
}
