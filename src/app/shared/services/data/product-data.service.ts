import {Injectable} from '@angular/core';
import {ApiService} from '@shared/services/api.service';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {ProductModel} from '@shared/models/data.models/terminal/product.model';

const payloadProduct = PayloadsConstant.PRODUCT;

@Injectable({
  providedIn: 'root'
})
export class ProductDataService extends SettingsDataService {
  payloads = {};

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadProduct, ProductModel);
  }

}
