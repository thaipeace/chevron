import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {DriverModel} from '@shared/models/data.models/fleet/driver.model';
import {TQLFormData} from '@shared/models/default/default-object.model';
import * as _ from 'lodash';
import {DriverProfileModel} from '@shared/models/data.models/fleet/driver-profile.model';
import {DriverFileUploadModel} from '../../models/data.models/fleet/driver-file-upload.model';
import {DriverStatus} from '../../models/data.models/fleet/driver-status.model';
import {DriverSleepingTimeMappingModel} from '../../models/data.models/fleet/driver-sleeping-time-mapping.model';
import {DriverWorkingTimeMappingModel} from '../../models/data.models/fleet/driver-working-time-mapping.model';
import {IUMTQLFormData} from '@app/user-management/shared/models/default/default-object.model';

const payloadDriver = PayloadsConstant.DRIVER;
const payloadDriverProfile = PayloadsConstant.DRIVER_PROFILE;
const PAYLOAD_KEYS = {
    FIND_ALL: 'find_all',
    FIND_ALL_BY_COMPANY: 'find_all_by_company',
    FIND_BY_ID: 'find_by_id',
    DELETE_PROFILE_STATUS: 'delete_profile_status',
    CREATE_DRIVER: 'create_driver',
    UPDATE_DRIVER: 'update_driver',
    DELETE_DRIVER: 'delete_driver',
    FIND_DRIVER_PROFILE_OF_DRIVER: 'find_driver_profile_of_driver',
    UPLOAD_DRIVER_SAFETY_DOC: 'upload_driver_safety_doc',
    CREATE_DRIVER_DAILY_PROFILE: 'create_driver_daily_profile',
    UPDATE_DRIVER_DAILY_PROFILE: 'updae_driver_daily_profile',
    FIND_DRIVER_STATUS: 'find_driver_status',
    FIND_DRIVER_CURRENT_STATUS: 'find_driver_current_status',
    FIND_DRIVER_SLEEPING_TIME_IN_TIMERANGE: 'find_driver_sleeping_time_in_timerange',
    FIND_DRIVER_WORKING_TIME_IN_TIMERANGE: 'find_driver_working_time_in_timerange',
    FIND_DRIVER_ALTERNATIVE_SLEEPING_TIME_IN_TIMERANGE: 'find_driver_alternative_sleeping_time_in_timerange',
    FIND_DRIVER_ALTERNATIVE_WORKING_TIME_IN_TIMERANGE: 'find_driver_alternative_working_time_in_timerange',
    FIND_DRIVER_STATUS_IN_TIMERANGE: 'find_driver_status_in_timerange',
    CREATE_DRIVER_STATUS: 'create_driver_status',
    UPDATE_DRIVER_STATUS: 'update_driver_status',
    DELETE_ALL_SLEEPING_TIME_BY_ID: 'delete_all_sleeping_time_by_id',
    DELETE_ALL_WORKING_TIME_BY_ID: 'delete_all_working_time_by_id',
    DOWNLOAD_DRIVER_DATA_TEMPLATE: 'download_driver_data_template',
    DOWNLOAD_TRUCK_DATA_TEMPLATE: 'download_truck_data_template'
};

@Injectable({
    providedIn: 'root'
})
export class DriverDataService {
    payloads = {};

    private driverSource = new BehaviorSubject([]);
    driverAllObservable = this.driverSource.asObservable();

    private driverByCompanySource = new BehaviorSubject([]);
    driverAllByCompanyObservable = this.driverByCompanySource.asObservable();

    private driverStatusSource = new BehaviorSubject([]);
    driverStatusSourceObservable = this.driverStatusSource.asObservable();

    constructor(private apiService: ApiService) {
        this.payloads = {
            [PAYLOAD_KEYS.FIND_ALL]: new Payload(
                payloadDriver.FIND_ALL,
                payloadDriver.OBJECT_FIND,
                DriverModel
            ),
            [PAYLOAD_KEYS.FIND_ALL_BY_COMPANY]: new Payload(
                payloadDriver.FIND_ALL_BY_COMPANY,
                payloadDriver.OBJECT_FIND,
                DriverModel
            ),
            [PAYLOAD_KEYS.FIND_BY_ID]: new Payload(
                payloadDriver.FIND_BY_ID,
                payloadDriver.OBJECT_FIND,
                DriverModel
            ),
            [PAYLOAD_KEYS.DELETE_PROFILE_STATUS]: new Payload(
                payloadDriverProfile.DELETE,
            ),
            [PAYLOAD_KEYS.CREATE_DRIVER]: new Payload(
                payloadDriver.CREATE_DRIVER,
                null,
                DriverModel
            ),
            [PAYLOAD_KEYS.UPDATE_DRIVER]: new Payload(
                payloadDriver.UPDATE_DRIVER,
                null,
                DriverModel
            ),
            [PAYLOAD_KEYS.DELETE_DRIVER]: new Payload(
                payloadDriver.DELETE_DRIVER,
                null,
                DriverModel
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_PROFILE_OF_DRIVER]: new Payload(
                payloadDriverProfile.FIND_BY_ID,
                payloadDriverProfile.OBJECT_FIND,
                DriverProfileModel
            ),
            [PAYLOAD_KEYS.UPLOAD_DRIVER_SAFETY_DOC]: new Payload(
                payloadDriverProfile.UPLOAD_FILE,
                payloadDriverProfile.OBJECT_FIND,
                DriverFileUploadModel
            ),
            [PAYLOAD_KEYS.CREATE_DRIVER_DAILY_PROFILE]: new Payload(
                payloadDriverProfile.CREATE_DRIVER_DAILY_PROFILE,
                payloadDriverProfile.OBJECT_FIND,
                null
            ),
            [PAYLOAD_KEYS.UPDATE_DRIVER_DAILY_PROFILE]: new Payload(
                payloadDriverProfile.UPDATE_DRIVER_DAILY_PROFILE,
                payloadDriverProfile.OBJECT_FIND,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_STATUS]: new Payload(
                payloadDriverProfile.FIND_DRIVER_STATUS,
                payloadDriverProfile.OBJECT_FIND,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_CURRENT_STATUS]: new Payload(
                payloadDriverProfile.FIND_DRIVER_CURRENT_STATUS,
                payloadDriverProfile.OBJECT_FIND,
                DriverProfileModel
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_SLEEPING_TIME_IN_TIMERANGE]: new Payload(
                payloadDriverProfile.FIND_DRIVER_SLEEPING_TIME_IN_TIMERANGE,
                null,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_WORKING_TIME_IN_TIMERANGE]: new Payload(
                payloadDriverProfile.FIND_DRIVER_WORKING_TIME_IN_TIMERANGE,
                null,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_ALTERNATIVE_SLEEPING_TIME_IN_TIMERANGE]: new Payload(
                payloadDriverProfile.FIND_ALTERNATIVE_DRIVER_SLEEPING_TIME_IN_TIMERANGE,
                null,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_ALTERNATIVE_WORKING_TIME_IN_TIMERANGE]: new Payload(
                payloadDriverProfile.FIND_ALTERNATIVE_DRIVER_WORKING_TIME_IN_TIMERANGE,
                null,
                null
            ),
            [PAYLOAD_KEYS.FIND_DRIVER_STATUS_IN_TIMERANGE]: new Payload(
                payloadDriverProfile.FIND_DRIVER_STATUS_IN_TIMERANGE,
                payloadDriverProfile.OBJECT_FIND,
                DriverProfileModel
            ),
            [PAYLOAD_KEYS.CREATE_DRIVER_STATUS]: new Payload(
                payloadDriverProfile.CREATE_DRIVER_STATUS,
                payloadDriverProfile.OBJECT_FIND,
                DriverProfileModel
            ),
            [PAYLOAD_KEYS.UPDATE_DRIVER_STATUS]: new Payload(
                payloadDriverProfile.UPDATE_DRIVER_STATUS,
                payloadDriverProfile.OBJECT_FIND,
                null
            ),
            [PAYLOAD_KEYS.DELETE_ALL_SLEEPING_TIME_BY_ID]: new Payload(
                payloadDriverProfile.DELETE_ALL_SLEEPING_TIME_BY_ID,
                null,
                null
            ),
            [PAYLOAD_KEYS.DELETE_ALL_WORKING_TIME_BY_ID]: new Payload(
                payloadDriverProfile.DELETE_ALL_WORKING_TIME_BY_ID,
                null,
                null
            ),
            [PAYLOAD_KEYS.DOWNLOAD_DRIVER_DATA_TEMPLATE]: new Payload(
                payloadDriver.DOWNLOAD_DRIVER_DATA_TEMPLATE,
                null,
                null
            ),
            [PAYLOAD_KEYS.DOWNLOAD_TRUCK_DATA_TEMPLATE]: new Payload(
                payloadDriver.DOWNLOAD_TRUCK_DATA_TEMPLATE,
                null,
                null
            )
        };

        this.findAll();
    }

    findAll(): Promise<void | DriverModel[]> {
        return this.apiService
            .find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null)
            .then(rs => {
                this.driverSource.next(rs);
            });
    }

    findAllByCompanyIds(companyIds: string[]): Promise<void | DriverModel[]> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_BY_COMPANY], [companyIds.join(',')])
            .then((rs) => {
                this.driverByCompanySource.next(rs);
                return rs;
            });
    }


    findById(id: string): Promise<any> {
        return this.apiService
            .find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id])
            .then(rs => {
                return rs.length ? rs[0] : null;
            });
    }

    deleteProfileStatus(object: TQLFormData) {
        return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE_PROFILE_STATUS], object);
    }

    deleteSleepingTimeBySysId(sysId: string): Promise<any> {
        const tqlData = new TQLFormData();
        tqlData.setValue('sysId', sysId);
        return this.apiService.delete(
            this.payloads[PAYLOAD_KEYS.DELETE_ALL_SLEEPING_TIME_BY_ID],
            tqlData
        );
    }

    deleteMultiSleepingTime(array: DriverSleepingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toDeleteQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    deleteWorkingTimeBySysId(sysId: string): Promise<any> {
        const tqlData = new TQLFormData();
        tqlData.setValue('sysId', sysId);
        return this.apiService.delete(
            this.payloads[PAYLOAD_KEYS.DELETE_ALL_WORKING_TIME_BY_ID],
            tqlData
        );
    }

    deleteMultiWorkingTime(array: DriverWorkingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toDeleteQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    findDriverSleepingTimeByTimeRange(id, startTime, endTime): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_SLEEPING_TIME_IN_TIMERANGE],
            [id, startTime, endTime]
        ).then(rs => {
            return rs;
        });
    }

    findDriverWorkingTimeByTimeRange(id, startTime, endTime): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_WORKING_TIME_IN_TIMERANGE],
            [id, startTime, endTime]
        ).then(rs => {
            return rs;
        });
    }

    findDriverAlternativeSleepingTimeByTimeRange(id, startTime: string, endTime: string): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_ALTERNATIVE_SLEEPING_TIME_IN_TIMERANGE],
            [id, startTime, endTime]
        ).then(rs => {
            return rs;
        });
    }

    findDriverAlternativeWorkingTimeByTimeRange(id, startTime: string, endTime: string): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_ALTERNATIVE_WORKING_TIME_IN_TIMERANGE],
            [id, startTime, endTime]
        ).then(rs => {
            return rs;
        });
    }

    findDriverStatusTimeByTimeRange(id, startTime, endTime): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_STATUS_IN_TIMERANGE],
            [id, startTime, endTime]
        );
    }

    downloadDriverDataTemplate(): Promise<any> {
        return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DOWNLOAD_DRIVER_DATA_TEMPLATE]);
    }

    downloadTruckDataTemplate(): Promise<any> {
        return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DOWNLOAD_TRUCK_DATA_TEMPLATE]);
    }

    findAllStatus(): Promise<any> {
        return this.apiService
            .find(this.payloads[PAYLOAD_KEYS.FIND_DRIVER_STATUS], null)
            .then(rs => {
                let rest = rs.map((el) => {
                    return new DriverStatus(el.StaticData);
                });

                rest = _.orderBy(rest, (el) => {
                    return el.Key;
                });

                let am = _.remove(rest, function (n) {
                    return n.Key === 'A';
                })[0];

                let pm = _.remove(rest, function (n) {
                    return n.Key === 'P';
                })[0];

                rest.unshift(pm);
                rest.unshift(am);

                this.driverStatusSource.next(rest);
                return rest;
            });
    }

    findDriverCurrentStatus(from: number, to: number): Promise<void | DriverProfileModel[]> {
        return this.apiService
            .find(this.payloads[PAYLOAD_KEYS.FIND_DRIVER_CURRENT_STATUS], [from, to]);
    }

    findProfileByDriverId(id, startTime: string, endTime: string): Promise<any> {
        return this.apiService.find(
            this.payloads[PAYLOAD_KEYS.FIND_DRIVER_PROFILE_OF_DRIVER],
            [id, startTime, endTime]
        );
    }

    createSleepingTime(array: DriverSleepingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toCreateQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    updateSleepingTime(array: DriverSleepingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toCreateUpdateQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    createWorkingTime(array: DriverWorkingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toCreateQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    updateWorkingTime(array: DriverWorkingTimeMappingModel[]): Promise<any> {
        if (!array.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        let payloads = '';
        array.map((el) => {
            payloads += el.toCreateUpdateQuery();
        });
        return this.apiService.find(new Payload(payloads, null, null));
    }

    createDriverStatus(tqlData: TQLFormData): Promise<any> {
        return this.apiService.create(
            this.payloads[PAYLOAD_KEYS.CREATE_DRIVER_STATUS],
            tqlData
        );
    }

    uploadDriverDoc(tqlData: TQLFormData): Promise<any> {
        return this.apiService.update(
            this.payloads[PAYLOAD_KEYS.UPLOAD_DRIVER_SAFETY_DOC],
            tqlData
        );
    }

    createDriverDailyProfile(tqlData: TQLFormData): Promise<any> {
        return this.apiService.create(
            this.payloads[PAYLOAD_KEYS.CREATE_DRIVER_DAILY_PROFILE],
            tqlData
        );
    }

    updateDriverStatus(tqlData: TQLFormData): Promise<any> {
        return this.apiService.update(
            this.payloads[PAYLOAD_KEYS.UPDATE_DRIVER_STATUS],
            tqlData
        );
    }

    updateDriverDailyProfile(tqlData: TQLFormData): Promise<any> {
        return this.apiService.create(
            this.payloads[PAYLOAD_KEYS.UPDATE_DRIVER_DAILY_PROFILE],
            tqlData
        );
    }

    create(tqlData: TQLFormData, userName: string): Promise<any> {
        const obj = _.cloneDeep(tqlData);
        obj.setValue(
            'terminalPassExpiryDate',
            tqlData.getTimeValue('terminalPassExpiryDate')
        );
        return this.apiService.create(
            this.payloads[PAYLOAD_KEYS.CREATE_DRIVER],
            obj
        );
    }

    update(sysId: string, tqlData: TQLFormData, userName: string): Promise<any> {
        tqlData.setValue('sysId', sysId);
        tqlData.setValue('userName', userName);
        const obj = _.cloneDeep(tqlData);
        obj.setValue(
            'terminalPassExpiryDate',
            tqlData.getTimeValue('terminalPassExpiryDate')
        );
        return this.apiService.create(
            this.payloads[PAYLOAD_KEYS.UPDATE_DRIVER],
            obj
        );
    }

    delete(sysId: string, userName: string): Promise<any> {
        const tqlData = new TQLFormData();
        tqlData.setValue('sysId', sysId);
        tqlData.setValue('userName', userName);
        return this.apiService.delete(
            this.payloads[PAYLOAD_KEYS.DELETE_DRIVER],
            tqlData
        );
    }
}
