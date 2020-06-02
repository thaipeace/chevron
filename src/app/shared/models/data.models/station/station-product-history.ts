import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';

export class StationProductHistory extends DefaultObject {
    sysId: string;
    createDate: string;
    totalQuantity: number;
    stationId: string;
    readingTime: string;
    productCode: string;
    shipTo: number;
    lastUpdated: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.createDate = this.getValue('createDate');
        const totalQuantity = this.getValue('totalQuantity');
        this.totalQuantity =  totalQuantity === '' || isNaN(totalQuantity) ? 0 : parseFloat(totalQuantity);
        this.stationId = this.getValue('stationId');
        this.readingTime = this.getValue('readingTime');
        this.productCode = this.getValue('productCode');
        this.shipTo = this.getValue('shipTo');
        this.lastUpdated = this.getValue('lastUpdated');
    }
}
