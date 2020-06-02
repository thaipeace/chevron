import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {ReportModel} from '@shared/models/data.models/report.model';
import {ErrorHandlerService} from '@shared/services/error-handler.service';

const payloadReport = PayloadsConstant.REPORT;
const PAYLOAD_KEYS = {
  FIND_ALL: 'find_all',
  GENERATE: 'generate',
};

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  payloads = {};

  constructor(private _ApiService: ApiService,
              private _ErrorHandlerService: ErrorHandlerService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_ALL]: new Payload(
        payloadReport.FIND_ALL,
        payloadReport.OBJECT_FIND,
        ReportModel
      ),
      [PAYLOAD_KEYS.GENERATE]: new Payload(
        payloadReport.GENERATE
      ),
    };
  }

  findAll() {
    return this._ApiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null);
  }

  generate(id: string, startDate: number, endDate: number) {
    return this._ApiService.findRaw(this.payloads[PAYLOAD_KEYS.GENERATE], [id, startDate, endDate])
      .then((rs) => {
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          return rs['data']['APIResponse']['ReportLink'];
        }
        return null;
      });
  }
}
