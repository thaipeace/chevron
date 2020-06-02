import { Injectable, OnInit } from '@angular/core';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { ApiService } from '@shared/services/api.service';
import { TerminalModel } from '@shared/models/data.models/terminal/terminal.model';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { SettingsDataService } from '@shared/services/data/settings/settings-data.service';
import { BehaviorSubject } from 'rxjs';

const payloadTerminal = PayloadsConstant.TERMINAL;

@Injectable({
  providedIn: 'root'
})
export class TerminalDataService extends SettingsDataService {

  private currentTerminalSource = new BehaviorSubject(null);
  currentTerminalObservable = this.currentTerminalSource.asObservable();

  constructor(public _ApiService: ApiService,
    public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadTerminal, TerminalModel);
  }

  findAll(): Promise<any> {
    return super.findSettingAll()
      .then((rs) => {
        if (rs && rs.length) {
          this.currentTerminalSource.next(rs[0]);
        }
        return rs;
      });
  }

  findSettingAll() {
    return super.findSettingAll()
      .then((rs) => {
        if (rs && rs.length) {
          this.currentTerminalSource.next(rs[0]);
        }
        return rs;
      });
  }
}
