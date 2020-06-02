import { Injectable } from '@angular/core';
import { PayloadsConstant } from '../../constants/payloads.constant';
import { BehaviorSubject } from 'rxjs';
import { Payload } from '@app/user-management/shared/models/payload.model';
import { TruckCompanyModel } from '../../models/data.models/fleet/truck-company.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { ApiService } from '../api.service';
import { TruckCompanyUserMappingModel } from '@shared/models/data.models/fleet/truck-company-user-mapping.model';

const payloadTruckCompany = PayloadsConstant.TRUCK_COMPANY;
const payloadTruckCompanyUser = PayloadsConstant.TRUCK_COMPANY_USER;
const PAYLOAD_KEYS = {
  FIND_ALL: 'find_all',
  NAME_EXISTS: 'name_exists',
  FIND_BY_ID: 'find_by_id',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  FIND_TRUCK_COMPANY_USER_MAPPING: 'find_truck_company_user_mapping',
  CREATE_TRUCK_COMPANY_USER_MAPPING: 'create_truck_company_user_mapping',
  DELETE_TRUCK_COMPANY_USER_MAPPING: 'delete_truck_company_user_mapping'
};

@Injectable({
  providedIn: 'root'
})
export class TruckCompanyDataService {
  payloads = {};

  private truckCompanyAllSource = new BehaviorSubject(null);
  truckCompanyAllObservable = this.truckCompanyAllSource.asObservable();

  currentTruckCompanyUserMappingSource = new BehaviorSubject<TruckCompanyUserMappingModel[]>(null);
  currentTruckCompanyUserMappingObservable = this.currentTruckCompanyUserMappingSource.asObservable();

  constructor(private apiService: ApiService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_ALL]: new Payload(
        payloadTruckCompany.FIND_ALL,
        payloadTruckCompany.OBJECT_FIND,
        TruckCompanyModel
      ),
      [PAYLOAD_KEYS.NAME_EXISTS]: new Payload(
        payloadTruckCompany.NAME_EXISTS,
        payloadTruckCompany.OBJECT_FIND,
        TruckCompanyModel
      ),
      [PAYLOAD_KEYS.FIND_BY_ID]: new Payload(
        payloadTruckCompany.FIND_BY_ID,
        payloadTruckCompany.OBJECT_FIND,
        TruckCompanyModel
      ),
      [PAYLOAD_KEYS.CREATE]: new Payload(payloadTruckCompany.CREATE, null, null),
      [PAYLOAD_KEYS.UPDATE]: new Payload(payloadTruckCompany.UPDATE, null, null),
      [PAYLOAD_KEYS.DELETE]: new Payload(payloadTruckCompany.DELETE, null, null),
      [PAYLOAD_KEYS.FIND_TRUCK_COMPANY_USER_MAPPING]: new Payload(
        payloadTruckCompanyUser.FIND_BY_USERNAME,
        payloadTruckCompanyUser.OBJECT_FIND,
        TruckCompanyUserMappingModel
      ),
      [PAYLOAD_KEYS.CREATE_TRUCK_COMPANY_USER_MAPPING]: new Payload(payloadTruckCompanyUser.CREATE, null, null),
      [PAYLOAD_KEYS.DELETE_TRUCK_COMPANY_USER_MAPPING]: new Payload(payloadTruckCompanyUser.DELETE, null, null)
    };
  }

  findAll(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL]).then(rs => {
      this.truckCompanyAllSource.next(rs);
      return rs;
    });
  }

  findById(id): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id]).then(rs => {
      return rs.length ? rs[0] : null;
    });
  }

  checkNameExists(nameCompany: string) {
    return this.apiService
      .find(this.payloads[PAYLOAD_KEYS.NAME_EXISTS], [nameCompany])
      .then(rs => (rs.length ? true : false));
  }

  findUserTruckCompanyMappingByUsername(username) {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_TRUCK_COMPANY_USER_MAPPING], [username]);
  }

  createMultiUserTruckCompanyMapping(array: TruckCompanyUserMappingModel[]): Promise<any> {
    if (!array.length) {
      return new Promise(resolve => {
        resolve();
      });
    }
    let payloads = '';
    array.map(el => {
      payloads += el.toCreateQuery();
    });
    return this.apiService.find(new Payload(payloads, null, null));
  }

  deassociateMultiUserTruckCompanyMapping(array: TruckCompanyUserMappingModel[]): Promise<any> {
    if (!array.length) {
      return new Promise(resolve => {
        resolve();
      });
    }
    let payloads = '';
    array.map(el => {
      payloads += el.toDeassociatedQuery();
    });
    return this.apiService.find(new Payload(payloads, null, null));
  }

  createUserTruckCompanyMapping(userName: string, truckCompanyId: string): Promise<any> {
    const tqlObj = new TQLFormData();

    tqlObj.setValue('truckCompanyId', truckCompanyId);
    tqlObj.setValue('userName', userName);
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE_TRUCK_COMPANY_USER_MAPPING], tqlObj);
  }

  deleteUserTruckCompanyMapping(userName: string, truckCompanyId: string): Promise<any> {
    const tqlObj = new TQLFormData();

    tqlObj.setValue('truckCompanyId', truckCompanyId);
    tqlObj.setValue('userName', userName);
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.DELETE_TRUCK_COMPANY_USER_MAPPING], tqlObj);
  }

  create(company: TruckCompanyModel, userName: string): Promise<any> {
    const tqlObj = new TQLFormData();

    tqlObj.setValue('createDate', Date.now());
    tqlObj.setValue('companyName', company.companyName);
    tqlObj.setValue('companyId', company.companyId);
    tqlObj.setValue('userName', userName);
    tqlObj.setValue('companyCode', company.companyCode);
    tqlObj.setValue('contactNumber', company.contactNumber);
    tqlObj.setValue('contactPerson', company.contactPerson);
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE], tqlObj);
  }

  update(companyId: string, company: TruckCompanyModel, userName: string): Promise<any> {
    const tqlObj = new TQLFormData();
    tqlObj.setValue('sysId', companyId);
    tqlObj.setValue('companyId', company.companyId);
    tqlObj.setValue('companyName', company.companyName);
    tqlObj.setValue('userName', userName);
    tqlObj.setValue('companyCode', company.companyCode);
    tqlObj.setValue('contactNumber', company.contactNumber);
    tqlObj.setValue('contactPerson', company.contactPerson);
    return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPDATE], tqlObj);
  }

  delete(companyId: string, userName: string) {
    const tqlObj = new TQLFormData();
    tqlObj.setValue('sysId', companyId);
    tqlObj.setValue('userName', userName);
    return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE], tqlObj);
  }
}
