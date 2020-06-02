import {DefaultObject} from '@shared/models/default/default-object.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {UtilsService} from '@shared/services/utils.service';

const payload = PayloadsConstant.DRIVER_PROFILE;

export class DriverSleepingTimeMappingModel extends DefaultObject {

  sysId: string;
  driverId: string;
  sleepStartTime: string;
  wakingUpTime: string;
  oldSleepStartTime: string;
  oldWakingUpTime: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.sysId = this.getValue('sysId');    
    this.driverId = this.getValue('driverId');
    this.sleepStartTime = this.getValue('sleepStartTime');
    this.wakingUpTime = this.getValue('wakingUpTime');   
    this.oldSleepStartTime = this.getValue('oldSleepStartTime');
    this.oldWakingUpTime = this.getValue('oldWakingUpTime'); 
  }

  toCreateQuery() {
    let query = payload.CREATE_DRIVER_SLEEPING_TIME.toString();
    query = UtilsService.replaceAll(query, '{0}', this.driverId);
    query = UtilsService.replaceAll(query, '{1}', this.sleepStartTime);
    query = UtilsService.replaceAll(query, '{2}', this.wakingUpTime);
    return query;
  }

  toCreateUpdateQuery() {
    let query = payload.UPDATE_DRIVER_SLEEPING_TIME.toString();
    query = UtilsService.replaceAll(query, '{0}', this.driverId);
    query = UtilsService.replaceAll(query, '{1}', this.sleepStartTime);
    query = UtilsService.replaceAll(query, '{2}', this.wakingUpTime);
    query = UtilsService.replaceAll(query, '{3}', this.oldSleepStartTime);
    query = UtilsService.replaceAll(query, '{4}', this.oldWakingUpTime);
    return query;
  }

  toDeleteQuery() {
    let query = payload.DELETE_ALL_SLEEPING_TIME_BY_ID.toString();
    query = UtilsService.replaceAll(query, '{sysId}', this.sysId);
    return query;
  }
}