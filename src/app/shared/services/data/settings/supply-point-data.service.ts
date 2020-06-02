import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {SupplyPointModel} from '@shared/models/data.models/terminal/supply-point.model';
import {Payload} from '@shared/models/payload.model';

const payloadSupplyPoint = PayloadsConstant.SUPPLY_POINT;

@Injectable({
  providedIn: 'root'
})
export class SupplyPointDataService extends SettingsDataService {
  payloads = {};

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadSupplyPoint, SupplyPointModel);
  }

  deleteProducts(id: string) {
    return this._ApiService.findRaw(new Payload(payloadSupplyPoint.DELETE_PRODUCT), [id])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }

  findAllNested() {
    return this._ApiService.findRaw(new Payload(payloadSupplyPoint.FIND_ALL_NESTED));
  }
}
