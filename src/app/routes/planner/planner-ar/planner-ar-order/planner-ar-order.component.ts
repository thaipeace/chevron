import { Component, OnInit, ViewChild } from '@angular/core';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { OrderDataService } from '@app/shared/services/data/order-data.service';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { MatSort, MatTable, MatTableDataSource, MatPaginator } from '@angular/material';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { OmOrderExportDialogComponent } from '@app/management/order-management/om-order-export-dialog/om-order-export-dialog.component';
import { AuthenticationService } from '@app/user-management/shared/services';
import { TankDataService } from '@app/shared/services/data/tank-data.service';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';
import { ApproveARDataDialogComponent } from './approve-ar-data-dialog/approve-ar-data-dialog.component';
import { OmOrderOptimizeDialogComponent } from '@management/order-management/om-order-optimize-dialog/om-order-optimize-dialog.component';
import { UploadSapFileDialogComponent } from '@shared/components/dialogs/upload-sap-file-dialog/upload-sap-file-dialog.component';
import {
  TABLE_COLUMN_HEAD,
  TABLE_COLUMN_GROUP,
  TABLE_COLUMN_GROUP_DATA,
  FUEL_TYPES,
  TABLE_COLUMN_GROUP_DATA_NONE,
  TABLE_COLUMN_GROUP_DATA_DROPDOWN, ORDER_STATUS
} from '@shared/constants/value.constant.ts';
import { OmInventoryExportDialogComponent } from '@app/management/order-management/om-inventory-export-dialog/om-inventory-export-dialog.component';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { SortArrayPipe } from '@app/shared/pipe/sort-array.pipe';

@Component({
  selector: 'app-planner-ar-order',
  templateUrl: './planner-ar-order.component.html',
  styleUrls: ['./planner-ar-order.component.scss']
})
export class PlannerArOrderComponent extends DefaultComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) tableData: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  productCode = {
    ron97: 'Euro4-97',
    ron95: 'Premium-95',
    ronDiesel: 'B10-Diesel',
    ronE5: 'Euro5-B7'
  };
  status: string[] = [ORDER_STATUS.LOADING, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.UNLOADING, ORDER_STATUS.DELIVERED];
  displayedColumns: string[] = [
    'stationName',
    'catEmpty',
    'catEmptySub',
    'subIMEEuro497',
    'subIMEPremium95',
    'subIMEB10Diesel',
    'subIMEEuro5B7',
    'subIMERemarks',
    'inventoryVarianceEntrySubEmpty',
    'stockEuro497',
    'varEuro497',
    'stockPremium95',
    'varPremium95',
    'stockB10Diesel',
    'varB10Diesel',
    'stockEuro5B7',
    'varEuro5B7',
    'IVCMEmptySub',
    'blockUGTDSEuro497',
    'blockUGTDSPremium95',
    'blockUGTDSB10Diesel',
    'blockUGTDSEuro5B7',
    'UGTDSEmptySub',
    'blockUGTUSEuro497',
    'blockUGTUSPremium95',
    'blockUGTUSB10Diesel',
    'blockUGTUSEuro5B7',
    'UGTUSEmptySub',
    'blockDSPOrderNumber',
    'blockDSPEuro497',
    'blockDSPPremium95',
    'blockDSPB10Diesel',
    'blockDSPEuro5B7',
    'blockTotalQuantity',
    'blockETA',
    'blockDSPRemarks',
    'deliverySchedulePlanningSubEmpty',
    'Balance',
    'Approve'
  ];
  searchedColumn: string[] = [
    'stationName',
    'stationId',
    'stationType',
    'actualInventories',
    'varianceInventories',
    'dayStocks',
    'ullageData',
    'remainingQuota',
    'monthlyQuota',
    'orderDetails'
  ];
  tableHeadColumn;
  tableHeadGroup = [];
  tableHeadGroupSelect;
  displayIHeadGroup;
  displaySubHeadGroup;
  tableHeadGroupData;
  tableHeadGroupF;
  fuelTypes: any[];
  fuelTypesSelected;
  selectedDate: Date;
  generalData: any[] = [];
  stationDetails: any[] = [];
  actualInventories: any[] = [];
  varianceInventories: any[] = [];
  orderDetails: any[] = [];
  dayStocks: any[] = [];
  ullageData: any[] = [];
  quotaAllocations: any[] = [];
  selectedRow: number;
  tanks: TankModel[] = [];
  stations: any[] = [];
  selectedStations: string[] = [];
  displayStations: string[] = [];

  dateTime: string;
  zoomLevel = 4;
  selectedIndex = -1;
  tableGroupCol = 4;
  b10Diesel = true;
  varianceNotificationLimit: number = 0;
  today: Date = new Date();
  tomorrow: Date = new Date();
  isTomorrow: boolean = false;
  isDayLast: string = '2';
  isARDataLoading: boolean = false;
  filterValue = '';
  orderNum: number = 0;

  dayStockLast: string = '';
  isLoading = false;
  errorMsg: string = '';

  selectedOrder: any;

  isDataChange: boolean = false;

  updateOrders: any[] = [];

  temporaryValue: any;

  hasSwitched: false;

  ordesrForApproval: any[] = [];

  subscription: Subscription;

  userRoleName: string = '';

  verifyDayStockLastFromARResult: any;

  searchControl: FormControl = new FormControl('');
  inputSearch: string = '';

  isCanceling: boolean = false;
  isOnUpdate: boolean = false;
  clearSearch: any = null;
  sortArrayPippe = new SortArrayPipe();

  constructor(
    private _stationDataService: StationDataService,
    private _orderDataService: OrderDataService,
    private _DialogService: DialogService,
    private _authenticationService: AuthenticationService,
    private _tankDataService: TankDataService,
    private dataUtilService: DataUtilService
  ) {
    super();
    this.addSubscribes(
      this._tankDataService.tankAllObservable.subscribe(rs => {
        this.tanks = rs;
      }),
      this._stationDataService.stationAllObservable.subscribe(stations => {
        this.stations = stations;
        if (this.stations && this.stations.length) {
          this.selectedStations = this.stations.map(r => r.getValue('sysId'));
        }
        this.resetDisplayStations();
      })
    );
    this._tankDataService.findAll();
    this._stationDataService.findAll();

    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm, this.displayStations);
    });
  }

  ngOnInit() {
    this.fuelTypes = FUEL_TYPES;
    this.fuelTypesSelected = FUEL_TYPES;
    this.tableHeadColumn = TABLE_COLUMN_HEAD;
    this.tableHeadGroup = TABLE_COLUMN_GROUP;
    this.tableHeadGroupSelect = TABLE_COLUMN_GROUP_DATA;
    this.tableHeadGroupData = TABLE_COLUMN_GROUP_DATA_DROPDOWN;

    this.displayIHeadGroup = this.tableHeadGroup.reduce(
      (arr, head) => _.concat(_.flatten(arr), _.flatten(this.tableHeadColumn[head])),
      []
    );
    this.displaySubHeadGroup = this.tableHeadGroup.reduce(
      (arr, head) => _.concat(_.flatten(arr), _.flatten(this.tableHeadColumn[`${head}Sub`])),
      []
    );

    this.today.setHours(0, 0, 0, 0);
    this.tomorrow.setHours(0, 0, 0, 0);
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);
    this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
    this.findAllARData();
    combineLatest(this._authenticationService.loginedUserObservable).subscribe(([user]) => {
      if (user) {
        this.userRoleName = user.roleName;
      }
    });
  }

  changeDisplayHeadColumnGroup(columns) {
    this.tableHeadGroupSelect = columns;
    this.tableHeadGroup = _.concat(['dayStock'], _.flatten(columns));
    this.changeDisplayFuelTypes(this.fuelTypesSelected);
  }

  changeDisplayFuelTypes(fuels: any[]) {
    this.tableHeadGroupF = this.tableHeadGroup;
    this.fuelTypesSelected = fuels;
    const removeList = this.fuelTypes.filter(fuel => !fuels.includes(fuel)).map(fuel => _.replace(fuel, '-', ''));
    this.b10Diesel = true;

    if (!fuels.length) {
      this.tableHeadGroupF = this.tableHeadGroup.filter(item => !TABLE_COLUMN_GROUP_DATA_NONE.includes(item) || item === 'quotaAllocations');
    }

    this.displayIHeadGroup = this.tableHeadGroupF
      .reduce((arr, head) => _.concat(_.flatten(arr), _.flatten(this.tableHeadColumn[head])), [])
      .filter(item => item === 'QAB10Diesel' || !removeList.reduce((result, current) => _.includes(item, current) || result, false));

    this.displaySubHeadGroup = this.tableHeadGroupF
      .reduce((arr, head) => _.concat(_.flatten(arr), _.flatten(this.tableHeadColumn[`${head}Sub`])), [])
      .filter(item => !removeList.reduce((result, current) => _.includes(item, current) || result, false));

    this.displayedColumns = this.displaySubHeadGroup;
    this.tableGroupCol = fuels.length;
  }

  resetDisplayStations() {
    this.displayStations = this.selectedStations;
    this.inputSearch = '';
    this.searchControl.setValue('');
    if (this.clearSearch) {
      this.clearSearch();
    }
  }

  onScheduleChange(i) {
    this.isDayLast = i.value;
  }

  async findAllARData() {
    this.resetDisplayStations();
    this.resetOrderNum();
    this.updateOrders = [];
    this.isARDataLoading = true;
    this.generalData = [];
    this.tableData = new MatTableDataSource([]);
    this._stationDataService.findVarianceNotificationLimitData().then(rs => {
      this.varianceNotificationLimit = rs['StaticData'] ? parseInt(rs['StaticData']['Value']) : 0;
    });

    try {
      this._stationDataService.findARStationDatabyDate(this.dateTime).then(el => {
        if (!el['data']['ARData']) {
          return;
        }
        let calculatedData = [];
        el['data']['ARData'].map((station, index) => {

          let tempProducts = this.tanks.filter(x => x.stationId == station.StationDetails.StationId);

          if (station.OrdersList && station.OrdersList.OrdersDetail) {
            station.OrdersList.OrdersDetail = this.dataUtilService.wrapObjToOneElementArray(station.OrdersList.OrdersDetail);
            station.OrdersList.OrdersDetail.forEach(OrdersDetail => {
              if (OrdersDetail.Order.orderStatus === 'Canceled') return;

              let products = {};
              let remark = '';
              let estimatedTime: any = '';
              let totalQuantity = '';
              let fixedEstimatedTime: any = '';

              if (OrdersDetail && OrdersDetail.OrderItem) {
                if (OrdersDetail.OrderItem.length) {
                  products = OrdersDetail.OrderItem.reduce((obj, prev) => {
                    obj[prev.productCode] = prev.quantity;
                    return obj;
                  }, {});
                } else {
                  products[OrdersDetail.OrderItem.productCode] = OrdersDetail.OrderItem.quantity;
                }
              }

              if (index === 2) console.log(products);

              if (OrdersDetail && OrdersDetail.Order) {
                remark = OrdersDetail.Order.remark;
                estimatedTime =
                  OrdersDetail.Order.estimatedTime != ''
                    ? new Date(parseInt(OrdersDetail.Order.estimatedTime))
                    : '';
                totalQuantity = OrdersDetail.Order.totalQuantity;
                fixedEstimatedTime =
                  OrdersDetail.Order.estimatedTime != ''
                    ? new Date(parseInt(OrdersDetail.Order.estimatedTime))
                    : '';
              }

              let rfEdit = new FormGroup({
                'Euro4-97': new FormControl(''),
                'Premium-95': new FormControl(''),
                'B10-Diesel': new FormControl(''),
                'Euro5-B7': new FormControl('')
              });

              products = {
                'Euro4-97': products[this.productCode.ron97] || '',
                'Premium-95': products[this.productCode.ron95] || '',
                'B10-Diesel': products[this.productCode.ronDiesel] || '',
                'Euro5-B7': products[this.productCode.ronE5] || ''
              };

              rfEdit.setValue(products);

              if (OrdersDetail.Order) {
                this.orderNum++;
              }
              calculatedData.push({
                index: index,
                stationId: station.StationDetails.StationId,
                stationName: station.StationDetails.StationName,
                stationType: station.StationDetails.StationType,
                remainingQuota: station.QuotaAllocation.RemainingQuota,
                monthlyQuota: station.QuotaAllocation.MonthlyQuota,
                actualInventories: station.ActualInventory,
                varianceInventories: station.PredictedInventory,
                ullageData: station.Ullage,
                dayStocks: station.DayStock,
                orderStatus: OrdersDetail.Order ? OrdersDetail.Order.orderStatus : '',
                orderDetails: {
                  orderStatus: OrdersDetail.Order ? OrdersDetail.Order.orderStatus : '',
                  orderId: OrdersDetail.Order ? OrdersDetail.Order.sysid : '',
                  products: rfEdit,
                  totalQuantity: totalQuantity,
                  stationId: station.StationDetails.StationId,
                  fixedProducts: Object.assign({}, products),
                  estimatedTime: estimatedTime || '',
                  fixedEstimatedTime: fixedEstimatedTime || '',
                  remark: remark || '',
                  fixedRemark: remark || '',
                  error: '',
                  'Euro4-97': false,
                  'Premium-95': false,
                  'B10-Diesel': false,
                  'Euro5-B7': false,
                  isEstimatedTimeEdited: false,
                  isRemarkEdited: false,
                  ron97: tempProducts.findIndex(x => x.productCode == this.productCode.ron97) > -1,
                  ron95: tempProducts.findIndex(x => x.productCode == this.productCode.ron95) > -1,
                  ron10: tempProducts.findIndex(x => x.productCode == this.productCode.ronDiesel) > -1,
                  ronB7: tempProducts.findIndex(x => x.productCode == this.productCode.ronE5) > -1
                }
              });
            });
          } else {
            calculatedData.push({
              index: index,
              stationId: station.StationDetails.StationId,
              stationName: station.StationDetails.StationName,
              stationType: station.StationDetails.StationType,
              remainingQuota: station.QuotaAllocation.RemainingQuota,
              monthlyQuota: station.QuotaAllocation.MonthlyQuota,
              actualInventories: station.ActualInventory,
              varianceInventories: station.PredictedInventory,
              ullageData: station.Ullage,
              dayStocks: station.DayStock,
              orderStatus: '',
              orderDetails: {
                orderStatus: '',
                orderId: '',
                products: new FormGroup({
                  'Euro4-97': new FormControl(''),
                  'Premium-95': new FormControl(''),
                  'B10-Diesel': new FormControl(''),
                  'Euro5-B7': new FormControl('')
                }),
                totalQuantity: '',
                stationId: station.StationDetails.StationId,
                fixedProducts: { 'Euro4-97': '', 'Premium-95': '', 'B10-Diesel': '', 'Euro5-B7': '' },
                estimatedTime: '',
                fixedEstimatedTime: '',
                remark: '',
                fixedRemark: '',
                error: '',
                'Euro4-97': false,
                'Premium-95': false,
                'B10-Diesel': false,
                'Euro5-B7': false,
                isEstimatedTimeEdited: false,
                isRemarkEdited: false,
                ron97: tempProducts.findIndex(x => x.productCode == this.productCode.ron97) > -1,
                ron95: tempProducts.findIndex(x => x.productCode == this.productCode.ron95) > -1,
                ron10: tempProducts.findIndex(x => x.productCode == this.productCode.ronDiesel) > -1,
                ronB7: tempProducts.findIndex(x => x.productCode == this.productCode.ronE5) > -1
              }
            });
          }
        });

        this.fixSameOrdersInStation(calculatedData);

        this.generalData = calculatedData;
        this.tableData = new MatTableDataSource(this.generalData);
        this.tableData.sort = this.sort;
        this.tableData.paginator = this.paginator;
        this.mappingData();
      }).finally(() => {
        this.isARDataLoading = false;
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  fixSameOrdersInStation(calculatedData) {
    // this.sortArrayPippe.transform(calculatedData, 'stationName');
    let rowNo = 0;
    let orderNumber = 1;
    calculatedData.forEach((data, i) => {
      data.rowClasses = [];
      if (i !== 0 && calculatedData[i - 1].stationId !== data.stationId) {
        calculatedData[i - 1].rowClasses.push('at-bottom');
        data.rowClasses.push('at-first');
        rowNo++;
        orderNumber = 1;
      } else if (i === 0) {
        data.rowClasses.push('at-first');
      } else {
        orderNumber++;
      }

      if (i === calculatedData.length - 1) {
        data.rowClasses.push('at-bottom');
      }

      if (data.orderDetails.orderStatus) {
        data.rowClasses.push('hasOrder');
      }

      data.orderNumber = orderNumber;
      data.rowNo = rowNo;
    });

    calculatedData.forEach((data) => {
      data.rowClasses.push(data.rowNo % 2 === 0 ? ' row-odd' : ' row-even');
      data.rowClasses = data.rowClasses.join(' ');
    });
  }

  onTimeChange($event) {
    if (this.selectedDate.valueOf() - this.tomorrow.valueOf() == 0) {
      this.isTomorrow = true;
    } else {
      this.isTomorrow = false;
    }
    this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
    this.findAllARData();
    this.cancelUpdate();
    this.resetDisplayStations();
  }

  resetOrderNum() {
    this.orderNum = 0;
  }

  public clearOrders() { }

  public generateOrders() { }

  public zoomIn() {
    if (this.zoomLevel < 10) {
      this.zoomLevel++;
    }
  }

  public zoomOut() {
    if (this.zoomLevel > 2) {
      this.zoomLevel--;
    }
  }

  public toggle(event: any) {
    if (event.checked) {
      this.isTomorrow = true;
      this.selectedDate = new Date(this.selectedDate.setDate(this.today.getDate() + 1).valueOf());
      this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
      this.today = new Date();
      this.today.setHours(0, 0, 0, 0);
      this.findAllARData();
      this.cancelUpdate();
      this.resetDisplayStations();
      this.resetOrderNum();
      return;
    }
    this.isTomorrow = false;
    this.selectedDate = new Date(this.today.valueOf());
    this.selectedDate.setHours(0, 0, 0, 0);
    this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.findAllARData();
    this.cancelUpdate();
    this.resetDisplayStations();
    this.resetOrderNum();
  }

  focusOut(item, productCode) {
    if (item.products.get(productCode).value == 0 || !item.products.get(productCode).value) {
      item.products.controls[productCode].setValue(item.fixedProducts[productCode]);
    }
    this.onDataTracking();
  }

  onEdit(index, item, productCode) {
    this.isCanceling = false;

    if (item.products.get(productCode).valueChanges['observers'].length) {
      return;
    }

    item.products
      .get(productCode)
      .valueChanges.pipe(
        tap(data => {
          this.hasSwitched = false;
          this.errorMsg = '';
          this.dayStockLast = '';
          this.isLoading = true;
          this.generalData[index].orderDetails[productCode] =
            this.generalData[index].orderDetails.products.get(productCode).value !=
            this.generalData[index].orderDetails.fixedProducts[productCode];
          this.generalData[index].orderDetails.error = '';
        }),
        debounceTime(1000),
        switchMap(value =>
          this._stationDataService
            .verifyDayStockLastFromAR(
              item.orderId,
              item.stationId,
              productCode,
              moment(this.selectedDate).format('MM/DD/YYYY'),
              item.products.get(productCode).value,
              this.isCanceling
            )
            .finally(() => {
              this.isLoading = false;
            })
        )
      )
      .subscribe(rs => {
        if (!rs || !rs['data'] || !rs['data']['Response']) {
          return;
        }
        if (rs['data']['Response']['Status'] == 'No data') {
          this.dayStockLast = 'Please input the quantity';
          return;
        }
        if (rs['data']['Response']['Status'] == 'Failure') {
          this.dayStockLast = 'Oops! Lacking data for calculating process!';
          return;
        }
        if (rs['data']['Response']['Status'] == 'Success' && !this.hasSwitched) {
          this.errorMsg = '';
          this.dayStockLast = `Day stock last value: ${rs['data']['Response']['Message']['DayStockLast']}`;
        }
      });
  }

  updateEstimatedTime(index) {
    this.generalData[index].orderDetails['isEstimatedTimeEdited'] =
      this.generalData[index].orderDetails.estimatedTime != this.generalData[index].orderDetails.fixedEstimatedTime;
    this.generalData[index].orderDetails.error = '';
  }

  onDataTracking() {
    this.isDataChange =
      this.generalData.findIndex(
        element =>
          element.orderDetails[this.productCode.ron97] ||
          element.orderDetails[this.productCode.ron95] ||
          element.orderDetails[this.productCode.ronDiesel] ||
          element.orderDetails[this.productCode.ronE5]
      ) > -1;
  }

  onUpdate() {
    let hasError = 0;
    this.isOnUpdate = true;
    this.generalData.forEach(element => {
      element.orderDetails.error = '';
      if (
        !element.orderDetails['ron97'] &&
        !element.orderDetails['ron95'] &&
        !element.orderDetails['ron10'] &&
        !element.orderDetails['ronB7']
      ) {
        return;
      }

      if (element.orderDetails['isEstimatedTimeEdited']) {
        if (
          !element.orderDetails[this.productCode.ron97] &&
          !element.orderDetails[this.productCode.ron95] &&
          !element.orderDetails[this.productCode.ronDiesel] &&
          !element.orderDetails[this.productCode.ronE5]
        ) {
          element.orderDetails.error = '* Product quantity is required';
          hasError += 1;
        }
      }

      if (element.orderDetails[this.productCode.ron97]) {
        this.updateOrders.push({
          stationId: element.orderDetails.stationId,
          orderId: element.orderDetails.orderId,
          estimatedTime: element.orderDetails.estimatedTime.valueOf(),
          remark: element.orderDetails.remark,
          productCode: this.productCode.ron97,
          revisedQuantity: element.orderDetails.products.get(this.productCode.ron97).value
        });
      }
      if (element.orderDetails[this.productCode.ron95]) {
        this.updateOrders.push({
          stationId: element.orderDetails.stationId,
          orderId: element.orderDetails.orderId,
          productCode: this.productCode.ron95,
          estimatedTime: element.orderDetails.estimatedTime.valueOf(),
          remark: element.orderDetails.remark,
          revisedQuantity: element.orderDetails.products.get(this.productCode.ron95).value
        });
      }
      if (element.orderDetails[this.productCode.ronDiesel]) {
        this.updateOrders.push({
          stationId: element.orderDetails.stationId,
          orderId: element.orderDetails.orderId,
          estimatedTime: element.orderDetails.estimatedTime.valueOf(),
          remark: element.orderDetails.remark,
          productCode: this.productCode.ronDiesel,
          revisedQuantity: element.orderDetails.products.get(this.productCode.ronDiesel).value
        });
      }
      if (element.orderDetails[this.productCode.ronE5]) {
        this.updateOrders.push({
          stationId: element.orderDetails.stationId,
          orderId: element.orderDetails.orderId,
          estimatedTime: element.orderDetails.estimatedTime.valueOf(),
          remark: element.orderDetails.remark,
          productCode: this.productCode.ronE5,
          revisedQuantity: element.orderDetails.products.get(this.productCode.ronE5).value
        });
      }
    });

    if (hasError) {
      return;
    }

    this.generalData = [];
    this._orderDataService
      .reviseOrderQuantityFromAR(this.updateOrders)
      .then(rs => {
        if (!rs || !rs['data'] || !rs['data']['Response']) {
          return;
        }
        if (rs['data']['Response']['Status'] == 'Success') {
          this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
          this.findAllARData();
          this.updateOrders = [];
          this.tableData = new MatTableDataSource(this.generalData);
          this.tableData.sort = this.sort;
          this.sort.disableClear = true;
        }
      })
      .finally(() => {
        this.isOnUpdate = false;
        this.updateOrders = [];
        this.isDataChange = false;
        this.tableData = new MatTableDataSource(this.generalData);
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
        this.resetDisplayStations();
      });
  }

  onOpenApproveDialog() {
    let orderDialog = this._DialogService.open(ApproveARDataDialogComponent);

    orderDialog.afterClosed().subscribe(res => {
      if (res === 'Submit') {
        this.approveOrder();
      }
    });
  }

  approveOrder() {
    this.isOnUpdate = true;
    this.ordesrForApproval = this.generalData
      .filter(x => x['orderDetails'].orderId)
      .map(x => x['orderDetails'].orderId);
    if (!this.ordesrForApproval.length) {
      return;
    }
    this._orderDataService
      .approveOrder(this.ordesrForApproval)
      .then(rs => {
        if (!rs || !rs['data'] || !rs['data']['Response']) {
          return;
        }
        if (rs['data']['Response']['Status'] == 'Success') {
          this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
          this.findAllARData();
        }
      })
      .finally(() => {
        this.isOnUpdate = false;
        this.isDataChange = false;
        this.resetDisplayStations();
      });
  }

  cancelUpdate() {
    this.generalData.map(el => {
      el['orderDetails'].products.controls[this.productCode.ron97].setValue(
        el['orderDetails'].fixedProducts[this.productCode.ron97]
      );
      el['orderDetails'].products.controls[this.productCode.ron95].setValue(
        el['orderDetails'].fixedProducts[this.productCode.ron95]
      );
      el['orderDetails'].products.controls[this.productCode.ronDiesel].setValue(
        el['orderDetails'].fixedProducts[this.productCode.ronDiesel]
      );
      el['orderDetails'].products.controls[this.productCode.ronE5].setValue(
        el['orderDetails'].fixedProducts[this.productCode.ronE5]
      );
      el['orderDetails'].estimatedTime = el['orderDetails'].fixedEstimatedTime;
      el['orderDetails'].remark = el['orderDetails'].fixedRemark;
      el['orderDetails'].error = '';
    });
    this.updateOrders = [];
    this.isDataChange = false;
  }

  selectRow(row) {
    this.selectedRow = row.index;
  }

  onExportOrders() {
    this._DialogService.open(OmOrderExportDialogComponent, {}, { disableClose: true });
  }

  onExportInventory() {
    this._DialogService.open(OmInventoryExportDialogComponent, {}, { disableClose: true });
  }

  uploadSAPFile() {
    let dialogRef = this._DialogService.open(UploadSapFileDialogComponent, {});

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'Uploaded') {
        this.findAllARData();
        this.resetDisplayStations();
      }
    });
  }

  applyFilter(searchValue: string, selectedIds: string[] = []) {
    this.tableData.filter = `${searchValue}$$${selectedIds.join('|')}`;
    this.tableData.sort = this.sort;
  }

  onStationSelectionChange(selectedStationIds) {
    this.displayStations = selectedStationIds;
    this.applyFilter(this.inputSearch, selectedStationIds);
  }

  mappingData() {
    this.tableData.filterPredicate = (data: any, filter: string): boolean => {
      const [searchValue = '', searchStations = ''] = filter.split('$$');
      const selectedStations = searchStations.split('|');
      const searchTerm = searchValue.toLowerCase();

      const doSearch = (data, searchTerm, searchedColumn): boolean => {
        for (let index = 0; index < searchedColumn.length; index++) {
          const key = searchedColumn[index];
          const value = data[key];

          if (
            ['actualInventories', 'varianceInventories', 'ullageData', 'dayStocks', 'orderDetails'].indexOf(key) !== -1
          ) {
            let items = [
              data[key][this.productCode.ron97],
              data[key][this.productCode.ron95],
              data[key][this.productCode.ronDiesel],
              data[key][this.productCode.ronE5]
            ];
            let count = 0;
            items.forEach(el => {
              if (el && el.TotalQuantity && el.TotalQuantity.toLowerCase().indexOf(searchTerm) !== -1) {
                count++;
              }
              if (el && el.Variance && el.Variance.toLowerCase().indexOf(searchTerm) !== -1) {
                count++;
              }
              if (el && el.TotalUllage && el.TotalUllage.toLowerCase().indexOf(searchTerm) !== -1) {
                count++;
              }
              if (this.isDayLast == '2' && el && el.DayLast && el.DayLast.toLowerCase().indexOf(searchTerm) !== -1) {
                count++;
              }
              if (
                this.isDayLast == '1' &&
                el &&
                el.DayLastWithOrder &&
                el.DayLastWithOrder.toLowerCase().indexOf(searchTerm) !== -1
              ) {
                count++;
              }
            });

            if (count) {
              return true;
            }
          }

          if (['orderDetails'].indexOf(key) !== -1) {
            let products = data[key]['products'];
            let items = [
              products.get(this.productCode.ron97).value,
              products.get(this.productCode.ron95).value,
              products.get(this.productCode.ronDiesel).value,
              products.get(this.productCode.ronE5).value
            ];
            let count = 0;
            items.forEach(el => {
              if (el && el.toLowerCase().indexOf(searchTerm) !== -1) {
                count++;
              }
            });

            if (
              data[key] &&
              data[key].estimatedTime &&
              moment(data[key].estimatedTime, 'YYY-MM-DD (hh:mm)')
                .format()
                .toLowerCase()
                .indexOf(searchTerm) !== -1
            ) {
              count++;
            }

            if (
              data[key] &&
              data[key].totalQuantity &&
              data[key].totalQuantity.toLowerCase().indexOf(searchTerm) !== -1
            ) {
              count++;
            }

            if (data[key] && data[key].remark && data[key].remark.toLowerCase().indexOf(searchTerm) !== -1) {
              count++;
            }

            if (count) {
              return true;
            }
          }

          if (['stationName', 'stationId', 'stationType', 'remainingQuota', 'monthlyQuota'].indexOf(key) !== -1) {
            if (value && value.toLowerCase().indexOf(searchTerm) !== -1) {
              return true;
            }
          }
        }
        return false;
      };

      if (selectedStations.length > 0 && selectedStations[0].length) {
        if (selectedStations.indexOf(data['stationId']) !== -1) {
          return doSearch(data, searchTerm, this.searchedColumn);
        }
      } else {
        return false;
      }
      return false;
    };

    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.sort.disableClear = true;
  }

  onOptimizeOrder() {
    this._DialogService.open(OmOrderOptimizeDialogComponent, {}, { disableClose: true });
  }
}
