import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {TankModel} from '@shared/models/data.models/tank/tank.model';
import {IUMTQLFormData} from '@app/user-management/shared/models/default/default-object.model';

const payloadTank = PayloadsConstant.TANK;
const PAYLOAD_KEYS = {
    FIND_ALL: 'find_all',
    FIND_BY_ID: 'find_by_id',
    FIND_BY_STATION_ID: 'find_by_station',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
};

@Injectable({
    providedIn: 'root'
})
export class TankDataService {
    payloads = {};

    private tankAllSource = new BehaviorSubject([]);
    tankAllObservable = this.tankAllSource.asObservable();

    private tankAllByStationSource = new BehaviorSubject([]);
    tankAllByStationObservable = this.tankAllByStationSource.asObservable();

    constructor(private apiService: ApiService) {
        this.payloads = {
            [PAYLOAD_KEYS.FIND_ALL]:
                new Payload(payloadTank.FIND_ALL, payloadTank.OBJECT_FIND, TankModel),
            [PAYLOAD_KEYS.FIND_BY_STATION_ID]:
                new Payload(payloadTank.FIND_BY_STATION_ID, payloadTank.OBJECT_FIND, TankModel),
            [PAYLOAD_KEYS.FIND_BY_ID]:
                new Payload(payloadTank.FIND_BY_ID, payloadTank.OBJECT_FIND, TankModel),
            [PAYLOAD_KEYS.CREATE]:
                new Payload(payloadTank.CREATE_TANK, payloadTank.OBJECT_FIND, TankModel),
            [PAYLOAD_KEYS.UPDATE]:
                new Payload(payloadTank.UPDATE_TANK, payloadTank.OBJECT_FIND, TankModel),
            [PAYLOAD_KEYS.DELETE]:
                new Payload(payloadTank.DELETE_TANK, payloadTank.OBJECT_FIND, TankModel),
        };
    }

    findAll(): Promise<any> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null)
            .then((rs) => {
                this.tankAllSource.next(rs);
                return rs;
            });
    }

    findAllByStationId(id): Promise<any> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_STATION_ID], [id])
            .then((rs) => {
                if (rs) {
                    this.tankAllByStationSource.next(rs);
                }
                return rs;
            });
    }

    findById(id): Promise<any> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id])
            .then((rs) => {
                return rs.length ? rs[0] : null;
            });
    }

    create(object: IUMTQLFormData, userName: string) {
        object.setValue('userName', userName);
        return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE], object);
    }

    update(object: IUMTQLFormData, userName: string) {
        object.setValue('userName', userName);
        return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPDATE], object);
    }

    delete(object: IUMTQLFormData, userName: string) {
        object.setValue('userName', userName);
        return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE], object);
    }
}
