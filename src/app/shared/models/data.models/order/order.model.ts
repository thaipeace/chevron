import * as _ from 'lodash';
import {UtilsService} from '@shared/services/utils.service';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {OrderStatusHistoryModel} from '@shared/models/data.models/order/order-status-history.model';
import {TruckModel} from '../fleet/truck.model';
import {OrderItemModel} from '@shared/models/data.models/order/order-item.model';

export class OrderModel extends DefaultObject {
    static STATUSES = {
        ON_HOLD: 'OnHold',
        DELIVERED: 'Delivered'
    };

    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'stationId': {},
            'salesOrderNumber': {},
            'estimatedTime': {},
            'item': {},
            'orderStatus': {},
            'timeWindow': {},
            'source': {},
            'remark': {}
        }
    );

    sysId: string;
    lastUpdated: string;
    stationId: string;
    salesOrderNumber: number;
    createDate: string;
    item: IStationOrderItemModel[] = [];
    items: OrderItemModel[] = [];
    orderStatus: string;
    deliveredTime: string;
    deliveryOrderNumber: number;
    source: string;
    escorted: string;
    totalQuantity: number;
    timeWindow: string;
    estimatedTime: string;
    remark: string;
    deliveryCost: IDeliveryCost;
    station: StationModel;
    userName: string;
    tripDistance: string;
    truck: TruckModel;
  isOrderScheduled: boolean;

    orderStatusHistory: OrderStatusHistoryModel[];
    currentOrderStatusHistory: OrderStatusHistoryModel = null;

    dropNumber: number;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.lastUpdated = this.getValue('lastUpdated') || this.getValue('LastUpdated');
        this.userName = this.getValue('UserName') || this.getValue('userName');
        this.stationId = this.getValue('stationId');
        this.salesOrderNumber = this.getValue('salesOrderNumber');
        this.createDate = this.getValue('createDate');
        this.orderStatus = this.getValue('orderStatus');
        this.deliveredTime = this.getValue('deliveredTime');
        this.deliveryOrderNumber = this.getValue('deliveryOrderNumber');
        this.source = this.getValue('Source');
        this.source = this.getValue('Escorted');
        this.totalQuantity = this.getValue('totalQuantity');
        this.timeWindow = this.getValue('timeWindow');
        this.estimatedTime = this.getValue('estimatedTime');
        this.deliveryCost = this.getValue('deliveryCost');
        this.remark = this.getValue('remark');
        this.tripDistance = this.getValue('tripDistance');
        this.isOrderScheduled = this.getValue('isOrderScheduled') === 'true';
        // this.truck = this.getValue('truck');

        if (this.deliveryCost && this.deliveryCost.totalCost) {
            this.deliveryCost.totalCost = parseInt(this.deliveryCost.totalCost)
                .toFixed(2)
                .toString();
        }

        const item = this.getValue('item');
        if (!item) {
            this.item = [];
            this.items = [];
        } else {
            this.item = UtilsService.isArray(item) ? item : [item];
            const array = UtilsService.isArray(item) ? item : [item];
            this.items = [];
            _.map(array, (el) => {
                el.salesOrderNumber = this.salesOrderNumber;
                this.items.push(new OrderItemModel(el));
            });
        }
    }

    updateOrderStatus(timestamp: number) {
        for (let i = 0; i < this.orderStatusHistory.length; i++) {
            if (this.orderStatusHistory[i].timestamp <= timestamp) {
                this.currentOrderStatusHistory = this.orderStatusHistory[i];
            } else {
                break;
            }
        }
    }

    setOrderStatusHistory(array: OrderStatusHistoryModel[]) {
        // console.log(array);
        this.orderStatusHistory = _.orderBy(array, (el) => el.timestamp);
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

export interface IDeliveryCost {
    lastUpdated: string;
    sysId: string;
    createDate: string;
    orderId: string;
    pricePerUnit: string;
    stationId: string;
    totalCost: string;
    totalDistance: string;
    totalQuantity: string;
}
