import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class DriverSleepingHoursModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData({
        sysId: {
            type: 'string',
            editable: false,
            readonly: true,
            hidden: true
        },
        driverId: {
            type: 'string',
            editable: true
        },
        sleepStartTime: {
            type: 'string',
            editable: true
        },
        wakingUpTime: {
            type: 'string',
            editable: true
        }
    });

    driverId: string;
    sleepStartTime: number;
    wakingUpTime: number;
    lastUpdated: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.driverId = this.getValue('driverId');
        this.sleepStartTime = parseInt(this.getValue('sleepStartTime'));
        this.wakingUpTime = parseInt(this.getValue('wakingUpTime'));
        this.lastUpdated = this.getValue('lastUpdated');
    }
}
