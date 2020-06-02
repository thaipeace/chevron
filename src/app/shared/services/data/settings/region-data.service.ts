import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {UtilsService} from '@shared/services/utils.service';
import {RegionModel} from '@shared/models/data.models/terminal/region.model';
import {TerminalModel} from '@shared/models/data.models/terminal/terminal.model';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {FleetBaseModel} from '@shared/models/data.models/terminal/fleet-base.model';

const payloadRegion = PayloadsConstant.REGION;

@Injectable({
  providedIn: 'root'
})
export class RegionDataService extends SettingsDataService {

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadRegion, RegionModel);
  }

  deleteSupplyPoint(id: string) {
    return this._ApiService.findRaw(new Payload(payloadRegion.DELETE_SUPPLY_POINT), [id])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }

  deleteTruckRate(id: string) {
    return this._ApiService.findRaw(new Payload(payloadRegion.DELETE_TRUCK_RATE), [id])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }
}
