import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import {NotificationModel} from '@shared/models/data.models/notification/notification.model';
import {TQLFormData} from '@app/user-management/shared/models/default/default-object.model';
import {AuthenticationService} from '@app/user-management/shared/services';
import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import * as _ from 'lodash';

const payloadNotification = PayloadsConstant.NOTIFICATION;

@Injectable({
  providedIn: 'root'
})
export class NotificationDataService {
  payloads = {};

  private findAllSource = new BehaviorSubject([]);
  findAllObservable = this.findAllSource.asObservable();
  private findByRoleSource = new BehaviorSubject([]);
  findByRoleObservable = this.findByRoleSource.asObservable();
  private findAllSourceForManagement = new BehaviorSubject([]);
  findAllSourceForManagementObservable = this.findAllSourceForManagement.asObservable();

  constructor(private _ApiService: ApiService,
              private _AuthenticationService: AuthenticationService) {
    this.payloads = {
      'find_all': new Payload(payloadNotification.FIND_ALL,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_all_by_stations': new Payload(payloadNotification.FIND_BY_STATIONS,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_by_notification_id': new Payload(payloadNotification.FIND_BY_NOTIFICATION_ID,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'delete': new Payload(payloadNotification.DELETE_BY_NOTIFICATION_ID,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_for_admin': new Payload(payloadNotification.FIND_FOR_ADMIN,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_for_planner': new Payload(payloadNotification.FIND_FOR_PLANNER,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_for_customer': new Payload(payloadNotification.FIND_FOR_CUSTOMER,
        payloadNotification.OBJECT_FIND, NotificationModel),
      'find_for_truck_owner_operator': new Payload(payloadNotification.FIND_FOR_TRUCK_OWNER_OPERATOR,
        payloadNotification.OBJECT_FIND, NotificationModel)
    };
  }

  findForAdmin(limit: number = 10) {
    return this._ApiService.find(this.payloads['find_for_admin'], [limit])
      .then((rs) => {
        this.findByRoleSource.next(rs);
        return rs;
      });
  }

  findForPlanner(limit: number = 10) {
    return this._ApiService.find(this.payloads['find_for_planner'], [limit])
      .then((rs) => {
        this.findByRoleSource.next(rs);
        return rs;
      });
  }

  findForCustomer(stationIds: string[], limit: number = 10): Promise<void | NotificationModel[]> {
    return this._ApiService.find(this.payloads['find_for_customer']
      , [limit, stationIds.join(',')])
      .then((rs) => {
        this.findByRoleSource.next(rs);
        return rs;
      });
  }

  findForTruckOwnerOperator(companyIds: string[], limit: number = 10): Promise<void | NotificationModel[]> {
    return this._ApiService.find(this.payloads['find_for_truck_owner_operator']
      , [limit, companyIds.join(',')])
      .then((rs) => {
        this.findByRoleSource.next(rs);
        return rs;
      });
  }

  findAll(limit: number = 1): Promise<void | NotificationModel[]> {
    return this._ApiService.find(this.payloads['find_all']
      , [limit])
      .then((rs) => {
        this.findAllSource.next(rs);
        return rs;
      });
  }

  findAllForManagementOptions(limit: number = 1, offset: number = 0, sortColumn: string = '', sortType: string = 'asc', others): Promise<void | NotificationModel[]> {
    let query = '';
    switch (this._AuthenticationService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
        query = payloadNotification.FIND_FOR_ADMIN;
        break;
      case DEFAULT_ROLES.PLANNER:
        query = payloadNotification.FIND_FOR_PLANNER;
        break;
      case DEFAULT_ROLES.CUSTOMER:
        query = payloadNotification.FIND_FOR_CUSTOMER;
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
      case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        query = payloadNotification.FIND_FOR_TRUCK_OWNER_OPERATOR;
        break;
    }
    if (query.indexOf('{1}') >= 0) {
      //reserve for other options
      query = _.replace(query, '{1}', '{4}');
    }
    let array = query.split('\n');
    if (array[2].indexOf('Find') < 0) {
      throw new Error('payload is error');
    } else {
      array[2] = payloadNotification.FIND_ALL_WITH_OPTIONS;
    }
    query = array.join('\n');
    console.log(query);
    return this._ApiService.find(new Payload(query,
      payloadNotification.OBJECT_FIND, NotificationModel)
      , (others !== null ? [limit, offset, sortColumn, sortType, others] : [limit, offset, sortColumn, sortType]))
      .then((rs) => {
        // console.log(rs);
        this.findAllSourceForManagement.next(rs);
        return rs;
      });
  }

  findByStations(stationIds: string[], limit: number = 1): Promise<void | NotificationModel[]> {
    return this._ApiService.find(this.payloads['find_all_by_stations']
      , [stationIds.join(','), limit])
      .then((rs) => {
        this.findAllSource.next(rs);
        return rs;
      });
  }

  findById(id: string): Promise<NotificationModel> {
    return this._ApiService.find(this.payloads['find_by_notification_id'], [id])
      .then((rs) => {
        return rs.length ? rs[0] : null;
      });
  }

  delete(object: TQLFormData) {
    return this._ApiService.delete(this.payloads['delete'], object)
      .then((rs) => {
        return rs;
      });
  }

}
