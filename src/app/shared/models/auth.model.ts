import {BehaviorSubject} from 'rxjs';
import {MenuRoleModel} from './data.models/menu-role.model';

export class AuthModel {
  private _logined = false;
  private _source: BehaviorSubject<any> = new BehaviorSubject([]);
  private _token: string = null;
  private _userName: string = null;
  private _roleId: string = null;
  private _availableMenus: MenuRoleModel[] = [];

  constructor(logined: boolean = false) {
    this._logined = logined;
  }

  setObservableSource(source: BehaviorSubject<any> = new BehaviorSubject([])) {
    this._source = source;
  }

  isLogined(): boolean {
    return this._logined;
  }

  toString() {
    let data = {
      isLogined: this._logined,
      token: this._token,
      userName: this._userName,
      roleId: this._roleId
    };
    return JSON.stringify(data);
  }

  getToken() {
    return this._token;
  }

  setLogin(token: string, userName: string, roleId: string) {
    this._userName = userName;
    this._token = token;
    this._logined = true;
    this._roleId = roleId;

  }

  setLogout() {
    this._token = null;
    this._userName = null;
    this._logined = false;
  }

  getUserName(): string {
    return this._userName;
  }

  getUserRole(): string {
    return this._roleId;
  }

  setAvailableMenus(menus: MenuRoleModel[]) {
    this._availableMenus = menus;

  }

  triggerLogin() {
    this._source.next(this);
  }

  getAvailableMenus(): MenuRoleModel[] {
    return this._availableMenus;
  }

  encrypt(): string {
    return btoa(JSON.stringify({
      _userName: this.getUserName(),
      _token: this.getToken(),
      _roleId: this.getUserRole(),
    }));
  }

  decrypt(message: string) {
    try {
      let obj = JSON.parse(atob(message));
      this.setLogin(obj._token, obj._userName, obj._roleId);
      return true;
    } catch (e) {
      console.error('decrypt auth message error', e);
      return false;
    }
  }
}
