import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';

export class StationInventoryModel extends DefaultObject {
    sysId: string;
    tankName: string;
    tankNumber: string;
    currentUllage: number;
    thirdPartyTankId: string;
    lastUpdated: string;
    currentVolume: number;
    stationId: string;
    productCode: string;
    createDate: string;
    tankCapacity: number;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.tankName = this.getValue('tankName');
        this.tankNumber = this.getValue('tankNumber');
        this.currentUllage = this.getValue('currentUllage');
        this.thirdPartyTankId = this.getValue('thirdPartyTankId');
        this.lastUpdated = this.getValue('lastUpdated');
        this.currentVolume = this.getValue('currentVolume');
        this.stationId = this.getValue('stationId');
        this.productCode = this.getValue('productCode');
        this.createDate = this.getValue('createDate');
        this.tankCapacity = this.getValue('tankCapacity');
    }
}

