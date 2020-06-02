export class LoginAccountModel {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  toAuthorizationString() {
    return 'Basic ' + btoa(`${this.username}:${this.password}`);
  }
}
