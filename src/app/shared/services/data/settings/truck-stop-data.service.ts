import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {TruckStopModel} from '@shared/models/data.models/terminal/truck-stop.model';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';

const payloadTruckStop = PayloadsConstant.TRUCK_STOP;
const PAYLOAD_KEYS = {};


@Injectable({
  providedIn: 'root'
})
export class TruckStopDataService extends SettingsDataService {
  payloads = {};

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadTruckStop, TruckStopModel);
  }

}
