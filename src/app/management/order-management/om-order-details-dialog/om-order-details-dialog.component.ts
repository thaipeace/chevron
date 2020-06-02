import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { OrderModel } from '@app/shared/models/data.models/order/order.model';
import { ORDER_STATUS } from '@shared/constants/value.constant';
import { DialogService } from '@shared/services/others/dialog.service';
import { OmPrepareCancellationDialogComponent } from '@management/order-management/om-prepare-cancellation-dialog/om-prepare-cancellation-dialog.component';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { OmOrderRemarkDialogComponent } from '@management/order-management/om-order-remark-dialog/om-order-remark-dialog.component';
import { OrderDataService } from '@shared/services/data/order-data.service';
import { OmOrderRescheduleDialogComponent } from '@management/order-management/om-order-reschedule-dialog/om-order-reschedule-dialog.component';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { DeliveryDataService } from '@shared/services/data/delivery-data.service';
import { SystemScheduleModel } from '@shared/models/data.models/delivery/system-schedule.model';
import { OrderStatusHistoryModel } from '@shared/models/data.models/order/order-status-history.model';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { FmTruckDetailsDialogComponent } from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import { TerminalDataService } from '@shared/services/data/settings/terminal-data.service';
import { TerminalModel } from '@shared/models/data.models/terminal/terminal.model';
import { DialogAlertComponent } from '@shared/components/dialog-template/dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-om-order-details-dialog',
  templateUrl: './om-order-details-dialog.component.html',
  styleUrls: ['./om-order-details-dialog.component.scss']
})
export class OmOrderDetailsDialogComponent extends DefaultDialogComponent implements OnInit {
  orderModel: OrderModel;
  currentTerminal: TerminalModel;
  id: string;
  ORDER_STATUS = ORDER_STATUS;
  readonly: boolean = true;
  stations: StationModel[] = [];
  systemSchedule: SystemScheduleModel;
  orderStatusHistory: OrderStatusHistoryModel[] = [];
  userRoleName: string = '';
  edit: boolean = false;
  rfItem = new FormGroup({
    'Euro4-97': new FormControl(''),
    'Premium-95': new FormControl(''),
    'B10-Diesel': new FormControl(''),
    'Euro5-B7': new FormControl('')
  });
  rfInfo = new FormGroup({
    'estimatedTime': new FormControl(''),
    'fixedEstimatedTime': new FormControl(''),
    'timeWindow': new FormControl(''),
  });
  today: Date = new Date();
  timeWindows: string[] = ['First Window', 'Second Window'];
  existOrderWarning: boolean = false;

  public origin: any;
  public destination: any;

  constructor(public dialogRef: MatDialogRef<OmOrderDetailsDialogComponent>,
    private _DialogService: DialogService,
    private _AuthenticationService: AuthenticationService,
    private _StationDataService: StationDataService,
    private _OrderDataService: OrderDataService,
    private _DeliveryDataService: DeliveryDataService,
    private _snackBar: MatSnackBar,
    private _TerminalDataService: TerminalDataService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(dialogRef);
    this.id = data.id;
    switch (this._AuthenticationService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
      case DEFAULT_ROLES.PLANNER:
        this.readonly = false;
        break;
      default:
        this.readonly = true;
    }

    this.rfItem.setValue({
      'Euro4-97': '',
      'Premium-95': '',
      'B10-Diesel': '',
      'Euro5-B7': ''
    });

    this.addSubscribes(
      this._AuthenticationService.loginedUserObservable.subscribe(([user]) => {
        if (user) {
          this.userRoleName = user.roleName;
        }
      }));

    this.addSubscribes(this._StationDataService.stationAllObservable
      .subscribe((rs) => {
        this.stations = rs;
        this.mapStation();
      }));

    this.addSubscribes(
      this._TerminalDataService.currentTerminalObservable
        .subscribe((rs) => {
          this.currentTerminal = rs;
          console.log(this.currentTerminal);
        })
    );

    this.onRefresh();
  }

  ngOnInit() {
    this._TerminalDataService.findSettingAll();
    this.existOrderWarning = false;
    this.getDirection();
  }

  onRefresh() {
    if (this.id) {
      this._OrderDataService.findById(this.id)
        .then((rs) => {
          this.orderModel = rs;
          this.mapStation();
          this.mapProducts();
          this.mapInfo();
        });
      this._DeliveryDataService.findCombinationByOrderId(this.id)
        .then((rs) => {
          this.systemSchedule = rs;
        });
      this._OrderDataService.findStatusHistoryById(this.id)
        .then((rs) => {
          this.orderStatusHistory = rs;
        });
    }
    this.existOrderWarning = false;
  }

  mapInfo() {
    this.rfInfo.setValue({
      'estimatedTime': '',
      'fixedEstimatedTime': '',
      'timeWindow': '',
    });
    if (this.orderModel) {
      this.rfInfo.get('estimatedTime').setValue(new Date(parseInt(this.orderModel['_raw']['estimatedTime'])) || '');
      this.rfInfo.get('fixedEstimatedTime').setValue(new Date(parseInt(this.orderModel['_raw']['estimatedTime'])) || '');
      this.rfInfo.get('timeWindow').setValue(this.orderModel.timeWindow || '');
    }
  }

  mapProducts() {
    this.rfItem.setValue({
      'Euro4-97': '',
      'Premium-95': '',
      'B10-Diesel': '',
      'Euro5-B7': ''
    });
    if (this.orderModel && this.orderModel.item && this.orderModel.item.length) {
      this.orderModel.item.forEach(element => {
        if (this.rfItem.get(element.productCode)) {
          this.rfItem.get(element.productCode).setValue(element.quantity);
        }
      });
    }
  }

  mapStation() {
    if (this.stations && this.orderModel) {
      this.orderModel.station = _.find(this.stations, (el) => {
        return el.getId() === this.orderModel.stationId;
      });
    }
  }

  toStartOfDay(date) {
    return moment(date).millisecond(0).second(0).minute(0).hour(0);
  }

  async onTimeChange() {
    this.existOrderWarning = false;

    let fixedstartTime = this.toStartOfDay(this.rfInfo.get('fixedEstimatedTime').value).valueOf();
    let fixedendTime = moment(fixedstartTime).add('day', 1).subtract('second', 1).valueOf();

    let timeChange = moment(this.rfInfo.get('estimatedTime').value).valueOf();

    if (timeChange >= fixedstartTime && timeChange <= fixedendTime) {
      return;
    }

    let startTime = this.toStartOfDay(this.rfInfo.get('estimatedTime').value).valueOf();
    let endTime = moment(startTime).add('day', 1).subtract('second', 1).valueOf();
    let stationsInOrder = await this._OrderDataService.findStationByEstimatedTime(startTime, endTime);
    if (stationsInOrder.findIndex(x => x.stationId == this.orderModel.stationId) > -1) {
      this.existOrderWarning = true;
      return;
    }
    return;
  }

  getDirection() {
    this.origin = { lat: 24.799448, lng: 120.979021 };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  }

  onCancel() {
    this.mapInfo();
    this.mapProducts();
    super.onCancel();
  }

  onRequestMessage(orderModel: OrderModel) {
    this._DialogService.open(OmOrderRemarkDialogComponent, {
      message: orderModel.remark,
      datetime: orderModel.lastUpdated,
      userName: orderModel.userName
    });
  }

  onRequestCancellation() {
    this._DialogService.open(OmPrepareCancellationDialogComponent,
      {
        order: this.orderModel
      },
      {},
      () => {
        //    TODO, update logic, nam, 07/15/2019
        this.onRefresh();
      });
  }

  onApproveCancellation() {
    this._DialogService.openConfirm('Are you sure to cancel this order?',
      () => {
        this._OrderDataService.approveCancel(this.orderModel.stationId, this.orderModel.getId())
          .then((rs) => {
            if (rs) {
              //    TODO, update logic, nam, 07/15/2019
              this.onRefresh();
            }
          });
      });

  }

  onReschedule() {
    this._DialogService.open(OmOrderRescheduleDialogComponent,
      {
        order: this.orderModel
      },
      {},
      () => {
        //    TODO, update logic, nam, 07/15/2019
        this.onRefresh();
      });
  }

  isTimePassed(timestamp) {
    return timestamp <= moment().valueOf();
  }

  onTruckDetails(truck: TruckModel) {
    if (truck) {
      this._DialogService.open(FmTruckDetailsDialogComponent, { id: truck.getId() });
    }
  }

  onUpdate() {
    let items = this.orderModel.item;
    const productValue = this.rfItem.getRawValue();
    const info = this.rfInfo.getRawValue();
    info['sysId'] = this.orderModel.getId();
    info['estimatedTime'] = info['estimatedTime'].valueOf();
    var productResult = [];
    Object.keys(productValue).map(function (key) {
      let foundItem = items.find(x => x.productCode == key);
      if (foundItem) {
        productResult.push({ key: foundItem.sysId, quantity: productValue[key] });
      }
    });

    this._OrderDataService.updateOrder(productResult, info).then(rs => {
      if (rs['data'] && rs['data']['Update']['Status'] === 'Success') {
        const message = `Updated order successfully!`;
        this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        this.dialogRef.close('Updated');
      } else {
        if (rs['data'] && rs['data']['Message']) {
          const message = rs['data']['Message'];
          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        } else {
          const message = `There are some problems. Please try again!`;
          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }
      }
    });
  }
}
