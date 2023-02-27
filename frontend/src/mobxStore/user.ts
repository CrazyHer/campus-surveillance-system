import { action, makeAutoObservable } from 'mobx';

export default class User {
  token = localStorage.getItem('token') || '';

  avatarURL = '';
  username = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action setToken = (token: string) => {
    this.token = token;
    localStorage.setItem('token', token);
  };
  @action setUserInfo = (userinfo: { avatarURL: string; username: string }) => {
    this.avatarURL = userinfo.avatarURL;
    this.username = userinfo.username;
  };
  @action logoff = () => {
    this.setToken('');
    this.avatarURL = '';
    this.username = '';
  };

  getToken() {
    return this.token;
  }
}
