import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {ITQLFormData, TQLFormData} from '@app/shared/models/default/default-object.model';
import {CustomerStationUserMappingModel} from '@shared/models/data.models/customer/customer-station-user-mapping.model';
import {UtilsService} from '@shared/services/utils.service';
import * as _ from 'lodash';
import {TankModel} from '@shared/models/data.models/tank/tank.model';

const payloadStation = PayloadsConstant.STATION;
const payloadStationUserMapping = PayloadsConstant.STATION_USER_MAPPING;
const PAYLOAD_KEYS = {
  FIND_ALL: 'find_all',
  FIND_BY_ID: 'find_by_id',
  FIND_BY_CUSTOMER_ID: 'find_by_customer_id',
  FIND_BY_USERNAME: 'find_by_username',
  FIND_BY_NAME: 'find_by_name',
  STATION_USER_DISASSOCIATE: 'station_user_unassociate',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  FIND_CURRENT_INVENTORY_BY_STATION: 'find_current_inventory_by_station',
  FIND_CURRENT_INVENTORY_BY_STATION_ID: 'find_current_inventory_by_station_id',
  FIND_STATIONS_BY_MULTIPLE_STATIONS_ID: 'find_stations_by_multiple_station_id',
  GET_STATION_AR_DATA: 'get_station_ar_data',
  GET_VARIANCE_NOTIFICATION_LIMIT_DATA: 'get_variance_notification_limit_data',
  VERIFY_DAY_STOCK_LAST_FROM_AR: 'verify_day_stock_last_from_ar'
};

@Injectable({
  providedIn: 'root'
})
export class StationDataService {
  payloads = {};

  private stationAllSource = new BehaviorSubject(null);
  stationAllObservable = this.stationAllSource.asObservable();
  private stationAllByCustomerSource = new BehaviorSubject([]);
  stationAllByCustomerObservable = this.stationAllByCustomerSource.asObservable();
  private stationAllByUsernameSource = new BehaviorSubject(null);
  stationAllByUsernameObservable = this.stationAllByUsernameSource.asObservable();

  constructor(public apiService: ApiService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_ALL]: new Payload(payloadStation.FIND_ALL, payloadStation.OBJECT_FIND, StationModel),
      [PAYLOAD_KEYS.FIND_BY_ID]: new Payload(payloadStation.FIND_BY_ID, payloadStation.OBJECT_FIND, StationModel),
      [PAYLOAD_KEYS.FIND_BY_CUSTOMER_ID]: new Payload(
        payloadStation.FIND_BY_CUSTOMER_ID,
        payloadStation.OBJECT_FIND,
        StationModel
      ),
      [PAYLOAD_KEYS.FIND_BY_USERNAME]: new Payload(
        payloadStation.FIND_BY_USERNAME,
        payloadStation.OBJECT_FIND,
        StationModel
      ),
      [PAYLOAD_KEYS.FIND_BY_NAME]: new Payload(
        payloadStation.FIND_BY_NAME,
        payloadStation.OBJECT_FIND,
        StationModel
      ),
      [PAYLOAD_KEYS.CREATE]: new Payload(payloadStation.CREATE_STATION, payloadStation.OBJECT_FIND, StationModel),
      [PAYLOAD_KEYS.UPDATE]: new Payload(payloadStation.UPDATE_STATION, payloadStation.OBJECT_FIND, StationModel),
      [PAYLOAD_KEYS.DELETE]: new Payload(payloadStation.DELETE_STATION, payloadStation.OBJECT_FIND, StationModel),
      [PAYLOAD_KEYS.STATION_USER_DISASSOCIATE]: new Payload(payloadStationUserMapping.DISASSOCIATE, null, null),
      [PAYLOAD_KEYS.FIND_CURRENT_INVENTORY_BY_STATION]: new Payload(payloadStation.FIND_CURRENT_INVENTORY),
      [PAYLOAD_KEYS.FIND_CURRENT_INVENTORY_BY_STATION_ID]: new Payload(payloadStation.FIND_CURRENT_INVENTORY_BY_ID),
      [PAYLOAD_KEYS.FIND_STATIONS_BY_MULTIPLE_STATIONS_ID]: new Payload(
        payloadStation.FIND_STATIONS_BY_MULTIPLE_STATIONS_ID,
        payloadStation.OBJECT_FIND,
        StationModel
      ),
      [PAYLOAD_KEYS.GET_STATION_AR_DATA]: new Payload(
        payloadStation.GET_STATION_AR_DATA,
        payloadStation.OBJECT_FIND,
        null
      ),
      [PAYLOAD_KEYS.GET_VARIANCE_NOTIFICATION_LIMIT_DATA]: new Payload(
        payloadStation.GET_VARIANCE_NOTIFICATION_LIMIT_DATA,
        payloadStation.OBJECT_FIND,
        null
      ),
      [PAYLOAD_KEYS.VERIFY_DAY_STOCK_LAST_FROM_AR]: new Payload(
        payloadStation.VERIFY_DAY_STOCK_LAST_FROM_AR,
        payloadStation.OBJECT_FIND,
        null
      )
    };
  }

  _reset() {
    this.stationAllSource.next(null);
    this.stationAllByCustomerSource.next(null);
    this.stationAllByUsernameSource.next(null);
  }

  findAll(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null).then(rs => {
      this.stationAllSource.next(rs);
      return rs;
    });
  }

  findMultipleStation(stationIds: string): Promise<any> {
    return this.apiService
      .find(this.payloads[PAYLOAD_KEYS.FIND_STATIONS_BY_MULTIPLE_STATIONS_ID], [stationIds])
      .then(rs => {
        return rs;
      });
  }

  findARStationDatabyDate(date: string): Promise<any> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.GET_STATION_AR_DATA], [date]).then(rs => {
      return rs;
    });
  }

  verifyDayStockLastFromAR(
    orderId,
    stationId: string,
    productCode: string,
    date: string,
    changedQuantity: any,
    isCanceling: boolean
  ): Promise<any> {
    if (isCanceling) {
      return new Promise(resolve => {
        resolve({
          data: {
            Response: {
              Status: 'Progress is on Cancelling'
            }
          }
        });
      });
    }

    if (!changedQuantity || changedQuantity == 0) {
      return new Promise(resolve => {
        resolve({
          data: {
            Response: {
              Status: 'No data'
            }
          }
        });
      });
    }

    return this.apiService
      .findRaw(this.payloads[PAYLOAD_KEYS.VERIFY_DAY_STOCK_LAST_FROM_AR], [
        stationId,
        productCode,
        date,
        changedQuantity
      ])
      .then(rs => {
        return rs;
      });
  }

  findVarianceNotificationLimitData(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.GET_VARIANCE_NOTIFICATION_LIMIT_DATA]).then(rs => {
      return rs.length ? rs[0] : '';
    });
  }

  findById(id): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id]).then(rs => {
      return rs.length ? rs[0] : null;
    });
  }

  // findCurrentInventoryByStation(id): Promise<any> {
  //   return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_CURRENT_INVENTORY_BY_STATION], [id]).then(rs => {
  //     let result = [];
  //     if (rs['data']['Station']['Status'] === 'Success') {
  //       let array = rs['data']['Station']['Product'];
  //       array = UtilsService.isArray(array) ? array : [array];
  //       _.map(array, el => {
  //         result.push(new ProductModel(el));
  //       });
  //     }
  //     return result;
  //   });
  // }

  findCurrentInventoryByStationIds(ids): Promise<any> {
    let query = '';
    _.map(ids, (el) => {
      query += `<StationId>${el}</StationId>`;
    });
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_CURRENT_INVENTORY_BY_STATION_ID], [query]).then(rs => {
      const result = {
        tanks: {},
        products: {}
      };
      _.map(ids, (el) => {
        result.tanks[el] = {data: [], time: 0};
        result.products[el] = {data: [], time: 0};
      });
      if (rs['data'] !== 'undefined' && rs['data']['APIResponse']['Status'] === 'Success') {
        let obj = rs['data']['APIResponse']['Message']['FuelDetail'];
        obj = UtilsService.isArray(obj) ? obj : [obj];
        _.map(obj, (station) => {
          if (station['TankDetails']['StationTank']) {
            let array = station['TankDetails']['StationTank'];
            array = UtilsService.isArray(array) ? array : [array];
            _.map(array, el => {
              const obj = new TankModel(el);
              result.tanks[station['stationId']].data.push(obj);
              if (parseInt(obj._raw['lastUpdated']) > result.tanks[station['stationId']].time) {
                result.tanks[station['stationId']].time = parseInt(obj._raw['lastUpdated']);
              }
            });
          }
          if (station['InventoryDetails']['StationProductInventory']) {
            let array = station['InventoryDetails']['StationProductInventory'];
            array = UtilsService.isArray(array) ? array : [array];
            _.map(array, el => {
              result.products[station['stationId']].data.push(el);
              if (parseInt(el['ReadingTime']) > result.products[station['stationId']].time) {
                result.products[station['stationId']].time = parseInt(el['ReadingTime']);
              }
            });
          }
        });
      }
      return result;
    });
  }

  findAllByCustomerId(ids: string) {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_CUSTOMER_ID], [ids]).then(rs => {
      if (rs.length) {
        this.stationAllByCustomerSource.next(rs);
      }
      return rs;
    });
  }

  findAllByUsername(name: string) {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_USERNAME], [name]).then(rs => {
      this.stationAllByUsernameSource.next(rs);
      return rs;
    });
  }

  findAllByName(name: string) {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_NAME], [name]).then(rs => {
      console.log(rs);
      this.stationAllByUsernameSource.next(rs);
      return rs;
    });
  }

  findAllOfListName(names: string[]) {
    let createPayload = payloadStation.FIND_BY_LIST_NAME.toString();
    let listName = names.reduce((rs, name) => `${rs}, ${name}`, '');

    createPayload = UtilsService.replaceAll(createPayload, '{listName}', listName);

    console.log(createPayload);

    return this.apiService.find(new Payload(createPayload, payloadStation.OBJECT_FIND, StationModel));
  }

  isNoExists(stationName: string) {
    return this.findAllByName(stationName).then(rs => (rs.length == 0 ? true : false));
  }

  associateStationUserMulti(array: CustomerStationUserMappingModel[]): Promise<any> {
    if (!array.length) {
      return new Promise(resolve => {
        resolve();
      });
    }
    let payloads = '';
    array.map(el => {
      payloads += el.toCreateQuery();
    });
    return this.apiService.find(new Payload(payloads, null, null));
  }

  diassociateStationUserMulti(array: CustomerStationUserMappingModel[]): Promise<any> {
    if (!array.length) {
      return new Promise(resolve => {
        resolve();
      });
    }
    let payloads = '';
    array.map(el => {
      payloads += el.toCreateDeassociatedQuery();
    });
    return this.apiService.find(new Payload(payloads, null, null));
  }

  disassociateStationUser(stationId, username): Promise<any> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.STATION_USER_DISASSOCIATE], [stationId, username]);
  }

  create(object: ITQLFormData, userName: string) {
    object.setValue('userName', userName);
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE], object);
  }

  update(object: ITQLFormData, userName: string) {
    object.setValue('userName', userName);
    return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPDATE], object);
  }

  delete(object: ITQLFormData, userName: string) {
    object.setValue('userName', userName);
    return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE], object);
  }
}
