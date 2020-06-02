import * as _ from 'lodash';
import * as moment from 'moment';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {StationDataService} from '@shared/services/data/station-data.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {CompartmentModel} from '@shared/models/data.models/fleet/compartment.model';
import {OrderItemModel} from '@shared/models/data.models/order/order-item.model';
import {TankModel} from '@shared/models/data.models/tank/tank.model';
import {TripDataService} from '@shared/services/data/trip-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {FmTruckDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import {DialogAlertComponent} from '@shared/components/dialog-template/dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-sm-assign-order-dialog',
  templateUrl: './sm-assign-order-dialog.component.html',
  styleUrls: ['./sm-assign-order-dialog.component.scss']
})
export class SmAssignOrderDialogComponent extends DefaultDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  static DEFAULT_WIDTH = 1800;

  _isValidated: boolean = false;

  STEPS = {
    ONE: 1,
    TWO: 2
  };

  truckPlate: string;
  tripId: string;
  orderId: string;
  extraCompartments: any = [];
  validateFn: any;
  updateFn: any;

  allStations: StationModel[] = [];
  selectedOrders: OrderModel[] = [];
  step: number = this.STEPS.ONE;
  orderItems: OrderItemModel[] = [];
  orderItemTableData: MatTableDataSource<OrderItemModel>;
  orderItemTableColumns = ['salesOrderNumber', 'billTo', 'shipTo', 'shipToName', 'lineItem'];
  compartmentTableData: MatTableDataSource<CompartmentModel>;
  compartmentTableColumns = ['compartmentNumber', 'capacity', 'order'];
  tanksTableData: MatTableDataSource<TankModel>;
  tanksTableColumns = ['shipTo', 'shipToName', 'dischargePoint', 'tankIndex', 'ullage', 'productCode'];
  truck: TruckModel;
  stations: StationModel[] = [];
  selectedStation: StationModel;
  tanks: TankModel[] = [];
  compartments: CompartmentModel[] = [];
  defaultOrderStartDate: any;
  defaultOrderEndDate: any;
  divertCompartments: CompartmentModel[] = [];

  constructor(private _StationDataService: StationDataService,
              private _TruckDataService: TruckDataService,
              private _TripDataService: TripDataService,
              private _SideBarService: SideBarService,
              private _snackBar: MatSnackBar,
              private _DialogService: DialogService,
              public dialogRef: MatDialogRef<SmAssignOrderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ISmAssignOrderDialogComponent) {
    super(dialogRef);
    // console.log(data);
    if (data) {
      this.truckPlate = data.truckPlate;
      this.tripId = data.tripId;
      this.orderId = data.orderId;
      this.extraCompartments = data.compartments ? data.compartments : [];
      this.divertCompartments = data.divertCompartments ? data.divertCompartments : [];
      this.validateFn = data.validateFn;
      this.updateFn = data.updateFn;
      this.loadTruck();
    }

    this.defaultOrderStartDate = moment().subtract(7, 'days').valueOf();
    this.defaultOrderEndDate = moment().add(7, 'days').valueOf();
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.allStations = rs;
      }
    });
  }

  selectOrder(orders: OrderModel[]) {
    this.selectedOrders = orders;
  }

  private loadTruck() {
    this._TruckDataService.findByTruckPlate(this.truckPlate)
      .then((rs) => {
        // console.log(rs);
        if (rs.length) {
          this.truck = rs[0];
          this.compartments = this.truck.compartments;
          _.map(this.compartments, (el) => {
            el.orderItem = null;
            const foundExist = _.find(this.extraCompartments, (extra) => {
              return extra['CompartmentNumber'] == el._data['compartmentNumber'];
            });
            if (typeof foundExist !== 'undefined') {
              el.currentProduct = foundExist['CurrentProduct'] !== 'NA' ? foundExist['CurrentProduct'] : null;
            }
            const foundDivert = _.find(this.divertCompartments, (divert) => {
              return divert._data['CompartmentNumber'] == el._data['compartmentNumber'];
            });
            if (typeof foundDivert !== 'undefined') {
              el.divert = foundDivert._data['LineItem'] !== 'NA' ? foundDivert._data['LineItem'] : null;
            }
          });
          this.compartmentTableData = new MatTableDataSource(this.compartments);
          this.compartmentTableData.sort = this.sort;
          console.log(this.divertCompartments);
          console.log(this.compartments);
          // console.log(this.extraCompartments);
        } else {
          console.error('no truck found');
        }
      });
  }

  private loadStations() {
    const ids = _.map(this.selectedOrders, (el) => {
      return el.stationId;
    });
    this.stations = [];
    this.selectedStation = null;
    if (ids.length) {
      this._StationDataService.findMultipleStation(ids)
        .then((rs) => {
          this.stations = rs;
          this.tanks = [];
          _.map(this.stations, (el) => {
            this.tanks = this.tanks.concat(el.tanks);
          });
          _.map(this.selectedOrders, (el) => {
            el.station = _.find(this.stations, s => s.getId() === el.stationId);
          });
          this.tanksTableData = new MatTableDataSource(this.tanks);
          this.tanksTableData.sort = this.sort;
        });
    }
  }

  linkOrderItem(row: any, item: OrderItemModel) {
    this._isValidated = false;
    if (!row.orderItem) {
      row.setOrder(item);
    }
  }

  unlinkOrderItem(row: any) {
    row.setOrder(null);
    this._isValidated = false;
  }

  next() {
    this.step = this.STEPS.TWO;
    this.orderItems = [];
    _.map(this.selectedOrders, (el) => {
      _.map(el.items, (item) => item.order = el);
      this.orderItems = this.orderItems.concat(el.items);
    });
    this.orderItemTableData = new MatTableDataSource(this.orderItems);
    this.orderItemTableData.sort = this.sort;
    this.loadStations();
  }

  back() {
    this.step = this.STEPS.ONE;
    this._isValidated = false;
    _.map(this.compartments, (el) => {
      el.setOrder(null);
    });
  }

  validate(compartments) {
    this.validateFn(this.tripId, this.orderId, compartments)
      .then((rs) => {
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          this._snackBar.open(rs['data']['APIResponse']['Message']);
          this._isValidated = true;
        } else {
          this._DialogService.open(DialogAlertComponent, {title: 'Error', message: rs['data']['APIResponse']['Message']});
        }
      });
  }

  finish(compartments) {
    this.updateFn(this.tripId, this.orderId, compartments)
      .then((rs) => {
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          this._snackBar.open(rs['data']['APIResponse']['Message']);
          this._isValidated = true;
          this._SideBarService.refreshWithDestination();
          this.onCancel();
        } else {
          this._DialogService.open(DialogAlertComponent, {title: 'Error', message: rs['data']['APIResponse']['Message']});
        }
      });
  }

  getAssociateData(compartments, callback) {
    const compartmentNos = [];
    const orderItemIds = [];
    _.map(compartments, (el) => {
      if (el.orderItem) {
        compartmentNos.push(el._data.compartmentNumber);
        orderItemIds.push(el.orderItem.getId());
      }
    });
    callback(compartmentNos, orderItemIds);
  }

  onTruckDetails(id: any) {
    this._DialogService.open(FmTruckDetailsDialogComponent, {
      id: id
    });
  }

  filterByProductCode(array, code: string) {
    return _.filter(array, (el) => el._data.productCode === code);
  }
}

interface ISmAssignOrderDialogComponent {
  truckPlate: string;
  tripId: string;
  orderId: string;
  compartments: any;
  divertCompartments: any;
  validateFn: any;
  updateFn: any;
}
