import * as _ from 'lodash';
import * as moment from 'moment';
import {DefaultObject} from '@shared/models/default/default-object.model';

export class OrderStatusHistoryModel extends DefaultObject {
    orderStatus: string = null;
    statusChangeTime: string;
    orderId: string;
    timeObject;
    timestamp: number;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.orderStatus = this.getValue('orderStatus');
        this.statusChangeTime = this.getValue('statusChangeTime');
        this.orderId = this.getValue('orderId');
        this.timeObject = moment(parseInt(this.getRawValue('statusChangeTime')));
        this.timestamp = this.timeObject.valueOf();
    }
}
