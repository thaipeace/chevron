import {Injectable} from '@angular/core';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ApiService} from '@shared/services/api.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {BaseProductModel} from '@shared/models/data.models/terminal/base-product.model';

const payloadBaseProduct = PayloadsConstant.BASE_PRODUCT;

@Injectable({
  providedIn: 'root'
})
export class BaseProductDataService extends SettingsDataService {

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadBaseProduct, BaseProductModel);
  }
}
