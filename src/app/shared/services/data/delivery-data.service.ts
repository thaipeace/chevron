import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {SystemScheduleModel} from '@shared/models/data.models/delivery/system-schedule.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckTripModel} from '@shared/models/data.models/delivery/truck-trip.model';
import {UtilsService} from '@shared/services/utils.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {TQLFormData} from '@shared/models/default/default-object.model';
import {DeliveryWindowModel} from '@shared/models/data.models/delivery/delivery-window.model';
import {ErrorHandlerService} from '@shared/services/error-handler.service';

const payloadSystemSchedule = PayloadsConstant.SYSTEM_SCHEDULE;
const payloadTrucktrip = PayloadsConstant.TRUCK_TRIP;
const payloadDeliveryWindow = PayloadsConstant.DELIVERY_WINDOW;
const PAYLOAD_KEYS = {
  FIND_SYSTEM_SCHEDULE_BY_DATE_TIME: 'find_system_schedule_by_date_time',
  FIND_COMBINATION_BY_ORDER_ID: 'find_combination_by_order_id',
  FIND_COMBINATION_BY_DATE_RANGE: 'find_combination_by_date_range_1',
  CREATE_TRUCK_TRIP: 'create_truck_trip',
  CREATE_SYSTEM_SCHEDULE: 'create_system_schedule',
  FIND_SYSTEM_SCHEDULE_BY_ORDER_IDS: 'find_system_schedule_by_order_ids',
  EXPORT_TRUCK_TRIP: 'export_truck_trip',
  FIND_ALL_DELIVERY_WINDOW: 'find_all_delivery_window',
  FIND_ALL_ACTIVE_DELIVERY_WINDOW: 'find_all_active_delivery_window',
  FIND_ALL_ACTIVE_DELIVERY_WINDOW_BY_STATION: 'find_all_active_delivery_window_by_station',
  FIND_BY_ID: 'find_by_id',
  FIND_ALL_DELIVERY_WINDOW_BY_DATE_RANGE: 'find_all_delivery_window_by_date_range',
  CREATE_DELIVERY_WINDOW: 'create_delivery_window',
  UPDATE_DELIVERY_WINDOW: 'update_delivery_window',
  DELETE_DELIVERY_WINDOW: 'delete_delivery_window',
};

@Injectable({
  providedIn: 'root'
})
export class DeliveryDataService {
  payloads = {};

  constructor(private apiService: ApiService,
              private _ErrorHandlerService: ErrorHandlerService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_SYSTEM_SCHEDULE_BY_DATE_TIME]:
        new Payload(payloadSystemSchedule.FIND_BY_DATE_TIME, payloadSystemSchedule.OBJECT_FIND, SystemScheduleModel),
      [PAYLOAD_KEYS.FIND_SYSTEM_SCHEDULE_BY_ORDER_IDS]:
        new Payload(payloadSystemSchedule.FIND_BY_ORDER_IDS, payloadSystemSchedule.OBJECT_FIND, SystemScheduleModel),
      [PAYLOAD_KEYS.FIND_COMBINATION_BY_ORDER_ID]:
        new Payload(payloadSystemSchedule.FIND_COMBINATION_BY_ORDER_ID),
      [PAYLOAD_KEYS.FIND_COMBINATION_BY_DATE_RANGE]:
        new Payload(payloadSystemSchedule.FIND_COMBINATION_BY_DATE_RANGE),
      [PAYLOAD_KEYS.CREATE_TRUCK_TRIP]:
        new Payload(payloadTrucktrip.CREATE),
      [PAYLOAD_KEYS.CREATE_SYSTEM_SCHEDULE]:
        new Payload(payloadSystemSchedule.CREATE),
      [PAYLOAD_KEYS.EXPORT_TRUCK_TRIP]:
        new Payload(payloadTrucktrip.EXPORT),
      [PAYLOAD_KEYS.FIND_ALL_DELIVERY_WINDOW]:
        new Payload(payloadDeliveryWindow.FIND_ALL, payloadDeliveryWindow.OBJECT_FIND, DeliveryWindowModel),
      [PAYLOAD_KEYS.FIND_ALL_ACTIVE_DELIVERY_WINDOW]:
        new Payload(payloadDeliveryWindow.FIND_ALL_ACTIVE, payloadDeliveryWindow.OBJECT_FIND, DeliveryWindowModel),
      [PAYLOAD_KEYS.FIND_ALL_ACTIVE_DELIVERY_WINDOW_BY_STATION]:
        new Payload(payloadDeliveryWindow.FIND_ALL_ACTIVE_BY_STATION_AND_DATE_RANGE, payloadDeliveryWindow.OBJECT_FIND, DeliveryWindowModel),
      [PAYLOAD_KEYS.FIND_BY_ID]:
        new Payload(payloadDeliveryWindow.FIND_BY_ID, payloadDeliveryWindow.OBJECT_FIND, DeliveryWindowModel),
      [PAYLOAD_KEYS.FIND_ALL_DELIVERY_WINDOW_BY_DATE_RANGE]:
        new Payload(payloadDeliveryWindow.FIND_BY_DATE_RANGE, payloadDeliveryWindow.OBJECT_FIND, DeliveryWindowModel),
      [PAYLOAD_KEYS.CREATE_DELIVERY_WINDOW]:
        new Payload(payloadDeliveryWindow.CREATE),
      [PAYLOAD_KEYS.DELETE_DELIVERY_WINDOW]:
        new Payload(payloadDeliveryWindow.DELETE),
      [PAYLOAD_KEYS.UPDATE_DELIVERY_WINDOW]:
        new Payload(payloadDeliveryWindow.UPDATE),
    };
  }

  findAllDeliveryWindows(): Promise<DeliveryWindowModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_DELIVERY_WINDOW]);
  }

  findAllActiveDeliveryWindows(): Promise<DeliveryWindowModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_ACTIVE_DELIVERY_WINDOW]);
  }

  findAllActiveDeliveryWindowsByStation(id: string, startDate: number, endDate: number): Promise<DeliveryWindowModel[]> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_ALL_ACTIVE_DELIVERY_WINDOW_BY_STATION], [id, startDate, endDate])
      .then((rs) => {
        console.log(rs);
        const array = rs['data']['Find'];
        let result = [];
        _.map(array, (el) => {
          if (el['Status'] === 'Success') {
            let objects = el['Result'];
            objects = UtilsService.isArray(objects) ? objects : [objects];
            _.map(objects, (item) => {
              result.push(new DeliveryWindowModel(item['DeliveryWindow']));
            });
          }
        });

        return _.uniqBy(result, (el) => el.getId());
      });
  }

  findAllDeliveryWindowsByDateRange(from: number, to: number): Promise<DeliveryWindowModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_DELIVERY_WINDOW_BY_DATE_RANGE], [from, to]);
  }

  findDeliveryWindowsById(id: string): Promise<DeliveryWindowModel> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id])
      .then((rs) => {
        if (rs.length) {
          return rs[0];
        }
        return null;
      });
  }

  createDeliveryWindow(stationId: string, name: string, startDate: number, endDate: number, startTime: number, endTime: number, max: number) {
    // remove seconds in startTime & endTime
    startTime = moment(startTime).startOf('minute').valueOf();
    endTime = moment(endTime).startOf('minute').valueOf();

    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.CREATE_DELIVERY_WINDOW],
      [stationId, name, startDate, endDate, startTime, endTime, max])
      .then((rs) => this._ErrorHandlerService.handleCreate(rs));
  }

  updateDeliveryWindow(id: string, name: string, startDate: number, endDate: number, startTime: number, endTime: number, max: number) {
    // remove seconds in startTime & endTime
    startTime = moment(startTime).startOf('minute').valueOf();
    endTime = moment(endTime).startOf('minute').valueOf();

    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.UPDATE_DELIVERY_WINDOW],
      [id, name, startDate, endDate, startTime, endTime, max])
      .then((rs) => this._ErrorHandlerService.handleUpdate(rs));
  }

  deleteDeliveryWindowById(id: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DELETE_DELIVERY_WINDOW], [id])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }

  exportTruckTrip(start: number, end: number): Promise<any> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.EXPORT_TRUCK_TRIP], [start, end])
      .then((rs) => {
        // console.log(rs);
        if (rs['data']['OutputFileLink']) {
          // return this.apiService.findRaw(new Payload(''), null, {}, rs['data']['OutputFileLink'])
          //   .then((rs) => {
          //     console.log(rs);
          //     //    TODO check if empty, nam
          //     return rs['data'];
          //   });
          return rs['data']['OutputFileLink'];
        } else {
          return null;
        }
      });
  }

  findOrderScheduleByDateTime(timestamp: number): Promise<SystemScheduleModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_SYSTEM_SCHEDULE_BY_DATE_TIME], [timestamp]);
  }

  findSystemScheduleByOrderIds(ids: string[]): Promise<SystemScheduleModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_SYSTEM_SCHEDULE_BY_ORDER_IDS], [ids]);
  }

  findCombinationByOrderId(orderId: string): Promise<SystemScheduleModel> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_COMBINATION_BY_ORDER_ID], [orderId])
      .then((rs) => {
        console.log(rs);
        const array = this.convertCombinationResultToObject(rs);
        return array.length ? array[0] : null;
      });
  }

  findCombinationByDateRange(from, to): Promise<SystemScheduleModel[]> {
    let array = [];
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_COMBINATION_BY_DATE_RANGE], [from, to])
      .then((rs) => {
        return this.convertCombinationResultToObject(rs);
      });
  }

  convertCombinationResultToObject(rs): any {
    let result = [];
    if (rs['data']['Find']['Status'] && rs['data']['Find']['Status'] == 'Success' && rs['data']['Find']['Result']) {
      let data = rs['data']['Find']['Result'];
      data = !UtilsService.isArray(data) ? [data] : data;
      _.map(data, (el) => {
        if (el[PayloadsConstant.SYSTEM_SCHEDULE.OBJECT_FIND]) {
          let obj = new SystemScheduleModel(el[PayloadsConstant.SYSTEM_SCHEDULE.OBJECT_FIND]);
          obj.station = new StationModel(el[PayloadsConstant.STATION.OBJECT_FIND]);
          obj.truck = new TruckModel(el[PayloadsConstant.TRUCK.OBJECT_FIND]);
          obj.order = new OrderModel(el[PayloadsConstant.ORDER.OBJECT_FIND]);
          obj.truckTrip = new TruckTripModel(el[payloadTrucktrip.OBJECT_FIND]);
          result.push(obj);
        }
      });

    }
    return result;
  }

  createTrucktrip(tqlData: TQLFormData) {
    return this.apiService.create(
      this.payloads[PAYLOAD_KEYS.CREATE_TRUCK_TRIP],
      tqlData
    );
  }

  createSystemSchedule(tqlData: TQLFormData) {
    return this.apiService.create(
      this.payloads[PAYLOAD_KEYS.CREATE_SYSTEM_SCHEDULE],
      tqlData
    );
  }

}
