import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {isArray} from 'util';

export class StationOrderModel extends DefaultObject {
    sysId: string;
    lastUpdated: string;
    stationId: string;
    salesOrderNumber: number;
    createDate: string;
    item: IStationOrderItemModel[];
    orderStatus: string;
    deliveredTime: string;
    deliveryOrderNumber: number;
    source: string;
    totalQuantity: number;
    timeWindow: string;
    estimatedTime: string;
    remark: string;
    userName: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.lastUpdated = this.getValue('lastUpdated') || this.getValue('LastUpdated');
        this.stationId = this.getValue('stationId');
        this.salesOrderNumber = this.getValue('salesOrderNumber');
        this.createDate = this.getValue('createDate');
        let items = this.getValue('item');
        this.item = isArray(items) ? items : [items];
        this.orderStatus = this.getValue('orderStatus');
        this.deliveredTime = this.getValue('deliveredTime');
        this.deliveryOrderNumber = this.getValue('deliveryOrderNumber');
        this.source = this.getValue('source');
        this.totalQuantity = this.getValue('totalQuantity');
        this.timeWindow = this.getValue('timeWindow');
        this.estimatedTime = this.getValue('estimatedTime');
        this.remark = this.getValue('remark');
        this.userName = this.getValue('UserName') || this.getValue('userName');
    }
}

export interface IStationOrderItemModel {
    sysId: string;
    lastUpdated: string;
    orderId: string;
    productCode: string;
    quantity: number;
    createDate: string;
}
