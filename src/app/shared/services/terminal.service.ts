import { Injectable } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { Payload } from '@shared/models/payload.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { TerminalPayloadsConstant } from '../constants/terminal-payloads.constant';
import { TerminalModel } from '../models/data.models/terminal/terminal.model';

const payloadTerminal = TerminalPayloadsConstant.TERMINAL;
const TERMINAL_PAYLOAD_KEY = {
  FIND_TERMINALS: 'find_terminal',
};

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  payloads = {};

  constructor(private apiService: ApiService, private authenService: AuthenticationService) {
    this.payloads = {
      [TERMINAL_PAYLOAD_KEY.FIND_TERMINALS]:
        new Payload(payloadTerminal.GET_TERMINALS, payloadTerminal.OBJECT_FIND, TerminalModel),
    };
  }

  public findTerminals(): Promise<TerminalModel[]> {
    return  this.apiService.find(this.payloads[TERMINAL_PAYLOAD_KEY.FIND_TERMINALS], null, {});
  }
}
