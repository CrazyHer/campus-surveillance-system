import { action, makeAutoObservable } from 'mobx';

export default class User {
  token = localStorage.getItem('user.token') || '';
  role = localStorage.getItem('user.role') || '';
  avatarURL = localStorage.getItem('user.avatarURL') || '';
  username = localStorage.getItem('user.username') || '';

  constructor() {
    makeAutoObservable(this);
  }

  @action setToken = (token: string) => {
    this.token = token;
    localStorage.setItem('user.token', token);
  };

  @action setUserInfo = (userinfo: {
    avatarURL: string;
    username: string;
    role: string;
  }) => {
    this.avatarURL = userinfo.avatarURL;
    this.username = userinfo.username;
    this.role = userinfo.role;
    localStorage.setItem('user.avatarURL', userinfo.avatarURL);
    localStorage.setItem('user.username', userinfo.username);
    localStorage.setItem('user.role', userinfo.role);
  };

  @action logoff = () => {
    this.setToken('');
    this.setUserInfo({ avatarURL: '', username: '', role: '' });
  };

  getToken() {
    return this.token;
  }
}
