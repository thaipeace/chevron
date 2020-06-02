import { Component, OnInit } from '@angular/core';
import { OrderModel } from '@app/shared/models/data.models/order/order.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import {
  MatSnackBar,
  MatDialogRef,
  MatTableDataSource
} from '@angular/material';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { OrderDataService } from '@app/shared/services/data/order-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@app/shared/constants/value.constant';
import { TankDataService } from '@app/shared/services/data/tank-data.service';
import {
  DefaultComponent,
  DefaultDialogComponent,
  IDialogComponent,
  staticImplements
} from '@app/shared/models/default/default-component.model';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';

@Component({
  selector: 'app-om-new',
  templateUrl: './om-new.component.html',
  styleUrls: ['./om-new.component.scss']
})
// @staticImplements<IDialogComponent>()
export class OmNewComponent extends DefaultDialogComponent implements OnInit {
  // static DEFAULT_WIDTH = 450;
  keys: string[] = [
    'estimatedTime',
    'stationId',
    'salesOrderNumber',
    'timeWindow',
    'remark'
  ];
  timeWindows: string[] = ['First Window', 'Second Window', 'Third Window'];
  formData: TQLFormData;
  today: Date = new Date();
  startTime: number;
  endTime: number;
  stations: StationModel[] = [];
  stationNames: string[] = [];
  availableStation: StationModel[] = [];
  onLoading: boolean = false;
  products: TankModel[] = [];
  tanks: TankModel[] = [];
  noProductError: boolean = false;
  tankNames: string[] = ['Euro4-97', 'Premium-95', 'B10-Diesel', 'Euro5-B7'];
  rfItem = new FormGroup({
    'Euro4-97': new FormControl(''),
    'Premium-95': new FormControl(''),
    'B10-Diesel': new FormControl(''),
    'Euro5-B7': new FormControl('')
  });

  tankMaxFillCapacities = {
    'Euro4-97': 0,
    'Premium-95': 0,
    'B10-Diesel': 0,
    'Euro5-B7': 0,
    'Diesel-S': 0
  };

  constructor(
    private _snackBar: MatSnackBar,
    private _StationDataService: StationDataService,
    public dialogRef: MatDialogRef<OmNewComponent>,
    public _orderDataService: OrderDataService,
    public _tankDataService: TankDataService
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.formData = OrderModel.getFormData();
    this.formData.setValue('estimatedTime', this.today);
    this.startTime = this.toStartOfDay(this.today).valueOf();
    this.endTime = moment(this.startTime)
      .add('day', 1)
      .subtract('second', 1)
      .valueOf();

    this.rfItem = new FormGroup({
      'Euro4-97': new FormControl(''),
      'Premium-95': new FormControl(''),
      'B10-Diesel': new FormControl(''),
      'Euro5-B7': new FormControl('')
    });

    this.loadData();
  }

  async loadData() {
    await this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.stations = rs;
      }
    });
    this.addSubscribes(
      this._tankDataService.tankAllObservable.subscribe(rs => {
        this.tanks = rs;
      })
    );
    this._tankDataService.findAll();
    await this.getAvailableStations();
  }

  toStartOfDay(date) {
    return moment(date)
      .millisecond(0)
      .second(0)
      .minute(0)
      .hour(0);
  }

  onTimeChange() {
    this.startTime = this.toStartOfDay(
      this.formData['estimatedTime'].value
    ).valueOf();
    this.endTime = moment(this.startTime)
      .add('day', 1)
      .subtract('second', 1)
      .valueOf();
    this.loadData();
  }

  async getAvailableStations() {
    let stationsInOrder;
    let stationIdsInOrder;
    stationsInOrder = await this._orderDataService.findStationByEstimatedTime(
      this.startTime,
      this.endTime
    );
    stationIdsInOrder = stationsInOrder.map(x => x.stationId);
    if (!stationsInOrder.length) {
      this.availableStation = this.stations;
      return;
    }
    this.availableStation = this.stations;
    // this.availableStation = this.stations.filter(x => {
    //   if (stationIdsInOrder.indexOf(x.sysId) < 0) {
    //     return true;
    //   }
    //   return false;
    // });
  }

  async getCurrentInventoryByStationId(id) {
    this.onLoading = true;
    this.products = [];
    this.rfItem = new FormGroup({
      'Euro4-97': new FormControl(''),
      'Premium-95': new FormControl(''),
      'B10-Diesel': new FormControl(''),
      'Euro5-B7': new FormControl(''),
      'Diesel-S': new FormControl('')
    });

    this.tankMaxFillCapacities = {
      'Euro4-97': 0,
      'Premium-95': 0,
      'B10-Diesel': 0,
      'Euro5-B7': 0,
      'Diesel-S': 0
    };

    let tempProducts = this.tanks.filter(x => x.stationId == id);

    if (tempProducts.length) {
      tempProducts.forEach(el => {
        // console.log(el);
        // console.log(this.rfItem.controls);
        this.tankMaxFillCapacities[el.productCode] += el.maxFillCapacity;
        this.rfItem.controls[el.productCode].setValidators([
          Validators.max(this.tankMaxFillCapacities[el.productCode]),
          Validators.min(0)
        ]);
      });
      this.tankNames.forEach(name => {
        let foundItem = tempProducts.find(x => x.productCode == name);
        if (!foundItem) {
          return;
        }
        this.products.push(foundItem);
      });
    }

    this.onLoading = false;
  }

  doCreate() {
    this.noProductError = false;

    if (
      !this.rfItem.get('Euro4-97').value &&
      !this.rfItem.get('Premium-95').value &&
      !this.rfItem.get('B10-Diesel').value &&
      !this.rfItem.get('Euro5-B7').value
    ) {
      this.noProductError = true;
      return;
    }

    let items = {};

    this.tankNames.forEach(t => {
      if (this.rfItem.get(t).value) {
        items[t] = this.rfItem.get(t).value;
      }
    })

    var result = Object.keys(items).map(function (key) {
      return { key: key, quantity: items[key] };
    });

    this.formData.setValue('item', result);
    this._orderDataService
      .createOrder(this.formData)
      .then(res => {
        this.onCancel('Created');
        this._snackBar.open('Created order successfully', X_BUTTON, {
          duration: NOTIFICATION_DEFAULT_DURARION
        });
      })
      .catch(() => {
        this._snackBar.open(
          'Oops! Something went wrong. Please try again.',
          X_BUTTON,
          { duration: NOTIFICATION_DEFAULT_DURARION }
        );
      });
  }

  onCancel(status: string = '') {
    this.dialogRef.close(status);
  }
}
