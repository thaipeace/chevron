import { Injectable } from '@angular/core';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@shared/services/api.service';
import { Payload } from '@shared/models/payload.model';
import { OrderModel } from '@shared/models/data.models/order/order.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { NOTIFICATION_DEFAULT_DURARION, ORDER_STATUS, X_BUTTON } from '@shared/constants/value.constant';
import * as moment from 'moment';
import { OrderStatusHistoryModel } from '@shared/models/data.models/order/order-status-history.model';
import { UtilsService } from '@shared/services/utils.service';
import { DEFAULT_ENDPOINTS } from '@shared/constants/config.constant';

const payloadOrder = PayloadsConstant.ORDER;

@Injectable({
    providedIn: 'root'
})
export class OrderDataService extends DefaultComponent {
    payloads = {};
    username;

    private findAllSource = new BehaviorSubject([]);
    findAllObservable = this.findAllSource.asObservable();

    constructor(private _ApiService: ApiService,
        private _snackBar: MatSnackBar,
        private _AuthenticationService: AuthenticationService,
        private _ErrorHandlerService: ErrorHandlerService) {
        super();
        this.addSubscribes(this._AuthenticationService.loginedUserObservable
            .subscribe((user) => {
                if (user) {
                    this.username = user.username;
                }
            }));

        //payloads
        this.payloads = {
            'find_all_by_station_by_status': new Payload(payloadOrder.FIND_ALL_BY_STATIONS_BY_STATUSES_WITH_DATETIME_RANGE,
                payloadOrder.OBJECT_FIND, OrderModel),
            'find_order_by_station': new Payload(payloadOrder.FIND_ORDER_BY_STATION,
                payloadOrder.OBJECT_FIND, OrderModel),
            'count_all_order_by_station': new Payload(payloadOrder.COUNT_ALL_ORDER_BY_STATION,
                payloadOrder.OBJECT_FIND, null),
            'upload_sap_file': new Payload(payloadOrder.UPLOAD_SAP_FILE,
                payloadOrder.OBJECT_FIND, null),
            'find_by_id': new Payload(payloadOrder.FIND_ORDER_BY_ID,
                payloadOrder.OBJECT_FIND, OrderModel),
            'request_cancel_order': new Payload(payloadOrder.REQUEST_CANCEL, null, OrderModel),
            'approve_cancel_order': new Payload(payloadOrder.APPROVE_CANCEL, null, OrderModel),
            'find_ready_for_schedule': new Payload(payloadOrder.FIND_READY_FOR_SCHEDULE, payloadOrder.OBJECT_FIND, OrderModel),
            'revise_order_quantity_from_ar': new Payload(payloadOrder.REVISE_ORDER_QUANTITY_FROM_AR, null, null),
            'reschedule_order': new Payload(payloadOrder.RESCHEDULE, null, OrderModel),
            'find_order_status_history_by_id': new Payload(payloadOrder.FIND_ORDER_STATUS_HISTORY_BY_ID,
                payloadOrder.OBJECT_ORDER_STATUS_HISTORY_FIND, OrderStatusHistoryModel),
            'find_station_by_estimated_time': new Payload(payloadOrder.FIND_STATION_BY_ESTIMATED_TIME,
                payloadOrder.OBJECT_FIND, OrderModel),
            'create_order': new Payload(payloadOrder.CREATE_ORDER,
                payloadOrder.OBJECT_FIND, OrderModel),
            'export': new Payload(payloadOrder.EXPORT),
            'exportInventory': new Payload(payloadOrder.EXPORT_INVENTORY),
            'approve': new Payload(payloadOrder.APPROVE_ORDER),
            'optimization': new Payload(payloadOrder.OPTIMIZATION),
        };
    }

    findAll(stationIds: string[], startDate: number, endDate: number): Promise<void | OrderModel[]> {
        return this._ApiService.find(this.payloads['find_all_by_station_by_status']
            , [stationIds.join(','), startDate, endDate])
            .then((rs) => {
                this.findAllSource.next(rs);
            });
    }

    findById(id: string): Promise<OrderModel> {
        return this.findByIds([id])
            .then((rs) => {
                return rs.length ? rs[0] : null;
            });
    }

    findByIds(ids: string[]): Promise<OrderModel[]> {
        return this._ApiService.find(this.payloads['find_by_id'], [ids.toString()]);
    }

    findStatusHistoryById(id: string): Promise<OrderStatusHistoryModel[]> {
        return this.findStatusHistoryByIds([id]);
    }

    findStatusHistoryByIds(ids: string[]): Promise<OrderStatusHistoryModel[]> {
        return this._ApiService.find(this.payloads['find_order_status_history_by_id'], [ids.toString()]);
    }

    findReadyForSchedule(from): Promise<OrderModel[]> {
        return this._ApiService.find(this.payloads['find_ready_for_schedule'], [from]);
    }

    createOrder(tqlData: TQLFormData): Promise<any> {
        let createPayLoad = payloadOrder.CREATE_ORDER.toString();
        let orderItems = '';
        tqlData['item'].value.forEach(element => {
            let orderItem = payloadOrder.ORDER_ITEM;
            if (element.quantity == '' || element.quantity == 0) {
                return;
            }
            orderItem = UtilsService.replaceAll(orderItem, '{0}', element.key);
            orderItem = UtilsService.replaceAll(orderItem, '{1}', element.quantity);
            orderItems += orderItem;
        });

        createPayLoad = UtilsService.replaceAll(createPayLoad, '{0}', tqlData['salesOrderNumber'].value);
        createPayLoad = UtilsService.replaceAll(createPayLoad, '{1}', tqlData['stationId'].value);
        createPayLoad = UtilsService.replaceAll(createPayLoad, '{2}', tqlData['estimatedTime'].value.valueOf());
        createPayLoad = UtilsService.replaceAll(createPayLoad, '{3}', tqlData['timeWindow'].value);
        createPayLoad = UtilsService.replaceAll(createPayLoad, '{4}', tqlData['remark'].value);
        createPayLoad = UtilsService.replaceAll(createPayLoad, '{5}', orderItems);

        return this._ApiService.findRaw(new Payload(createPayLoad, null, null))
            .then((rs) => {
                return rs;
            });
    }

    findOrderByStation(stationId: string, startDate: number, endDate: number,
        statuses: string[], sources: string[], offset: number, limit: number): Promise<OrderModel[]> {
        return this._ApiService.find(this.payloads['find_order_by_station']
            , [stationId, startDate, endDate, statuses.join(','), sources.join(','), offset, limit]);
    }

    countOrderByStation(stationId: string, startDate: number, endDate: number,
        statuses: string[], sources: string[]): Promise<void | any> {
        return this._ApiService.findRaw(this.payloads['count_all_order_by_station']
            , [stationId, startDate, endDate, statuses.join(','), sources.join(',')]);
    }

    optimizeOrderByDate(month, day, year) {
        return this._ApiService.findRaw(this.payloads['optimization']
            , [`${month}/${day}/${year}`]);
    }

    export(from: number, to: number): Promise<void | any> {
        return this._ApiService.findRaw(this.payloads['export']
            , [from, to])
            .then((rs) => {
                let data = rs['data']['ExportedFile'];
                if (data) {
                    return DEFAULT_ENDPOINTS.DOWNLOAD + data['filePath'] + data['fileName'];
                }
                return null;
            });
    }

    exportInventory(from: number, to: number): Promise<void | any> {
        return this._ApiService.findRaw(this.payloads['exportInventory']
            , [from, to])
            .then((rs) => {
                let data = rs['data']['APIResponsE'];
                if (data) {
                    return data['downloadLink'];
                }
                return null;
            });
    }

    requestCancel(stationId: string, orderId: string, comment: string): Promise<any> {
        return this._ApiService.findRaw(this.payloads['request_cancel_order'], [stationId, orderId, this.username, comment])
            .then((rs) => {
                return this._ErrorHandlerService.handleSimpleResponse(rs);
            });
    }

    findStationByEstimatedTime(startTime: number, endTime: number) {
        return this._ApiService.find(this.payloads['find_station_by_estimated_time'], [startTime.toString(), endTime.toString()]);
    }

    approveOrder(orderIds: any[]) {
        let approvePayload = payloadOrder.APPROVE_ORDER.toString();
        let queries = '';

        orderIds.map((el) => {
            let orderModelPayload = payloadOrder.ORDER_FOR_APPROVING.toString();
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{0}', el);
            queries += orderModelPayload;
        });

        approvePayload = UtilsService.replaceAll(approvePayload, '{0}', queries);

        return this._ApiService.findRaw(new Payload(approvePayload, null, null))
            .then((rs) => {
                return rs;
            });

    }

    reviseOrderQuantityFromAR(orders: any[]) {
        let updatePayload = payloadOrder.REVISE_ORDER_QUANTITY_FROM_AR.toString();
        let queries = '';

        orders.map((el) => {
            let orderModelPayload = payloadOrder.ORDER_FOR_UPDATE.toString();
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{0}', el.orderId);
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{1}', el.productCode);
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{2}', el.revisedQuantity);
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{3}', el.stationId);
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{4}', el.estimatedTime);
            orderModelPayload = UtilsService.replaceAll(orderModelPayload, '{5}', el.remark);
            queries += orderModelPayload;
        });

        updatePayload = UtilsService.replaceAll(updatePayload, '{0}', queries);

        return this._ApiService.findRaw(new Payload(updatePayload, null, null))
            .then((rs) => {
                return rs;
            });
    }

    updateOrder(orderItems: any, order: any) {
        let updatePayload = payloadOrder.UPDATE_PRODUCT_QUANTITY.toString();
        let queries = '';

        orderItems.map((el) => {
            let orderItemPayload = payloadOrder.ORDER_TO_BE_UPDATE.toString();
            orderItemPayload = UtilsService.replaceAll(orderItemPayload, '{0}', el.key);
            orderItemPayload = UtilsService.replaceAll(orderItemPayload, '{1}', el.quantity);
            queries += orderItemPayload;
        });

        updatePayload = UtilsService.replaceAll(updatePayload, '{0}', queries);
        updatePayload = UtilsService.replaceAll(updatePayload, '{1}', order.sysId);
        updatePayload = UtilsService.replaceAll(updatePayload, '{2}', order.estimatedTime);
        updatePayload = UtilsService.replaceAll(updatePayload, '{3}', order.timeWindow);

        return this._ApiService.findRaw(new Payload(updatePayload, null, null))
            .then((rs) => {
                return rs;
            });
    }

    approveCancel(stationId: string, orderId: string): Promise<any> {
        return this._ApiService.findRaw(this.payloads['approve_cancel_order'], [stationId, orderId, this.username])
            .then((rs) => {
                return this._ErrorHandlerService.handleSimpleResponse(rs);
            });
    }

    reschedule(id: string, timestamp: number, timeWindow: string, comment: string): Promise<any> {
        return this._ApiService.findRaw(this.payloads['reschedule_order'], [id, timestamp, timeWindow, this.username,
            ORDER_STATUS.RESCHEDULED, comment])
            .then((rs) => {
                console.log(rs);
                let res = {
                    status: false,
                    message: 'Error'
                };
                if (rs['data']['Save']) {
                    res['status'] = (rs['data']['Save']['Status'] == 'Success');
                    const newTime = moment(parseInt(rs['data']['Save']['Order']['estimatedTime']['Value']))
                        .format('YYYY-MM-DD (HH:mm)');
                    res['message'] = `Success! New schedule time is ${newTime}`;
                }
                this._snackBar.open(res['message'], X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });

                //TODO fix it after BE fix, nam, 07/18/2019
                return res['status'];
            });
    }

    uploadSAPFile(tqlData: TQLFormData): Promise<any> {
        return this._ApiService.create(
            this.payloads['upload_sap_file'],
            tqlData
        );
    }
}
