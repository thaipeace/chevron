import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {FleetBaseModel} from '@shared/models/data.models/terminal/fleet-base.model';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';

const payloadFleetBase = PayloadsConstant.FLEET_BASE;

@Injectable({
  providedIn: 'root'
})
export class FleetBaseDataService extends SettingsDataService {

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadFleetBase, FleetBaseModel);
  }
}
