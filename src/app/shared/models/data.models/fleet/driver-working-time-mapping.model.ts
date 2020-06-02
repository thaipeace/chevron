import { DefaultObject } from '@shared/models/default/default-object.model';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { UtilsService } from '@shared/services/utils.service';

const payload = PayloadsConstant.DRIVER_PROFILE;

export class DriverWorkingTimeMappingModel extends DefaultObject {

  sysId: string;
  driverId: string;
  workingStartTime: string;
  workingEndTime: string;
  oldWorkingStartTime: string;
  oldWorkingEndTime: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.sysId = this.getValue('sysId');
    this.driverId = this.getValue('driverId');
    this.workingStartTime = this.getValue('workingStartTime');
    this.workingEndTime = this.getValue('workingEndTime');
    this.oldWorkingStartTime = this.getValue('oldWorkingStartTime');
    this.oldWorkingEndTime = this.getValue('oldWorkingEndTime');
  }

  toCreateQuery() {
    let query = payload.CREATE_DRIVER_WORKING_TIME.toString();
    query = UtilsService.replaceAll(query, '{0}', this.driverId);
    query = UtilsService.replaceAll(query, '{1}', this.workingStartTime);
    query = UtilsService.replaceAll(query, '{2}', this.workingEndTime);
    return query;
  }

  toCreateUpdateQuery() {
    let query = payload.UPDATE_DRIVER_WORKING_TIME.toString();
    query = UtilsService.replaceAll(query, '{0}', this.driverId);
    query = UtilsService.replaceAll(query, '{1}', this.workingStartTime);
    query = UtilsService.replaceAll(query, '{2}', this.workingEndTime);
    query = UtilsService.replaceAll(query, '{3}', this.oldWorkingStartTime);
    query = UtilsService.replaceAll(query, '{4}', this.oldWorkingEndTime);
    return query;
  }

  toDeleteQuery() {
    let query = payload.DELETE_ALL_WORKING_TIME_BY_ID.toString();
    query = UtilsService.replaceAll(query, '{sysId}', this.sysId);   
    return query;
  }
}