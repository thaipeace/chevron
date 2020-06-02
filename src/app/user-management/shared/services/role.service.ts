import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {AuthenticationPayloadsConstant} from '../constant/authentication.payloads.constant';
import {RoleModel} from '../models/data.models/role.model';
import {Payload} from '../models/payload.model';
import {IUMTQLFormData} from '../models/default/default-object.model';

const payloadRoleList = AuthenticationPayloadsConstant.ROLE;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  payloads = {};

  constructor(private apiService: ApiService) {
    this.payloads['find_all'] = new Payload(payloadRoleList.FIND_ALL, payloadRoleList.OBJECT_FIND, RoleModel);
    this.payloads['find_by_id'] = new Payload(payloadRoleList.FIND_BY_ID, payloadRoleList.OBJECT_FIND, RoleModel);
    this.payloads['create'] = new Payload(payloadRoleList.CREATE, null, RoleModel);
  }

  loadAll() {
    return this.apiService.find(this.payloads['find_all']);
  }

  findById() {
    return this.apiService.find(this.payloads['find_by_id']);
  }

  create(object: IUMTQLFormData) {
    return this.apiService.create(this.payloads['create'], object);
  }

  update(object: IUMTQLFormData) {
    return this.apiService.update(this.payloads['update'], object);
  }

  delete(object: IUMTQLFormData) {
    return this.apiService.delete(this.payloads['delete'], object);
  }

  roleLabelFormat(roles) {
    roles.forEach(i => {
      switch (i._data.roleName) {
        case 'Customer':
          i._data.roleLabel = 'Customer Admin';
          break;

        case 'TruckCompanyOwner':
        case 'Truck Company Owner':
          i._data.roleLabel = 'Hauler Admin';
          break;

        case 'Planner':
          i._data.roleLabel = 'Terminal Planner';
          break;

        case 'Admin':
          i._data.roleLabel = 'Terminal Admin';
          break;

        case 'Truck Company Operations':
        case 'TruckCompanyOperations':
          i._data.roleLabel = 'Hauler Operations';
          break;

        default:
          i._data.roleLabel = i._data.roleName;
      }
    });

    return roles;
  }
}
