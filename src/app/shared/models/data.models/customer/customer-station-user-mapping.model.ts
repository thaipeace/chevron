import {DefaultObject} from '@shared/models/default/default-object.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {UtilsService} from '@shared/services/utils.service';

const payloadStationUserMapping = PayloadsConstant.STATION_USER_MAPPING;

export class CustomerStationUserMappingModel extends DefaultObject {

  customerId: string;
  stationId: string;
  userName: string;
  lastUpdated: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.customerId = this.getValue('customerId');
    this.stationId = this.getValue('stationId');
    this.userName = this.getValue('userName');
    this.lastUpdated = this.getValue('lastUpdated');
  }

  toCreateQuery() {
    let query = payloadStationUserMapping.CREATE.toString();
    query = UtilsService.replaceAll(query, '{0}', this.userName);
    query = UtilsService.replaceAll(query, '{1}', this.customerId);
    query = UtilsService.replaceAll(query, '{2}', this.stationId);
    return query;
  }

  toCreateDeassociatedQuery() {
    let query = payloadStationUserMapping.DISASSOCIATE.toString();
    query = UtilsService.replaceAll(query, '{0}', this.stationId);
    query = UtilsService.replaceAll(query, '{1}', this.userName);
    return query;
  }
}
