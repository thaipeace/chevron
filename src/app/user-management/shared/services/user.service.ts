import {Injectable} from '@angular/core';
import {AuthenticationPayloadsConstant} from '../constant/authentication.payloads.constant';
import {ApiService} from './api.service';
import {Payload} from '../models/payload.model';
import {IUMTQLFormData, TQLFormData} from '../models/default/default-object.model';
import {UserManagementModel} from '@app/shared/models/data.models/user-management.model';
import {DPMOdel} from '../models/data.models/dp.model';
import {DEFAULT_VALUES} from '@shared/constants/config.constant';

const payloadUserList = AuthenticationPayloadsConstant.USER;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  payloads = {};

  constructor(private apiService: ApiService) {
    this.payloads['find_all'] = new Payload(payloadUserList.FIND_ALL, payloadUserList.OBJECT_FIND, UserManagementModel);
    this.payloads['find_by_username'] = new Payload(payloadUserList.FIND_BY_USERNAME, payloadUserList.OBJECT_FIND, UserManagementModel);
    this.payloads['create'] = new Payload(payloadUserList.CREATE, null, UserManagementModel);
    this.payloads['update'] = new Payload(payloadUserList.UPDATE, null, UserManagementModel);
    this.payloads['reset_password'] = new Payload(payloadUserList.RESET_PASSWORD, null, null);
    this.payloads['delete'] = new Payload(payloadUserList.DELETE, null, null);
    this.payloads['change_password'] = new Payload(payloadUserList.CHANGE_PASSWORD, null, null);
    this.payloads['lock_unlock'] = new Payload(payloadUserList.LOCK, null, UserManagementModel);
    this.payloads['get_dp'] = new Payload(payloadUserList.GET_DP, null, DPMOdel);
    this.payloads['update_dp'] = new Payload(payloadUserList.UPDATE_DP, null, null);
  }

  loadAll() {
    return this.apiService.find(this.payloads['find_all']);
  }

  findbyUsername() {
    return this.apiService.find(this.payloads['find_by_username'])
      .then((rs) => {
        return rs;
      });
  }

  create(object: IUMTQLFormData) {
    return this.apiService.create(this.payloads['create'], object, {[DEFAULT_VALUES.HEADER_APP_NAME]: DEFAULT_VALUES.APP_NAME});
  }

  update(object: IUMTQLFormData) {
    return this.apiService.update(this.payloads['update'], object);
  }

  getDP(username: string) {
    return this.apiService.findRaw(this.payloads['get_dp'], [username]);
  }

  updateDP(object: IUMTQLFormData) {
    return this.apiService.update(this.payloads['update_dp'], object);
  }

  delete(object: IUMTQLFormData) {
    return this.apiService.delete(this.payloads['delete'], object);
  }

  resetPassword(object: IUMTQLFormData) {
    return this.apiService.update(this.payloads['reset_password'], object);
  }

  changePassword(object: IUMTQLFormData) {
    return this.apiService.update(this.payloads['change_password'], object);
  }

  lockUnlockUser(sysId: string, isLocked: boolean) {
    const updateObj = new TQLFormData();
    updateObj.setValue('sysId', sysId);
    updateObj.setValue('isLocked', isLocked);
    return this.apiService.update(this.payloads['lock_unlock'], updateObj);
  }
}
