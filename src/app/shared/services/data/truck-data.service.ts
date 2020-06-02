import {Injectable} from '@angular/core';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {BehaviorSubject, of} from 'rxjs';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {TQLFormData} from '../../models/default/default-object.model';
import * as _ from 'lodash';
import {TruckHistoricalLocationModel} from '../../models/data.models/fleet/truck-historical-location.model';
import {TruckDriverMappingModel} from '@shared/models/data.models/fleet/truck-driver-mapping.model';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import {TRUCK_STATUS} from '@shared/constants/value.constant';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {UtilsService} from '../utils.service';
import {RegionModel} from '@shared/models/data.models/terminal/region.model';
import {ProductModel} from '@shared/models/data.models/terminal/product.model';
import {DEFAULT_ENDPOINTS} from '@shared/constants/config.constant';

declare const ATOMITON_DATA_HISTORY_CONFIG: any;
const payloadTruck = PayloadsConstant.TRUCK;
const payloadTruckDriveMapping = PayloadsConstant.TRUCK_DRIVER_MAPPING;
const PAYLOAD_KEYS = {
  FIND_ALL: 'find_all',
  FIND_ALL_BY_COMPANY: 'find_all_by_company',
  FIND_BY_ID: 'find_by_id',
  CREATE_TRUCK: 'create_truck',
  UPDATE_TRUCK: 'update_truck',
  DELETE_TRUCK: 'delete_truck',
  FIND_HISTORICAL_LOCATION_BY_DATE_RANGE: 'find_historical_location',
  UPLOAD_TRUCK_DOC: 'upload_truck_doc',
  FIND_ALL_MAPPING_BY_DATE_RANGE: 'find_all_mapping_by_date_range',
  FIND_ALL_MAPPING_BY_TRUCK_DATE_RANGE: 'find_all_mapping_by_truck_date_range',
  FIND_MAPPING_BY_TRUCKS: 'find_mapping_by_trucks',
  CREATE_MAPPING: 'create_mapping',
  DELETE_MAPPING: 'delete_mapping',
  FIND_EVENT_BY_DATE_RANGE: 'find_event_by_date_range',
  UPDATE_TRUCK_STATUS: 'update_truck_status',
  FIND_ALL_TRUCK_SCHEDULES: 'find_all_truck_schedules',
  FIND_TRUCK_BY_ORDER_ID: 'find_truck_by_order_id',
  FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE: 'find_truck_mapping_data_by_time_range',
  FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE_WITH_OBJECT: 'find_truck_mapping_data_by_time_range_with_object',
  UPDATE_TRUCK_SCHEDULE: 'update_truck_schedule',
  TRIGGER_SCHEDULE: 'trigger_schedule',
  FIND_BY_TRUCK_PLATE: 'find_by_truck_plate',
  APPROVE_SCHEDULE: 'approve_schedule',
  DOWNLOAD_TRUCK_DATA_TEMPLATE: 'download_truck_data_template',
  UPDATE_TRUCK_DEDICATED: 'update_truck_dedicated',
  DELETE_ALL_TRUCK_DEDICATED: 'delete_all_truck_dedicated'
};

@Injectable({
  providedIn: 'root'
})
export class TruckDataService {
  payloads = {};

  private truckAllSource = new BehaviorSubject([]);
  truckAllObservable = this.truckAllSource.asObservable();

  private truckByCompanySource = new BehaviorSubject([]);
  truckAllByCompanyObservable = this.truckByCompanySource.asObservable();

  constructor(private apiService: ApiService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_ALL]: new Payload(payloadTruck.FIND_ALL, payloadTruck.OBJECT_FIND, TruckModel),
      [PAYLOAD_KEYS.FIND_ALL_BY_COMPANY]: new Payload(
        payloadTruck.FIND_ALL_BY_COMPANY,
        payloadTruck.OBJECT_FIND,
        TruckModel
      ),
      [PAYLOAD_KEYS.FIND_BY_ID]: new Payload(payloadTruck.FIND_BY_ID, payloadTruck.OBJECT_FIND, TruckModel),
      [PAYLOAD_KEYS.FIND_BY_TRUCK_PLATE]: new Payload(
        payloadTruck.FIND_BY_TRUCK_PLATE,
        payloadTruck.OBJECT_FIND,
        TruckModel
      ),
      [PAYLOAD_KEYS.CREATE_TRUCK]: new Payload(payloadTruck.CREATE_TRUCK, null, null),
      [PAYLOAD_KEYS.UPDATE_TRUCK]: new Payload(payloadTruck.UPDATE_TRUCK, null, null),
      [PAYLOAD_KEYS.DELETE_TRUCK]: new Payload(payloadTruck.DELETE, null, null),
      [PAYLOAD_KEYS.UPDATE_TRUCK_STATUS]: new Payload(payloadTruck.UPDATE_STATUS),
      [PAYLOAD_KEYS.FIND_HISTORICAL_LOCATION_BY_DATE_RANGE]: new Payload(
        payloadTruck.FIND_HISTORICAL_LOCATION_BY_DATE_RANGE,
        payloadTruck.OBJECT_FIND_HISTORY_LOCATION,
        TruckHistoricalLocationModel
      ),
      [PAYLOAD_KEYS.UPLOAD_TRUCK_DOC]: new Payload(payloadTruck.UPLOAD_FILE, payloadTruck.OBJECT_FIND, null),
      [PAYLOAD_KEYS.FIND_ALL_MAPPING_BY_DATE_RANGE]: new Payload(
        payloadTruckDriveMapping.FIND_ALL_BY_DATE_RANGE,
        payloadTruckDriveMapping.OBJECT_FIND,
        TruckDriverMappingModel
      ),
      [PAYLOAD_KEYS.FIND_ALL_MAPPING_BY_TRUCK_DATE_RANGE]: new Payload(
        payloadTruckDriveMapping.FIND_ALL_BY_TRUCK_DATE_RANGE,
        payloadTruckDriveMapping.OBJECT_FIND,
        TruckDriverMappingModel
      ),
      [PAYLOAD_KEYS.FIND_MAPPING_BY_TRUCKS]: new Payload(
        payloadTruckDriveMapping.FIND_BY_TRUCKS,
        payloadTruckDriveMapping.OBJECT_FIND,
        TruckDriverMappingModel
      ),
      [PAYLOAD_KEYS.CREATE_MAPPING]: new Payload(payloadTruckDriveMapping.CREATE),
      [PAYLOAD_KEYS.DELETE_MAPPING]: new Payload(payloadTruckDriveMapping.DELETE),
      [PAYLOAD_KEYS.FIND_EVENT_BY_DATE_RANGE]: new Payload(
        payloadTruck.FIND_TRUCK_EVENT_BY_DATE_RANGE,
        payloadTruck.OBJECT_FIND_EVENT,
        TruckEventModel
      ),
      [PAYLOAD_KEYS.FIND_ALL_TRUCK_SCHEDULES]: new Payload(
        payloadTruck.FIND_ALL_TRUCK_SCHEDULES,
        payloadTruck.OBJECT_FIND_EVENT,
        null
      ),
      [PAYLOAD_KEYS.FIND_TRUCK_BY_ORDER_ID]: new Payload(
        payloadTruck.FIND_TRUCK_BY_ORDER_ID,
        payloadTruck.OBJECT_FIND,
        null
      ),
      [PAYLOAD_KEYS.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE]: new Payload(
        payloadTruck.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE,
        payloadTruck.OBJECT_FIND,
        null
      ),
      [PAYLOAD_KEYS.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE_WITH_OBJECT]: new Payload(
        payloadTruck.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE,
        payloadTruck.OBJECT_FIND,
        TruckModel
      ),
      [PAYLOAD_KEYS.UPDATE_TRUCK_SCHEDULE]: new Payload(payloadTruck.UPDATE_TRUCK_SCHEDULE, null, null),
      [PAYLOAD_KEYS.TRIGGER_SCHEDULE]: new Payload(payloadTruck.TRIGGER_SCHEDULE, null, null),
      [PAYLOAD_KEYS.APPROVE_SCHEDULE]: new Payload(payloadTruck.APPROVE_SCHEDULE, null, null),
      [PAYLOAD_KEYS.UPDATE_TRUCK_DEDICATED]: new Payload(payloadTruck.UPDATE_TRUCK_DEDICATED, null, null),
      [PAYLOAD_KEYS.DELETE_ALL_TRUCK_DEDICATED]: new Payload(payloadTruck.DELETE_ALL_TRUCK_DEDICATED),
      [PAYLOAD_KEYS.DOWNLOAD_TRUCK_DATA_TEMPLATE]: new Payload(
        payloadTruck.DOWNLOAD_TRUCK_DATA_TEMPLATE,
        null,
        null
      )
    };

    this.findAll();
  }

  findAll(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null).then(rs => {
      this.truckAllSource.next(rs);
    });
  }

  isNotExistedTruck(truckPlate): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_TRUCK_PLATE], [truckPlate]).then(rs => {
      return rs.length == 0 ? true : false;
    });
  }

  findByTruckPlate(truckPlate): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_TRUCK_PLATE], [truckPlate]);
  }

  findAllTruckSchedules(startTime: any, endTime: any): Promise<any> {
    return this.apiService
      .find(this.payloads[PAYLOAD_KEYS.FIND_ALL_TRUCK_SCHEDULES], [startTime, endTime])
      .then(rs => {
        return rs;
      });
  }

  findAllByCompanyIds(companyIds: string[]): Promise<any> {
    return this.apiService
      .find(this.payloads[PAYLOAD_KEYS.FIND_ALL_BY_COMPANY], [companyIds.join(',')])
      .then(rs => {
        this.truckByCompanySource.next(rs);
        return rs;
      });
  }

  findById(id): Promise<TruckModel> {
    return this.findByIds(id).then(rs => {
      return rs.length ? rs[0] : null;
    });
  }

  findTruckByMappingDataAndTimeRange(startTime: string, endTime: String): Promise<TruckModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE], [
      startTime,
      endTime
    ]);
  }

  findTruckByMappingDataAndTimeRangeWithObject(startTime, endTime): Promise<TruckModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE_WITH_OBJECT], [
      startTime,
      endTime
    ]);
  }

  findTruckByOrderIds(ids): Promise<TruckModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_TRUCK_BY_ORDER_ID], [ids]);
  }

  findByIds(ids: string): Promise<TruckModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [ids]);
  }

  findEventByDateRange(id, from, to): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_EVENT_BY_DATE_RANGE], [id, from, to]);
  }

  findHistoricalLocationByPlateNumber(plateNumber, from, to): Promise<any> {
    return this.apiService.find(
      this.payloads[PAYLOAD_KEYS.FIND_HISTORICAL_LOCATION_BY_DATE_RANGE], 
      [plateNumber, from, to],
      {'appName': ATOMITON_DATA_HISTORY_CONFIG.APP_NAME},
      DEFAULT_ENDPOINTS.DATA_FM_HISTORY
    );
  }

  updateTruckStatus(id, status): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.UPDATE_TRUCK_STATUS], [id, status]);
  }

  updateTruckSchedule(
    tripId: string,
    terminalArrivalTime: string,
    terminalReturnTime: string
  ): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.UPDATE_TRUCK_SCHEDULE], [
      tripId,
      terminalArrivalTime,
      terminalReturnTime
    ]);
  }

  triggerSchedule(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.TRIGGER_SCHEDULE]);
  }

  approveSchedule(id): Promise<any> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.APPROVE_SCHEDULE], [id]);
  }

  uploadDriverDoc(tqlData: TQLFormData): Promise<any> {
    return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPLOAD_TRUCK_DOC], tqlData);
  }

  create(tqlData: TQLFormData, compartments: any[], userName: string): Promise<any> {
    tqlData['safeLoadingPassDate'].value = tqlData['safeLoadingPassDate'].value.valueOf();
    let createPayLoad = payloadTruck.CREATE_TRUCK.toString();
    let compartmentItems = '';
    compartments.forEach(element => {
      let compartmentItem = payloadTruck.COMPARTMENT_PAYLOAD;
      compartmentItem = UtilsService.replaceAll(compartmentItem, '{0}', element.key);
      compartmentItem = UtilsService.replaceAll(compartmentItem, '{1}', element.value);
      compartmentItems += compartmentItem;
    });

    createPayLoad = UtilsService.replaceAll(createPayLoad, '{0}', compartmentItems);

    return this.apiService.create(new Payload(createPayLoad, null, null), tqlData);
  }

  createTruck(tqlData: TQLFormData): Promise<any> {
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE_TRUCK], tqlData);
  }

  createTruckCompartments(compartments: any[], truckId: string): Promise<any> {
    let createPayLoad = payloadTruck.CREATE_COMPARTMENT.toString();
    let compartmentItems = compartments.reduce((results, element) => {
      let compartmentItem = payloadTruck.COMPARTMENT_PAYLOAD;
      compartmentItem = UtilsService.replaceAll(compartmentItem, '{compartmentNumber}', element.key + 1);
      compartmentItem = UtilsService.replaceAll(compartmentItem, '{capacity}', element.value);
      compartmentItem = UtilsService.replaceAll(compartmentItem, '{truckId}', truckId);
      console.log(compartmentItem);
      return `${results} ${compartmentItem}`;
    }, '');

    createPayLoad = UtilsService.replaceAll(createPayLoad, '{0}', compartmentItems);

    console.log(new Payload(createPayLoad, null, null));

    return this.apiService.createWithPayload(createPayLoad);
  }

  update(sysId: string, tqlData: TQLFormData, userName: string): Promise<any> {
    tqlData.setValue('sysId', sysId);
    tqlData.setValue('userName', userName);
    return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPDATE_TRUCK], tqlData);
  }

  /**
   * update dedicated region/product code into truck
   * @param truckId
   * @param regions
   * @returns {Promise<any>}
   */
  updateDedicatedRegion(truckId: string, regions: RegionModel[]): Promise<any> {

    /*
    * convert data to query
    * */
    /*<DedicatedRegionProduct>
        <regionId></regionId>
        <productId></productId>
      </DedicatedRegionProduct>*/

    let query = '';
    _.map(regions, (el: RegionModel) => {
      _.map(el.selectedProducts, (product: ProductModel) => {
        query += `<DedicatedRegionProduct>
        <regionId>${el.getId()}</regionId>
        <productId>${product.getId()}</productId>
      </DedicatedRegionProduct>`;
      });
    });

    // console.log(query);
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.UPDATE_TRUCK_DEDICATED], [truckId, query]);
  }

  /**
   * delete all dedicated regions of truck
   * @param truckId
   * @returns {Promise<string>}
   */
  deleteAllDedicatedRegion(truckId: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DELETE_ALL_TRUCK_DEDICATED], [truckId]);
  }

  delete(truckId: string, userName: string) {
    const tqlObj = new TQLFormData();
    tqlObj.setValue('sysId', truckId);
    tqlObj.setValue('userName', userName);
    return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE_TRUCK], tqlObj);
  }

  findAllTruckDriverMappingByDateRange(from, to): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_MAPPING_BY_DATE_RANGE], [from, to]);
  }

  findAllTruckDriverMappingByTrucks(ids, from, to): Promise<TruckDriverMappingModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_MAPPING_BY_TRUCK_DATE_RANGE], [
      ids.join(','),
      from,
      to
    ]);
  }

  createTruckDriverMapping(driverId, truckId, userName, timestamp): Promise<TruckDriverMappingModel> {
    return this.apiService
      .findRaw(this.payloads[PAYLOAD_KEYS.CREATE_MAPPING], [driverId, truckId, userName, timestamp])
      .then(rs => {
        let response = null;
        if (rs['data'] && rs['data']['Create'] && rs['data']['Create']['Status'] == 'Success') {
          let obj = rs['data']['Create']['TruckDriverMapping'];
          Object.keys(obj).map(key => {
            obj[key] = obj[key]['Value'] || obj[key];
          });
          response = new TruckDriverMappingModel(obj);
        }
        return response;
      });
  }

  deleteTruckDriverMapping(driverId, truckId, mappingId) {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.DELETE_MAPPING], [driverId, truckId, mappingId]);
  }

  downloadTruckDataTemplate() {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DOWNLOAD_TRUCK_DATA_TEMPLATE]);
  }
}
