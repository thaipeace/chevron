import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { ApiService } from '@shared/services/api.service';
import { ExceptionAreaModel } from '@shared/models/data.models/terminal/exception-area.model';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';

const payloadExceptionAreas = PayloadsConstant.EXCEPTION_AREAS;

@Injectable({
  providedIn: 'root'
})
export class ExceptionAreaDataService extends SettingsDataService {

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadExceptionAreas, ExceptionAreaModel);
  }
}
