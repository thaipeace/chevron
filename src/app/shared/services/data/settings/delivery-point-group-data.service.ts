import {Injectable} from '@angular/core';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {ApiService} from '@shared/services/api.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {DeliveryPointGroupModel} from '@shared/models/data.models/terminal/delivery-point-group.model';
import { BehaviorSubject } from 'rxjs';

const payloadDeliveryPointGroup = PayloadsConstant.DELIVERY_POINT_GROUP;

@Injectable({
  providedIn: 'root'
})
export class DeliveryPointGroupDataService extends SettingsDataService {

  private currentDPGSource = new BehaviorSubject(null);
  currentDPGObservable = this.currentDPGSource.asObservable();

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService) {
    super(_ApiService, _ErrorHandlerService, payloadDeliveryPointGroup, DeliveryPointGroupModel);
  }

  findAll(): Promise<any> {
    return super.findSettingAll()
      .then((rs) => {
        if (rs && rs.length) {
          this.currentDPGSource.next(rs[0]);
        }
        return rs;
      });
  }

  findSettingAll() {
    return super.findSettingAll()
      .then((rs) => {
        if (rs && rs.length) {
          this.currentDPGSource.next(rs[0]);
        }
        return rs;
      });
  }
}
