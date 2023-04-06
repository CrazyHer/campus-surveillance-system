import { action, makeAutoObservable } from 'mobx';

export default class User {
  token = localStorage.getItem('user.token') ?? '';
  role = localStorage.getItem('user.role') ?? '';
  avatarURL = localStorage.getItem('user.avatarURL') ?? '';
  nickname = localStorage.getItem('user.username') ?? '';

  constructor() {
    makeAutoObservable(this);
  }

  @action setToken = (token: string) => {
    this.token = token;
    localStorage.setItem('user.token', token);
  };

  @action setUserInfo = (userinfo: {
    avatarURL: string;
    nickname: string;
    role: string;
  }) => {
    this.avatarURL = userinfo.avatarURL;
    this.nickname = userinfo.nickname;
    this.role = userinfo.role;
    localStorage.setItem('user.avatarURL', userinfo.avatarURL);
    localStorage.setItem('user.nickname', userinfo.nickname);
    localStorage.setItem('user.role', userinfo.role);
  };

  @action logoff = () => {
    this.setToken('');
    this.setUserInfo({ avatarURL: '', nickname: '', role: '' });
  };

  getToken() {
    return this.token;
  }
}
