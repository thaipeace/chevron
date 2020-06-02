import {Injectable} from '@angular/core';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {DEFAULT_VALUES, DEFAULT_ENDPOINTS} from '../constants/config.constant';
import {Observable} from 'rxjs';
import {StationInventoryPayloads} from '../constants/station-inventory-payloads.constant';
import {StationInventoryModel} from '../models/data.models/station/station-inventory.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import {IStationTankModel} from '../models/data.models/customer/customer-station.model';
import {
  StationInventoryProductProfileModel,
  IStationProductProfile
} from '../models/data.models/station/station_inventory_product_profile.model';
import {PayloadsConstant} from '../constants/payloads.constant';
import {TankModel} from '../models/data.models/tank/tank.model';

const payloadInventory = StationInventoryPayloads.INVENTORY;
const payloadInventoryProduct = StationInventoryPayloads.INVENTORY_PRODUCT_PROFILE;
const payloadTank = PayloadsConstant.TANK;
const INVENTORY_PAYLOAD_KEY = {
  UPDATE_INVENTORY_BY_TANKID: 'update_inventory_by_tankid',
  FIND_INVENTORY_PRODUCT_PROFILE: 'find_inventory_product_profile',
  FIND_TANK_BY_STATION: 'find_tank_by_station',
};

@Injectable({
  providedIn: 'root',
})
export class StationInventoryService {
  payloads = {};

  constructor(private apiService: ApiService) {
    this.payloads = {
      [INVENTORY_PAYLOAD_KEY.UPDATE_INVENTORY_BY_TANKID]:
        new Payload(payloadInventory.UPDATE_TANK_INVENTORY, null, StationInventoryModel),
      [INVENTORY_PAYLOAD_KEY.FIND_INVENTORY_PRODUCT_PROFILE]:
        new Payload(payloadInventoryProduct.FIND_INVENTORY_PRODUCT_PROFILE, payloadInventoryProduct.OBJECT_FIND,
          StationInventoryProductProfileModel),
      [INVENTORY_PAYLOAD_KEY.FIND_TANK_BY_STATION]:
        new Payload(payloadTank.FIND_ALL, payloadTank.OBJECT_FIND, TankModel),
    };
  }

  public updateTankInventory(stationId: string, tanks: IStationTankModel[], comment: string, userName: string): Promise<any[]> {
    let tankData = '';
    tanks.forEach(tank => {
      tankData += `
      <tank>
        <tankId>${tank.sysId}</tankId>
        <currentInventory>${tank.currentVolume}</currentInventory>
      </tank>`;
    });
    const updateObj = new TQLFormData();
    updateObj.setValue('stationId', stationId);
    updateObj.setValue('tanks', tankData);
    updateObj.setValue('comment', comment);
    updateObj.setValue('userName', userName);

    return this.apiService.update(this.payloads[INVENTORY_PAYLOAD_KEY.UPDATE_INVENTORY_BY_TANKID], updateObj, DEFAULT_ENDPOINTS.DEFAULT, {
      [DEFAULT_VALUES.HEADER_APP_NAME]: DEFAULT_VALUES.APP_NAME,
    });
  }

  public getStationInventoryProductProfile(stationId: string): Promise<StationInventoryProductProfileModel[]> {
    return this.apiService.find(this.payloads[INVENTORY_PAYLOAD_KEY.FIND_INVENTORY_PRODUCT_PROFILE], [stationId], {});
  }

  public getTanksByStationId(stationId: string): Promise<TankModel[]> {
    return this.apiService.find(this.payloads[INVENTORY_PAYLOAD_KEY.FIND_TANK_BY_STATION], [stationId], {});
  }

}
