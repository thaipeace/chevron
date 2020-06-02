import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {IUMTQLFormData} from '@app/user-management/shared/models/default/default-object.model';

const payloadOthers = PayloadsConstant.OTHERS;

@Injectable({
    providedIn: 'root'
})
export class MicsDataService {
    payloads = {};

    constructor(private _ApiService: ApiService) {
        this.payloads = {
            'send_alert_message': new Payload(payloadOthers.SEND_ALERT_MAIL, null, null),
        };
    }

    sendAlertMessage(username, subject, message) {
        return this._ApiService.findRaw(this.payloads['send_alert_message'], [username, subject, message]);
    }
}
