import {DefaultObject} from '@shared/models/default/default-object.model';

export class DriverWorkingHoursModel extends DefaultObject {
    driverId: string;
    workingStartTime: number;
    workingEndTime: number;
    lastUpdated: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.driverId = this.getValue('driverId');
        this.workingStartTime = parseInt(this.getValue('workingStartTime'));
        this.workingEndTime = parseInt(this.getValue('workingEndTime'));
        this.lastUpdated = this.getValue('lastUpdated');
    }
}
