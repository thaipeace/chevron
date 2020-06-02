import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {QuotaModel} from '@shared/models/data.models/quota/quota.model';
import {TQLFormData} from '@shared/models/default/default-object.model';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {AuthenticationService} from '@app/user-management/shared/services';
import {ToastService} from '@shared/services/others/toast.service';
import * as _ from 'lodash';

const payloadQuota = PayloadsConstant.QUOTA;
const PAYLOAD_KEYS = {
  FIND_ALL: 'find_all',
  FIND_ALL_BY_STATION: 'find_all_by_station',
  FIND_BY_ID: 'find_by_id',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  UPLOAD_FILE: 'upload_file',
  GET_DATA_FROM_FILE: 'get_data_from_file',
  ADD_QUOTA_WITH_PRODUCT_CODE: 'add_quota_with_product_code',
};

@Injectable({
  providedIn: 'root'
})
export class QuotaDataService extends DefaultComponent {
  payloads = {};
  username;

  private quotaAllSource = new BehaviorSubject([]);
  quotaAllObservable = this.quotaAllSource.asObservable();

  constructor(private apiService: ApiService,
              private _AuthenticationService: AuthenticationService,
              private _ToastService: ToastService) {
    super();
    this.addSubscribes(this._AuthenticationService.loginedUserObservable
      .subscribe((user) => {
        if (user) {
          this.username = user.username;
        }
      }));

    this.payloads = {
      [PAYLOAD_KEYS.FIND_ALL]:
        new Payload(payloadQuota.FIND_ALL, payloadQuota.OBJECT_FIND, QuotaModel),
      [PAYLOAD_KEYS.FIND_ALL_BY_STATION]:
        new Payload(payloadQuota.FIND_ALL_BY_STATION, payloadQuota.OBJECT_FIND, QuotaModel),
      [PAYLOAD_KEYS.FIND_BY_ID]:
        new Payload(payloadQuota.FIND_BY_ID, payloadQuota.OBJECT_FIND, QuotaModel),
      [PAYLOAD_KEYS.CREATE]:
        new Payload(payloadQuota.CREATE, payloadQuota.OBJECT_FIND, QuotaModel),
      [PAYLOAD_KEYS.UPDATE]:
        new Payload(payloadQuota.UPDATE, payloadQuota.OBJECT_FIND, QuotaModel),
      [PAYLOAD_KEYS.UPLOAD_FILE]:
        new Payload(payloadQuota.UPLOAD_FILE),
      [PAYLOAD_KEYS.GET_DATA_FROM_FILE]:
        new Payload(payloadQuota.GET_DATA_FROM_FILE),
      [PAYLOAD_KEYS.ADD_QUOTA_WITH_PRODUCT_CODE]:
        new Payload(payloadQuota.ADD_QUOTA_WITH_PRODUCT_CODE),
      [PAYLOAD_KEYS.DELETE]:
        new Payload(payloadQuota.DELETE),
    };
  }

  findAll(): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL]);
  }

  findAllByStationIds(stationIds: string[], offset: number = 0, limit: number = 5): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL_BY_STATION],
      [stationIds.toString(), offset, limit])
      .then((rs) => {
        this.quotaAllSource.next(rs);
        return rs;
      });
  }

  findById(id): Promise<any> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id])
      .then((rs) => {
        return rs.length ? rs[0] : null;
      });
  }

  create(object: TQLFormData) {
    object.setValue('userName', this.username);
    return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE], object);
  }

  update(object: TQLFormData) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.UPDATE],
      [object.getValue('StationId'), object.getValue('ProductCode'),
        object.getValue('MonthlyQuota'), object.getValue('RemainingQuota')]);
  }

  uploadFile(data) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.UPLOAD_FILE], [data])
      .then((rs) => {
        console.log(rs);
        if (rs['data']['APIResponse']['Message']) {
          this._ToastService.openSimple(rs['data']['APIResponse']['Message']);
        }
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          return rs['data']['APIResponse']['FileName'];
        }
        return null;
      });
  }

  getUploadedFileData(name) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.GET_DATA_FROM_FILE], [name]);
  }

  delete(id: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DELETE], [id]);
  }

  addQuotaWithProductCode(stationId: string, data: any[][3]) {
    /*
    * <ProductQuota>
          <ProductCode>Premium-95</ProductCode>
          <MonthlyQuota>100000</MonthlyQuota>
          <RemainingQuota>150000</RemainingQuota>
          </ProductQuota>

        <ProductQuota>
          <ProductCode>B10-Diesel</ProductCode>
          <MonthlyQuota>170000</MonthlyQuota>
           <RemainingQuota>100000</RemainingQuota>
         </ProductQuota>
    * */

    let query = '';
    _.map();
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.ADD_QUOTA_WITH_PRODUCT_CODE], [stationId, query]);
  }
}
