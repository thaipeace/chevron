import * as _ from 'lodash';
import { DefaultObject } from '../../default/default-object.model';

export class CustomerOrderSummaryModel extends DefaultObject {
    startTime: string;
    endTime: string;
    stationName: string;
    stationId: string;
    orders: {
        potential: number;
        onHold: number;
        approved: number;
        canceled: number;
        rescheduled: number;
        loading: number;
        outForDelivery: number;
        unloading: number;
        delivered: number;
    };

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.startTime = this.getValue('StartTime');
        this.endTime = this.getValue('EndTime');
        this.stationName = this.getValue('StationName');
        this.stationId = this.getValue('StationId');
        const Orders = this.getValue('Orders');
        this.orders = {
            potential: Orders.Potential,
            onHold: Orders.OnHold,
            approved: Orders.Approved,
            canceled: Orders.Canceled,
            rescheduled: Orders.Rescheduled,
            loading: Orders.Loading,
            outForDelivery: Orders.OutForDelivery,
            unloading: Orders.Unloading,
            delivered: Orders.Delivered,
        };
    }
}
