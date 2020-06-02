import { Component, Inject, OnInit, Input } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { DeliveryDataService } from '@shared/services/data/delivery-data.service';
import { OrderModel } from '@shared/models/data.models/order/order.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { OrderDataService } from '@shared/services/data/order-data.service';
import { OmOrderDetailsDialogComponent } from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';
import { DialogService } from '@shared/services/others/dialog.service';
import { TruckDataService } from '@shared/services/data/truck-data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TruckTripModel } from '@shared/models/data.models/delivery/truck-trip.model';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { SystemScheduleModel } from '@shared/models/data.models/delivery/system-schedule.model';
import { ToastService } from '@shared/services/others/toast.service';

@Component({
  selector: 'app-dm-schedule-dialog',
  templateUrl: './dm-schedule-dialog.component.html',
  styleUrls: ['./dm-schedule-dialog.component.scss']
})
export class DmScheduleDialogComponent extends DefaultDialogComponent implements OnInit {
  orders: OrderModel[];
  selectedOrders: OrderModel[] = [];
  currentDate: any;
  scheduleFromDateTime: any;
  scheduleToDateTime: any;
  orderFromDateTime: any;
  orderToDateTime: any;
  selectedTruck: TruckModel;
  trucks: TruckModel[] = [];
  freeTruckPlates: string[] = [];
  isError: any = false;

  constructor(
    public dialogRef: MatDialogRef<DmScheduleDialogComponent>,
    private _DeliveryDataService: DeliveryDataService,
    private _OrderDataService: OrderDataService,
    private _TruckDataService: TruckDataService,
    private _DialogService: DialogService,
    private _ToastService: ToastService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dialogRef);
    this.currentDate = moment().toDate();
  }

  ngOnInit() {
    this.loadOrders();

    if (this.data && this.data.freeTruckPlates) {
      this.freeTruckPlates = this.data.freeTruckPlates;
    }
  }

  loadOrders() {
    this._OrderDataService.findReadyForSchedule(this.currentDate.getTime())
      .then((rs) => {
        const orders = _.filter(rs, (el) => el.salesOrderNumber);
        const ids = _.map(orders, (el) => {
          return el.getId();
        });
        this._DeliveryDataService.findSystemScheduleByOrderIds(ids)
          .then((array) => {
            this.orders = _.filter(orders, (order) => {
              return !_.find(array, (e) => order.getId() == e.orderId);
            });
          });
      });
  }

  loadTrucks() {
    this._TruckDataService.findTruckByMappingDataAndTimeRangeWithObject(
      moment(this.scheduleFromDateTime).startOf('day').valueOf(),
      moment(this.scheduleToDateTime).endOf('day').valueOf()
    ).then((rs) => {
      this.trucks = this.distintById(rs, 'truckPlate');
      this.trucks = this.trucks.filter(t => this.freeTruckPlates.includes(t.truckPlate));
    });
  }

  onScheduleTimeChange() {
    if (this.scheduleFromDateTime && this.scheduleToDateTime) {
      this.loadTrucks();
    }
  }

  addOrder(item) {
    let order = item.item;
    if (order) {
      this.orders.splice(this.orders.indexOf(order), 1);
      this.selectedOrders.push(order);
      this.orders = [...this.orders];
      this.selectedOrders = [...this.selectedOrders];
      this.checkScheduleTime();
      this.reset();
    }
  }

  removeOrder(order: OrderModel) {
    this.orders.push(order);
    this.selectedOrders.splice(this.selectedOrders.indexOf(order), 1);
    this.orders = [...this.orders];
    this.selectedOrders = [...this.selectedOrders];
    this.checkScheduleTime();
    this.reset();
  }

  reset() {
    this.scheduleFromDateTime = null;
    this.scheduleToDateTime = null;
    this.selectedTruck = null;
  }

  checkScheduleTime() {
    if (this.selectedOrders.length) {
      this.orderFromDateTime = new Date(parseInt(_.minBy(this.selectedOrders, (el) => {
        return parseInt(el.getRawValue('estimatedTime'));
      }).getRawValue('estimatedTime')));
      this.orderToDateTime = new Date(parseInt(_.maxBy(this.selectedOrders, (el) => {
        return parseInt(el.getRawValue('estimatedTime'));
      }).getRawValue('estimatedTime')));

    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedOrders, event.previousIndex, event.currentIndex);
  }

  onSelectTruck($event: any) {
    this.selectedTruck = $event.item;
  }

  onSchedule() {
    let sorted = true;

    for (let i = 0; i < this.selectedOrders.length - 1; i++) {
      if (parseInt(this.selectedOrders[i].getRawValue('estimatedTime'))
        > parseInt(this.selectedOrders[i + 1].getRawValue('estimatedTime'))) {
        sorted = false;
        break;
      }
    }

    if (!sorted) {
      this.isError = true;
      return;
    }
    this.isError = false;

    const truckTripObj = TruckTripModel.getFormData();
    truckTripObj.setValue('truckId', this.selectedTruck.getId());
    truckTripObj.setValue('scheduledTimeFrom', moment(this.scheduleFromDateTime).valueOf());
    truckTripObj.setValue('scheduledTimeTo', moment(this.scheduleToDateTime).valueOf());
    this._DeliveryDataService.createTrucktrip(truckTripObj)
      .then((rs) => {
        if (rs[0] === true) {
          const id = rs[1]['Create'][PayloadsConstant.TRUCK_TRIP.OBJECT_FIND]['sysId'];
          const arrayPromise = [];
          _.map(this.selectedOrders, (el, index) => {
            let obj = SystemScheduleModel.getFormData();
            obj.setValue('stationId', el.stationId);
            obj.setValue('orderId', el.getId());
            obj.setValue('tripId', id);
            obj.setValue('truckId', this.selectedTruck.getId());
            obj.setValue('dropNumber', index + 1);
            arrayPromise.push(this._DeliveryDataService.createSystemSchedule(obj));
          });
          Promise.all(arrayPromise).then(values => {
            this._ToastService.openSimple('All are created successfully!');
            this.dialogRef.close('Scheduled');
          });
        }
      });
  }

  onOrderDetails(order: OrderModel) {
    this._DialogService.open(
      OmOrderDetailsDialogComponent,
      {
        id: order.getId(),
      }
    );
  }

  private distintById(array, id) {
    const result = [];
    const map = new Map();
    for (const item of array) {
      if (!map.has(item[id])) {
        map.set(item[id], true);
        result.push(item);
      }
    }

    return result;
  }
}
