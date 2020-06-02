import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerStationModel } from './../../../shared/models/data.models/customer/customer-station.model';
import { TerminalModel } from './../../../shared/models/data.models/terminal/terminal.model';
import { TerminalService } from './../../../shared/services/terminal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CURRENT_ORDERS } from '@shared/constants/dummy.constant';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import { CustomerService } from '@app/shared/services/customer.service';
import { UtilsService } from '@app/shared/services/utils.service';
import { IChartMeterViewModel } from '@shared/models/chart-meter.viewmodel';
import { IHashObject } from '@app/shared/models/interfaces/generic-types.interface';
import { IStationTankModel } from '@app/shared/models/data.models/customer/customer-station.model';
import { Subject } from 'rxjs';
import { StationInventoryService } from '@app/shared/services/station-inventory.service';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION,
  GET_COLOR_BY_PRODUCTCODE,
  ORDER_STATUS,
  ORDER_ITEM_COLOR,
  ORDER_ITEM_TRANSLATE,
  ORDER_PRODUCT_COLOR
} from '@app/shared/constants/value.constant';
import { UpdateInventoryDialogComponent } from '../dialogs/update-inventory-dialog.component';
import { StaticDataService } from '@shared/services/data/static-data.service';
import { CustomerOrderService } from '@app/shared/services/customer-order.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { CustomerOrderSummaryModel } from '@app/shared/models/data.models/customer/customer-order-summary.model';
import { StationOrderModel } from '@app/shared/models/data.models/station/station-order.model';
import { StationInventoryProductProfileModel } from '@app/shared/models/data.models/station/station_inventory_product_profile.model';
import { takeUntil } from 'rxjs/operators';
import { InventoryDataService } from '@shared/services/data/inventory-data.service';
import { DialogService } from '@shared/services/others/dialog.service';
import { EstimatedInventoryHintDialogComponent } from '@app/routes/customer/dashboard/estimated-inventory-hint-dialog/estimated-inventory-hint-dialog.component';
import { OmOrderDetailsDialogComponent } from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { OmPrepareCancellationDialogComponent } from '@management/order-management/om-prepare-cancellation-dialog/om-prepare-cancellation-dialog.component';
import { OmOrderRemarkDialogComponent } from '@management/order-management/om-order-remark-dialog/om-order-remark-dialog.component';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { ParamsService } from '@app/shared/services/params.service';

const Highcharts = require('highcharts');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DefaultComponent implements OnInit, OnDestroy {
  // current_month = moment().format('MMMM');
  // chartDate: Date[] = [new Date(), new Date()];
  current_orders = [];
  next_orders = [];
  // current_time = moment().valueOf();
  all_orders: any[] = [];
  stations: any[];
  // productCodeByStation: IHashObject<string[]>;
  terminal: TerminalModel;
  destroy$: Subject<boolean> = new Subject<boolean>();

  expansionGroupByStation: IHashObject<IHashObject<boolean>>;
  upcomingOrdersByStation: IHashObject<any>;
  // inventoryMeterByStation: IHashObject<IHashObject<IChartMeterViewModel>>;
  selectedStation: any;
  productItems: IHashObject<string>;

  currentMonth: string;
  estimatedInventoryChart: object = {};
  summaryOfMonthChart: any = {};
  productChart: any = {};

  // private $destroy: Subject<boolean> = new Subject<boolean>();
  snackBar;
  showByProductCode: any = true;
  inventoryData: any;

  private openingDialogRef: MatDialogRef<any>;
  ORDER_STATUS = ORDER_STATUS;
  enableFunctionality: any;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _StationDataService: StationDataService,
    private _stationInventoryService: StationInventoryService,
    private _terminalService: TerminalService,
    private _customerService: CustomerService,
    private _customerOrderService: CustomerOrderService,
    private _authenService: AuthenticationService,
    private _staticDataService: StaticDataService,
    private _InventoryDataService: InventoryDataService,
    private _DialogService: DialogService,
    private paramsService: ParamsService
  ) {
    super();
  }

  ngOnInit() {
    this.paramsService.params.subscribe(result => {
      if (!result.params || !result.params.length) {
        this.paramsService.getAllParams();
      } else {
        this.enableFunctionality = result.params.find(p => p.VarName === 'Enable Experimental Functionality');
        this._staticDataService.getProductStaticData().then(data => {
          this.productItems = {};
          data.forEach(item => {
            this.productItems[item.StaticData.key] = item.StaticData.value;
          });
        });
        
        this._StationDataService.findAllByUsername(this._authenService.user.username);
        this.addSubscribes(
          this._authenService.loginedUserObservable.pipe(takeUntil(this.destroy$)).subscribe(el => {
            if (!!el) {
              this._loadStationData();
            }
          })
        );
    
        // this._loadTerminalData();
        // this._loadTerminalData();
        this.loadCurrentOrders();
        this.loadNextOrder();
        this.loadAllOrder();
    
        const today = new Date();
        this.currentMonth = `${UtilsService.getMonthName(today)}, ${today.getFullYear()}`;
      }
    });

    this.paramsService.broadcastParams();
  }

  ngOnDestroy() {
    if (!!this.openingDialogRef) {
      this.openingDialogRef.close();
    }
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    super.ngOnDestroy();
  }

  loadChart() {
    this._InventoryDataService.findPrediction(this.selectedStation.stationName).then(rs => {
      let data = rs['data']['Inventory'];
      this.estimatedInventoryChart = {};
      if (!data) {
        return;
      }
      const categories = Object.keys(data);
      const currentTimePoint = 0;
      let sampleDataWeatherForecast = [];

      _.map(categories, el => {
        const obj = {
          name: el,
          data: []
        };
        if (!UtilsService.isArray(data[el])) {
          // fix if only 1 data
          data[el] = [data[el]];
        }

        _.map(data[el], el1 => {
          // tslint:disable-next-line:radix
          obj.data.push([parseInt(el1['Date']), UtilsService.parseFloatFix(el1['PredictedInventory'])]);
          if (ORDER_PRODUCT_COLOR[el]) {
            obj['color'] = ORDER_PRODUCT_COLOR[el];
          }
        });
        sampleDataWeatherForecast.push(obj);
      });

      this.estimatedInventoryChart = {
        container: 'chart-weather-forecast',
        unit: '',
        data: sampleDataWeatherForecast,
        categories: [],
        currentTimePoint
      };
    });

    this.onChangeShowBy();
  }

  /*
    private _loadTerminalData() {
      this._terminalService.findTerminals().then((terminals: TerminalModel[]) => {
        this.terminal = terminals[0];
      });
    }
  */

  private _loadSummaryData(stationName: string) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(1); // first date of current month

    if (this.enableFunctionality && this.enableFunctionality['VarValue'] === 'true') {
      this._customerOrderService
        .getOrderSummary(stationName, UtilsService.getStartOfDayTime(startDate), UtilsService.getEndOfDayTime(today))
        .then((data: CustomerOrderSummaryModel[]) => {
          if (!!data && data.length > 0) {
            const orders = data[0].orders;
            this.summaryOfMonthChart = {
              data: Object.keys(orders).map((key, index) => {
                return {
                  name: ORDER_ITEM_TRANSLATE[key],
                  data: [
                    {
                      name: ORDER_ITEM_TRANSLATE[key],
                      y: +orders[key],
                      x: index
                    }
                  ],
                  color: ORDER_ITEM_COLOR[key],
                  borderColor: ORDER_ITEM_COLOR[key]
                };
              }),
              categories: Object.keys(orders).map(key => ORDER_ITEM_TRANSLATE[key])
            };
          } else {
            this.summaryOfMonthChart = {};
            this._snackBar.open('No summary data found', X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          }
        });
    }

  }

  private _loadProductSummaryData(stationId: string) {
    const startDate = new Date();
    startDate.setDate(1); // first date of current month

    const startNextOfMonth = new Date();
    startNextOfMonth.setMonth(startNextOfMonth.getMonth() + 1);
    startNextOfMonth.setDate(1);

    if (this.enableFunctionality && this.enableFunctionality['VarValue'] === 'true') {
      this._customerOrderService
        .getProductOrderSummary(
          stationId,
          UtilsService.getStartOfDayTime(startDate),
          UtilsService.getStartOfDayTime(startNextOfMonth)
        )
        .then((data: CustomerOrderSummaryModel[]) => {
          if (!!data && data.length > 0) {
            const productHash = data[0]['StationData'];
            this.productChart = {
              data: Object.keys(productHash).map((key, index) => {
                const item = productHash[key];
                return {
                  name: item['ProductCode'],
                  data: [
                    {
                      name: item['ProductCode'],
                      y: +item['ProductQuantity'],
                      x: index
                    }
                  ],
                  color: ORDER_PRODUCT_COLOR[key],
                  borderColor: ORDER_PRODUCT_COLOR[key]
                };
              }),
              categories: Object.keys(productHash).map(key => productHash[key]['ProductCode'])
            };
          } else {
            this.productChart = {};
            this._snackBar.open('No product summary data found', X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          }
        });
    }
  }

  private async _loadStationData() {
    let $promise;

    switch (this._authenService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
        $promise = this._StationDataService.stationAllObservable;
        break;
      default:
        $promise = this._StationDataService.stationAllByUsernameObservable;
    }

    this.addSubscribes(
      $promise.subscribe((stations: any[]) => {
        
        if (!stations || stations.length === 0) {
          setTimeout(() => {
            this.snackBar = this._snackBar.open('No Assigned Station, please contact admin!', X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          });
          return;
        }

        if (this.snackBar) {
          this.snackBar.dismiss();
        }
        this.stations = [...stations];
        this.selectedStation = this.stations[0];
        this._loadSummaryData(this.selectedStation.stationName);
        this._loadProductSummaryData(this.selectedStation.getId());

        this.expansionGroupByStation = {};
        this.upcomingOrdersByStation = {};
        // this.inventoryMeterByStation = {};

        const stationId = this.selectedStation.getId();
        this._fetchUpcomingOrdersByStationId(stationId);

        // this.productCodeByStation = {};

        // this._fetchStationInventoryChartById(stationId);
        this.loadChart();
      })
    );
  }

  private _fetchUpcomingOrdersByStationId(stationId): void {
    this._customerOrderService.getUpcomingOrdersByStationId(stationId)
      .then((orders: StationOrderModel[]) => {
        this.handleUpcomingOrderMapping(orders, stationId);
      });
  }

  /*private _fetchStationInventoryChartById(stationId: string) {
    if (!stationId || stationId === '') {
      this._snackBar.open('Station Id is missing', X_BUTTON, {
        duration: NOTIFICATION_DEFAULT_DURARION
      });
      return;
    }

    this._stationInventoryService
      .getStationInventoryProductProfile(stationId)
      .then((data: StationInventoryProductProfileModel[]) => {
        if (!data || data.length === 0) {
          return;
        }
        const products = data[0].products;
        if (!products) {
          this._snackBar.open('No Inventory Data Found', X_BUTTON, {
            duration: NOTIFICATION_DEFAULT_DURARION
          });
          return;
        }
        const groupedStations: string[] = UtilsService.groupBy(products, 'productCode');
        this.productCodeByStation[stationId] = Object.keys(groupedStations);
        this.inventoryMeterByStation[stationId] = {};
        this.productCodeByStation[stationId].forEach(productCode => {
          const gasName = this._convertProductCodeToDisplayName(productCode);
          const deadStock = UtilsService.getTotalValue(groupedStations[productCode], 'deadStock');
          const minThreshold = UtilsService.getTotalValue(groupedStations[productCode], 'minThreshold');
          const maxFillCapacity = UtilsService.getTotalValue(groupedStations[productCode], 'maxFillCapacity');
          const totalCapacity = UtilsService.getTotalValue(groupedStations[productCode], 'totalCapacity');
          const plotBandRange = [
            [0, deadStock],
            [deadStock, minThreshold],
            [minThreshold, maxFillCapacity],
            [maxFillCapacity, totalCapacity]
          ];
          this.inventoryMeterByStation[stationId][gasName] = {
            name: `chart_${productCode}`,
            title: gasName,
            unit: 'Litres',
            min: 0,
            max: totalCapacity,
            value: UtilsService.getTotalValue(groupedStations[productCode], 'totalQuantity'),
            valueName: 'Inventory',
            random: false,
            plotBandRange: plotBandRange,
            color: GET_COLOR_BY_PRODUCTCODE(productCode)
          };
        });

        if (!this.productCodeByStation || Object.keys(this.inventoryMeterByStation).length === 0) {
          this._snackBar.open('No Inventory Data Found', X_BUTTON, {
            duration: NOTIFICATION_DEFAULT_DURARION
          });
          return;
        }
      });
  }*/

  private handleUpcomingOrderMapping(orders: StationOrderModel[], stationId: string) {
    if (this.enableFunctionality && this.enableFunctionality['VarValue'] === 'true') {
      if (!!orders && orders.length > 0) {
        stationId = orders[0].stationId;
        this.upcomingOrdersByStation[stationId] = orders;
        this.expansionGroupByStation[stationId] = {};
        orders.forEach((order: StationOrderModel, index: number) => {
          this.expansionGroupByStation[stationId][order.getId()] = index === 0;
        });
      } else {
        this.upcomingOrdersByStation[stationId] = [];
        this.expansionGroupByStation[stationId] = {};
        this._snackBar.open('No Upcoming Order Found', X_BUTTON, {
          duration: NOTIFICATION_DEFAULT_DURARION
        });
      }
    }
    // console.log(this.upcomingOrdersByStation);
  }

  public async onChangeStation(newStation: any) {
    if (newStation && newStation.item) {
      this.loadStationById(newStation.item.getId());
    }
  }

  private async loadStationById(stationId: string) {
    const stations: any[] = await this._customerService.getStationsByStationId(stationId);

    const newStation = stations[0];
    this.selectedStation = newStation;

    this._loadSummaryData(newStation.stationName);
    this._loadProductSummaryData(stationId);

    this.expansionGroupByStation = {};
    this.upcomingOrdersByStation = {};
    // this.inventoryMeterByStation = {};

    this._fetchUpcomingOrdersByStationId(stationId);

    // this.productCodeByStation = {};

    // this._fetchStationInventoryChartById(stationId);

    this.loadChart();
  }

  loadCurrentOrders() {
    this.current_orders = _.cloneDeep(CURRENT_ORDERS, true);
    this.current_orders.forEach(el => {
      el['date'] = moment()
        .subtract(Math.round(Math.random() * 10) + 3, 'hours')
        .valueOf();
    });
  }

  loadNextOrder() {
    this.next_orders = _.cloneDeep(CURRENT_ORDERS, true);
    this.next_orders.forEach(el => {
      el['date'] = moment()
        .add(Math.round(Math.random() * 10) + 3, 'hours')
        .valueOf();
      el['status'] = null;
    });
  }

  loadAllOrder() {
    this.all_orders = [];
    this.all_orders = this.all_orders.concat(_.cloneDeep(this.current_orders));
    this.all_orders = this.all_orders.concat(_.cloneDeep(this.next_orders));
  }

  toggleOrderRow(orderId: string) {
    this.expansionGroupByStation[this.selectedStation.getId()][orderId] = !this.expansionGroupByStation[
      this.selectedStation.getId()
    ][orderId];
  }

  isExpandedRow(orderId: string): boolean {
    return this.expansionGroupByStation[this.selectedStation.getId()][orderId] === true;
  }

  /* loadChart() {
       Highcharts.chart('container', {
         chart: {
           type: 'bar'
         },
         title: {
           text: ''
         },
         xAxis: {
           categories: ['97', '95', 'D', 'E5'],
           gridLineColor: '#4a6170'
         },
         yAxis: {
           min: 0,
           gridLineColor: '#4a6170',
           gridLineWidth: 1,
           labels: {
             format: '{value} KL'
           }
         },
         legend: {
           reversed: true
         },
         plotOptions: {
           series: {
             stacking: 'normal',
             borderWidth: 0
           }
         },
         series: [{
           color: '#86cf52',
           name: 'Future Order',
           data: []
           // data: [20, 20, 30, 20]
         }, {
           color: '#2496c9',
           name: 'Current',
           data: []
           // data: [50, 30, 40, 70]
         }]
       });
     }*/

  /*  differentByHour(from, to) {
      return moment(to).diff(from, 'hours');
    }

    addHours(from, hour) {
      return moment(from)
        .add(hour, 'hours')
        .valueOf();
    }

    onColumDateChange() {
    }*/

  openOrderDetailDialog(order: StationOrderModel) {
    this.openingDialogRef = this._DialogService.open(
      OmOrderDetailsDialogComponent,
      {
        id: order.getId()
        // startDate: new Date(),
        // endDate: new Date(),
      },
      {
        width: '80vw',
        maxHeight: '80vh',
        panelClass: 'order-detail-dialog-panel'
      }
    );
  }

  onRequestCancellation(order) {
    this._DialogService.open(
      OmPrepareCancellationDialogComponent,
      {
        order: order
      },
      {},
      () => {
        this._customerOrderService.getUpcomingOrdersByStationId(this.selectedStation.getId()).then(orders => {
          this.handleUpcomingOrderMapping(orders, order.stationId);
        });
        this._loadSummaryData(this.selectedStation.stationName);
        this._loadProductSummaryData(this.selectedStation.getId());
      }
    );
  }

  openAddDialog(): void {
    if (!this.selectedStation || !this.selectedStation.stationTanks || this.selectedStation.stationTanks.length === 0) {
      return;
    }
    this.openingDialogRef = this.dialog.open(UpdateInventoryDialogComponent, {
      width: '800px',
      data: {
        station: this.selectedStation
      }
    });
    this.addSubscribes(
      this.openingDialogRef.afterClosed().subscribe(data => {
        if (!!data) {
          const { tanks, comment } = data;
          if (!!tanks && !!comment) {
            this._stationInventoryService
              .updateTankInventory(this.selectedStation.getId(), tanks, comment, this._authenService.getUsername())
              .then(result => {
                if (!!result && !!result[1]) {
                  this._snackBar.open(result[1]['Station']['Message'], X_BUTTON, {
                    duration: NOTIFICATION_DEFAULT_DURARION
                  });
                }

                this.loadStationById(this.selectedStation.getId());
              });
          }
        }
      })
    );
  }

  /*updateTankVolume(tanks: IStationTankModel[]) {
    this.selectedStation.stationTanks.forEach(tank => {
      tank.currentVolume = tanks.find(t => t.sysId === tank.sysId).currentVolume;
    });
  }*/

  // openMapDialog(order): void {
  // }


  getProductItemWidth(productItems: IHashObject<string>) {
    return `${100 / 4}%`;
  }

  getProductCodeClass(productCode: string) {
    return productCode.toLowerCase();
  }

  isEmpty(): boolean {
    return !(
      !!this.upcomingOrdersByStation &&
      !!this.selectedStation &&
      !!this.upcomingOrdersByStation[this.selectedStation.getId()] &&
      this.upcomingOrdersByStation[this.selectedStation.getId()].length > 0
    );
  }

  /*private _convertProductCodeToDisplayName(productCode: string) {
    switch (productCode) {
      default:
        return productCode;
    }
  }*/

  onEstimatedInventoryHint() {
    this._DialogService.open(EstimatedInventoryHintDialogComponent);
  }

  onRefresh() {
    this.upcomingOrdersByStation = {};
    this._fetchUpcomingOrdersByStationId(this.selectedStation.getId());
  }

  onRequestMessage(order) {
    console.log(order);
    this._DialogService.open(
      OmOrderRemarkDialogComponent,
      {
        message: order.remark,
        datetime: order.lastUpdated,
        userName: order.userName
      },
      {}
    );
  }

  onChangeShowBy($event: MatSlideToggleChange = null) {
    if ($event) {
      this.showByProductCode = $event.checked;
    }
    this._StationDataService.findCurrentInventoryByStationIds([this.selectedStation.getId()])
      .then((rs) => {
        this.inventoryData = rs;
      });
  }
}
