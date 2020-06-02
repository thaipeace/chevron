import { Injectable } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { Payload } from '@shared/models/payload.model';
import { DEFAULT_VALUES, DEFAULT_ENDPOINTS } from '../constants/config.constant';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CustomerPayloadsConstant } from '../constants/customer-payloads.constant';
import { CustomerModel } from '../models/data.models/customer/customer.model';
import { CustomerStationModel } from '../models/data.models/customer/customer-station.model';
import { InventoryPayloadsConstant } from '../constants/inventory-payloads.constant';
import { StationProductHistory } from '../models/data.models/station/station-product-history';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { CustomerStationUserMappingModel } from '@shared/models/data.models/customer/customer-station-user-mapping.model';

const payload = PayloadsConstant.CUSTOMER;
const payloadCustomer = CustomerPayloadsConstant.CUSTOMER;
const payloadStation = CustomerPayloadsConstant.CUSTOMER_STATION;
const payloadInventory = InventoryPayloadsConstant.INVENTORY;
const APP_STORAGE_KEY = {
  CUSTOMER_INFO: 'CUSTOMER_INFO'
};

const CUSTOMER_PAYLOAD_KEY = {
  FIND_CUSTOMER_BY_USERNAME: 'find_customer_by_username',
  FIND_CUSTOMER_BY_ID: 'find_customer_by_id',
  FIND_BY_USERNAME: 'find_station_by_username',
  FIND_STATION_BY_STATION_ID: 'find_station_by_station_id',
  FIND_STATION_DETAIL_BY_USERNAME: 'find_station_detail_by_username',
  FIND_INVENTORY_BY_STATION_ID: 'find_inventory_by_station_id',
  FIND_INVENTORY_BY_MULTIPLE_STATION: 'find_inventory_by_multiple_station',
  FIND_ALL: 'find_all'
};

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  payloads = {};

  private customerAllSource = new BehaviorSubject([]);
  customerAllObservable = this.customerAllSource.asObservable();

  constructor(private apiService: ApiService) {
    this.payloads = {
      [CUSTOMER_PAYLOAD_KEY.FIND_CUSTOMER_BY_USERNAME]:
        new Payload(payloadCustomer.GET_CUSTOMER_ACCESS, payloadCustomer.OBJECT_FIND, CustomerStationUserMappingModel),
      [CUSTOMER_PAYLOAD_KEY.FIND_CUSTOMER_BY_ID]:
        new Payload(payload.FIND_BY_STATION_ID, payload.OBJECT_FIND, CustomerModel),
      [CUSTOMER_PAYLOAD_KEY.FIND_ALL]:
        new Payload(payload.FIND_ALL, payload.OBJECT_FIND, CustomerModel),
      [CUSTOMER_PAYLOAD_KEY.FIND_BY_USERNAME]:
        new Payload(payloadStation.GET_STATION_USERMAPPING, payloadStation.OBJECT_STATIONCUSTOMER_FIND, null),
      [CUSTOMER_PAYLOAD_KEY.FIND_STATION_BY_STATION_ID]:
        new Payload(payloadStation.GET_STATION_BY_STATION_ID, payloadStation.OBJECT_FIND, CustomerStationModel),
      [CUSTOMER_PAYLOAD_KEY.FIND_STATION_DETAIL_BY_USERNAME]:
        new Payload(payloadStation.GET_STATION_DETAIL_BY_USERNAME, payloadStation.OBJECT_FIND, CustomerStationModel),
      [CUSTOMER_PAYLOAD_KEY.FIND_INVENTORY_BY_STATION_ID]:
        new Payload(payloadInventory.GET_INVENTORY_BY_STATION_ID, payloadInventory.OBJECT_FIND, StationProductHistory),
      [CUSTOMER_PAYLOAD_KEY.FIND_INVENTORY_BY_MULTIPLE_STATION]:
        new Payload(payloadInventory.GET_INVENTORY_BY_MULTILE_STATION, payloadInventory.OBJECT_FIND, StationProductHistory),
    };
  }

  findAll(): Promise<any> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_ALL], null)
      .then((rs) => {
        this.customerAllSource.next(rs);
      });
  }

  findById(id): Promise<any> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_CUSTOMER_BY_ID], [id])
      .then((rs) => {
        return rs.length ? rs[0] : null;
      });
  }

  public findCustomersByUsername(username: string): Promise<CustomerStationUserMappingModel[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_CUSTOMER_BY_USERNAME], [username], {});
  }

  public setCustomer(customer: CustomerStationUserMappingModel) {
    localStorage.setItem(APP_STORAGE_KEY.CUSTOMER_INFO, JSON.stringify(customer));
  }

  public getCustomer(): Observable<CustomerStationUserMappingModel> {
    const customer = localStorage.getItem(APP_STORAGE_KEY.CUSTOMER_INFO);
    return of(JSON.parse(customer));
  }

  public getStationsByStationId(stationId: string): Promise<CustomerStationModel[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_STATION_BY_STATION_ID], [stationId], {});
  }

  public getStationsDetailsByUsername(username: string): Promise<CustomerStationModel[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_STATION_DETAIL_BY_USERNAME], [username], {});
  }

  public getStationMappingByUsername(username: string): Promise<CustomerStationModel[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_BY_USERNAME], [username], {});
  }

  public getHistoryInventoryByStationId(stationId: string, startDate: number, endDate: number): Promise<StationProductHistory[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_INVENTORY_BY_STATION_ID], [stationId, startDate, endDate], {});
  }

  public getHistoryInventoryByMultipleStation(stationIds: string[], startDate: number, endDate: number): Promise<StationProductHistory[]> {
    return this.apiService.find(this.payloads[CUSTOMER_PAYLOAD_KEY.FIND_INVENTORY_BY_MULTIPLE_STATION],
        [stationIds.join(','), startDate, endDate], {});
  }
}
