import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ApiService} from '@shared/services/api.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {TripPreferenceModel} from '@shared/models/data.models/terminal/trip-preference.model';

const payloadTripPreference = PayloadsConstant.TRIP_PREFERENCE;

@Injectable({
  providedIn: 'root'
})
export class TripPreferenceService extends SettingsDataService {

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadTripPreference, TripPreferenceModel);
  }
}
