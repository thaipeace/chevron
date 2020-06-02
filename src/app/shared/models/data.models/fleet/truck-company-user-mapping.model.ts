import * as _ from 'lodash';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { UtilsService } from '@app/user-management/shared/services';
import {DefaultObject} from '@shared/models/default/default-object.model';

const payloadTruckCompanyUserMapping = PayloadsConstant.TRUCK_COMPANY_USER;

export class TruckCompanyUserMappingModel extends DefaultObject {
  truckCompanyId: string;
  userName: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.truckCompanyId = this.getValue('truckCompanyId');
    this.userName = this.getValue('userName');
  }

  toCreateQuery() {
    let query = payloadTruckCompanyUserMapping.CREATE.toString();
    query = UtilsService.replaceAll(query, '{userName}', this.userName);
    query = UtilsService.replaceAll(query, '{truckCompanyId}', this.truckCompanyId);
    return query;
  }

  toDeassociatedQuery() {
    let query = payloadTruckCompanyUserMapping.DELETE.toString();
    query = UtilsService.replaceAll(query, '{userName}', this.userName);
    query = UtilsService.replaceAll(query, '{truckCompanyId}', this.truckCompanyId);
    return query;
  }
}

