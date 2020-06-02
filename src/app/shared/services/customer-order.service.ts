import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {CustomerOrderPayloadsConstant} from '../constants/customer-order-payloads.constant';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '../models/payload.model';
import {DEFAULT_VALUES, DEFAULT_ENDPOINTS} from '../constants/config.constant';
import {CustomerOrderSummaryModel} from '../models/data.models/customer/customer-order-summary.model';
import {StationOrderModel} from '../models/data.models/station/station-order.model';
import {AuthenticationService, UserService} from '@app/user-management/shared/services';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {MatSnackBar} from '@angular/material';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

const payloadOrder = CustomerOrderPayloadsConstant.CUSTOMER_ORDERS;
const payloadOrderSummary = CustomerOrderPayloadsConstant.ORDER_SUMMARY;

const ORDER_PAYLOAD_KEY = {
    FIND_UPCOMING_ORDER_BY_STATION_ID: 'find_upcoming_order_by_station_id',
    FIND_HISTORICAL_ORDER_BY_STATION_ID: 'find_historical_order_by_station_id',
    FIND_HISTORICAL_NOT_POTENTIAL_ORDER_BY_MULTIPLE_STATION: 'find_historical_not_potential_order_by_multiple_station',
    CANCEL_ORDER: 'cancel_order',
    GET_ORDER_SUMMARY: 'get_order_summary',
    GET_PRODUCT_ORDER_SUMMARY: 'get_product_order_summary',
};

@Injectable({
    providedIn: 'root'
})
export class CustomerOrderService extends DefaultComponent {
    payloads;
    username;

    constructor(private apiService: ApiService,
                private _snackBar: MatSnackBar,
                private _AuthenticationService: AuthenticationService) {
        super();
        this.addSubscribes(this._AuthenticationService.loginedUserObservable
            .subscribe((user) => {
                if (user) {
                    this.username = user.username;
                }
            }));

        //payloads
        this.payloads = {
            [ORDER_PAYLOAD_KEY.FIND_UPCOMING_ORDER_BY_STATION_ID]:
                new Payload(payloadOrder.GET_UPCOMING_ORDER_BY_STATION_ID, payloadOrder.OBJECT_FIND, StationOrderModel),
            [ORDER_PAYLOAD_KEY.FIND_HISTORICAL_ORDER_BY_STATION_ID]:
                new Payload(payloadOrder.GET_HISTORICAL_ORDER_BY_STATION_ID, payloadOrder.OBJECT_FIND, StationOrderModel),
            [ORDER_PAYLOAD_KEY.FIND_HISTORICAL_NOT_POTENTIAL_ORDER_BY_MULTIPLE_STATION]:
                new Payload(payloadOrder.GET_HISTORICAL_NOT_POTENTIAL_ORDER_BY_MULTIPLE_STATION, payloadOrder.OBJECT_FIND, StationOrderModel),
            [ORDER_PAYLOAD_KEY.CANCEL_ORDER]:
                new Payload(payloadOrder.CANCEL_ORDER, null, null),
            [ORDER_PAYLOAD_KEY.GET_ORDER_SUMMARY]:
                new Payload(payloadOrderSummary.GET_ORDER_SUMMARY, payloadOrderSummary.OBJECT_STATION_ORDER_SUMMARY, CustomerOrderSummaryModel),
            [ORDER_PAYLOAD_KEY.GET_PRODUCT_ORDER_SUMMARY]:
                new Payload(payloadOrderSummary.GET_PRODUCT_ORDER_SUMMARY, payloadOrderSummary.OBJECT_STATION_PRODUCT_ORDER_SUMMARY, null),
        };

    }

    public getUpcomingOrdersByStationId(stationId: string): Promise<StationOrderModel[]> {
        return this.apiService.find(this.payloads[ORDER_PAYLOAD_KEY.FIND_UPCOMING_ORDER_BY_STATION_ID], [stationId], {});
    }

    public getHistoricalOrdersByStationId(stationId: string, startDate: number, endDate: number): Promise<StationOrderModel[]> {
        return this.apiService.find(this.payloads[ORDER_PAYLOAD_KEY.FIND_HISTORICAL_ORDER_BY_STATION_ID], [stationId, startDate, endDate], {});
    }

    public getHistoricalOrdersByMultipleStation(stationIds: string[], startDate: number, endDate: number): Promise<StationOrderModel[]> {
        return this.apiService.find(this.payloads[ORDER_PAYLOAD_KEY.FIND_HISTORICAL_NOT_POTENTIAL_ORDER_BY_MULTIPLE_STATION],
            [stationIds.join(','), startDate, endDate], {});
    }

    public getOrderSummary(stationName: string, startDate: number, endDate: number): Promise<CustomerOrderSummaryModel[]> {
        return this.apiService.find(this.payloads[ORDER_PAYLOAD_KEY.GET_ORDER_SUMMARY], [stationName, startDate, endDate], {});
    }

    public getProductOrderSummary(stationId: string, startDate: number, endDate: number): Promise<any> {
        return this.apiService.find(this.payloads[ORDER_PAYLOAD_KEY.GET_PRODUCT_ORDER_SUMMARY], [stationId, startDate, endDate], {});
    }

    public cancelOrder(stationId: string, orderId: string, comment: string): Promise<any> {
        return this.apiService.findRaw(this.payloads[ORDER_PAYLOAD_KEY.CANCEL_ORDER], [stationId, orderId, this.username, comment])
            .then((rs) => {
                let res = {
                    status: false,
                    message: 'Error'
                };
                if (rs['data']['Response']) {
                    res['status'] = (rs['data']['Response']['Status'] == 'Success');
                    res['message'] = rs['data']['Response']['Message'];
                }
                this._snackBar.open(res['message'], X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                return res['status'];
            });
    }
}
