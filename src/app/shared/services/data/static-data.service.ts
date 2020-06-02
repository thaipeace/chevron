import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {Payload} from '../../models/payload.model';
import {StaticDataPayloadsConstant} from '../../constants/static-data.payloads.constant';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {UpdateTypeModel} from '@shared/models/data.models/update-type.model';

const payloadProduct = StaticDataPayloadsConstant.PRODUCT;
const payloadUpdateType = PayloadsConstant.UPDATE_TYPE;

const STATIC_DATA_PAYLOAD_KEY = {
  GET_PRODUCT_STATIC_DATA: 'get_product_static_data',
  GET_ALL_UPDATE_TYPE: 'get_all_update_type'
};

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  payloads = {};

  private productStaticData: any;

  constructor(
    private _apiService: ApiService
  ) {
    this.payloads = {
      [STATIC_DATA_PAYLOAD_KEY.GET_PRODUCT_STATIC_DATA]:
        new Payload(payloadProduct.GET_PRODUCT_STATIC_DATA, null, null),
      [STATIC_DATA_PAYLOAD_KEY.GET_ALL_UPDATE_TYPE]:
        new Payload(payloadUpdateType.FIND_ALL, payloadUpdateType.OBJECT_FIND, UpdateTypeModel),
    };
  }

  public getProductStaticData(): Promise<any[]> {
    if (!!this.productStaticData) {
      return new Promise((resolve) => {
        resolve(this.productStaticData);
      });
    } else {
      return this._apiService.find(this.payloads[STATIC_DATA_PAYLOAD_KEY.GET_PRODUCT_STATIC_DATA], [], {})
        .then((rs) => {
          this.productStaticData = rs;
          return this.productStaticData;
        });
    }
  }

  public getAllUpdateType(): Promise<UpdateTypeModel[]> {
    return this._apiService.find(this.payloads[STATIC_DATA_PAYLOAD_KEY.GET_ALL_UPDATE_TYPE]);
  }
}
