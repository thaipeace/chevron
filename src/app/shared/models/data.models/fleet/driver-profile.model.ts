import {DriverSleepingHoursModel} from './driver-sleeping-hours.model';
import {DriverWorkingHoursModel} from './driver-working-hours.model';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';


export class DriverProfileModel extends DefaultObject {
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
        fullName: {
            type: 'string',
            editable: true
        },
        driverStatus: {
            type: 'string',
            editable: true
        },
        profileDate: {
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
        },
        workStartTime: {
            type: 'string',
            editable: true
        },
        workEndTime: {
            type: 'string',
            editable: true
        }
    });

    driverId: string;
    fullName: string;
    driverStatus: string = '';
    profileDate: number;
    lastUpdated: string;
    sleepingTime: DriverSleepingHoursModel[];
    workingTime: DriverWorkingHoursModel[];
    createDate: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.driverId = this.getValue('driverId');
        this.fullName = this.getValue('FullName');
        this.driverStatus = this.getValue('driverDailyStatus');
        this.profileDate = parseInt(this.getValue('profileDate'));
        this.sleepingTime = this.getValue('sleepingTime');
        this.workingTime = this.getValue('workingTime');
        this.createDate = this.getValue('createDate');
    }
}
