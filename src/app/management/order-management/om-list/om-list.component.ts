import {
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {IHashObject} from '@app/shared/models/interfaces/generic-types.interface';
import {MatSnackBar} from '@angular/material';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION,
  ORDER_STATUS
} from '@app/shared/constants/value.constant';
import {UtilsService} from '@app/shared/services/utils.service';
import {StaticDataService} from '@shared/services/data/static-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {debounceTime, tap} from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import {combineLatest, forkJoin} from 'rxjs';
import {OrderDataService} from '@shared/services/data/order-data.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {OmNewComponent} from '@management/order-management/om-new/om-new.component';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {OmOrderDetailsDialogComponent} from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';
import {CustomerStationModel} from '@app/shared/models/data.models/customer/customer-station.model';
import {AuthenticationService} from '@app/user-management/shared/services';
import {OmOrderRemarkDialogComponent} from '@management/order-management/om-order-remark-dialog/om-order-remark-dialog.component';
import {TruckDataService} from '@app/shared/services/data/truck-data.service';
import {UploadSapFileDialogComponent} from '@shared/components/dialogs/upload-sap-file-dialog/upload-sap-file-dialog.component';
import { ImportManualCiOrdersDialogComponent } from '@app/shared/components/dialogs/import-manual-ci-orders-dialog/import-manual-ci-orders-dialog.component';

const PAGING = {
  CURRENT_PAGE: 0,
  LIMIT: 5,
};

@Component({
  selector: 'app-om-list',
  templateUrl: './om-list.component.html',
  styleUrls: ['./om-list.component.scss']
})
export class OmListComponent implements OnInit, OnChanges {
  @Input() stations: OrderModel[];
  @Input() selectable: boolean = false;
  @Input() startDate: any;
  @Input() endDate: any;
  @Output() selectOrderCallback: EventEmitter<any> = new EventEmitter<any>();
  historyFilterDate: Date[];
  orderStationControl = new FormControl();
  selectedStation: CustomerStationModel;
  dicStationName: IHashObject<string>;
  historicalOrdersByStation: IHashObject<any>;
  expansionGroupByStation: IHashObject<IHashObject<boolean>>;

  productItems: IHashObject<string> = {};
  orderStatusList: string[];
  searchControl = new FormControl('');
  selectedStationIds: string[];
  selectedStatuses: string[];
  displayStations: OrderModel[] = [];
  userRoleName: string = '';
  sourceTypes: string[] = ['Customer', 'System'];
  selectedSourceTypes: string[] = ['Customer', 'System'];
  truckSchedules: any[] = [];

  stationPagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  paginationTimeout;

  displayedStationIds: string[] = [];
  currentStationIds: string[] = [];
  DELIVERED_STATUS = OrderModel.STATUSES.DELIVERED;
  isOnRefresing = false;
  DEFAULT_DATE_RANGE_IN_DAYS: number = 30;
  ORDER_STATUS = ORDER_STATUS;
  selectedOrders: OrderModel[];
  OrderModel = [];

  constructor(
    private _snackBar: MatSnackBar,
    private _staticDataService: StaticDataService,
    private _DialogService: DialogService,
    private _OrderDataService: OrderDataService,
    private _authenticationService: AuthenticationService,
    private _truckDataService: TruckDataService
  ) {
    //default 2 months, last 30 days & next 30 days
    this.historyFilterDate = [moment(new Date()).subtract(this.DEFAULT_DATE_RANGE_IN_DAYS, 'day').toDate(),
      moment(new Date()).toDate()];
  }

  ngOnInit() {
    this.orderStatusList = UtilsService.getObjValues(ORDER_STATUS) as string[];
    this.selectedStatuses = [...this.orderStatusList];

    combineLatest(
      this._authenticationService.loginedUserObservable,
    ).subscribe(([user]) => {
      if (user) {
        this.userRoleName = user.roleName;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const self = this;
    const {startDate, endDate} = changes;
    const array: string[] = [];
    this.dicStationName = {};
    this.stations = _.orderBy(this.stations, el => {
      return el.stationName;
    });
    _.map(this.stations, el => {
      array.push(el.getId());
      this.dicStationName[el.getId()] = el.stationName;
    });
    this.selectedStationIds = array;
    this.displayedStationIds = [...array];

    if (startDate && startDate.currentValue && endDate && endDate.currentValue) {
      this.historyFilterDate = [moment(startDate.currentValue).toDate(),
        moment(endDate.currentValue).toDate()];
    }
    // console.log(this.historyFilterDate);

    this.stationPagination = {
      currentPage: 0,
      pageSize: PAGING.LIMIT,
      total: this.displayedStationIds.length
    };

    if (this.selectedStationIds.length && !this.isOnRefresing) {
      this.isOnRefresing = true; // this hack to prevent duplicate loading on page load
      self.loadProductStaticData().then(() => {
        self.onRefresh();
        this.isOnRefresing = false;
      });
    }
  }

  loadProductStaticData() {
    return this._staticDataService.getProductStaticData().then(data => {
      this.productItems = {};
      data.forEach(item => {
        this.productItems[item.StaticData.key] = item.StaticData.value;
      });
    });
  }

  get selectedOrderStations() {
    return this.orderStationControl.value;
  }

  onDateChange(selectedDates: Date[]) {
    if (!!selectedDates && !!this.stations && !!this.selectedStationIds) {
      this.historyFilterDate = selectedDates;
      this.onRefresh();
    }
  }

  async loadHistoryOrder(stationIds: string[], offset: number, limit: number) {
    // TODO, need restructure, nam
    const startDate = UtilsService.getStartOfDayTime(
      this.historyFilterDate[0]
    );
    const endDate = UtilsService.getEndOfDayTime(this.historyFilterDate[1]);
    const statuses = this.selectedStatuses;
    const sources = this.selectedSourceTypes;
    const orders$ = await forkJoin(stationIds.map(id => this._OrderDataService.findOrderByStation(id, startDate, endDate, statuses, sources, offset * limit, limit)));
    const ordersCount$ = await forkJoin(stationIds.map(id => this._OrderDataService.countOrderByStation(id, startDate, endDate, statuses, sources)));
    await forkJoin(orders$, ordersCount$).subscribe(([ordersGroupByStation, ordersCount]) => {
      console.log(ordersGroupByStation, ordersCount);
      this.historicalOrdersByStation = {};
      this.expansionGroupByStation = {};
      this.currentStationIds = stationIds;
      this.getTrucksByOrderIds(ordersGroupByStation);
      ordersGroupByStation.forEach(
        (orders: any, stationIndex: number) => {
          const stationId = stationIds[stationIndex];
          const count = +ordersCount[stationIndex]['data']['Count'];
          this.expansionGroupByStation[stationId] = {
            isExpand: stationIndex === 0
          };

          if (!!orders && orders.length > 0) {
            orders.forEach(
              (order: OrderModel, orderIndex: number) => {
                this.expansionGroupByStation[stationId][
                  order.getId()
                  ] = stationIndex === 0 && orderIndex === 0;
              }
            );

            let pagination = {
              currentPage: 0,
              pageSize: PAGING.LIMIT,
              total: orders.length > count ? orders.length : count
            };
            this.historicalOrdersByStation[stationId] = {
              orders: [...orders],
              pagination: {...pagination}
            };
          } else {
            // this._snackBar.open("No data found", X_BUTTON, {
            //     duration: NOTIFICATION_DEFAULT_DURARION
            // });
            this.historicalOrdersByStation[stationId] = {
              orders: [],
              pagination: {
                currentPage: 0,
                pageSize: PAGING.LIMIT,
                total: 0
              }
            };
          }
        }
      );
    });

  }

  loadHistoryOrderOfStation(id) {
    const startDate = UtilsService.getStartOfDayTime(
      this.historyFilterDate[0]
    );
    const endDate = UtilsService.getEndOfDayTime(this.historyFilterDate[1]);
    const statuses = this.selectedStatuses;
    const sources = this.selectedSourceTypes;
    const offset = this.historicalOrdersByStation[id].pagination.currentPage;
    const limit = this.historicalOrdersByStation[id].pagination.pageSize;
    const orders$ = this._OrderDataService.findOrderByStation(id, startDate, endDate, statuses, sources, offset * limit, limit);
    const ordersCount$ = this._OrderDataService.countOrderByStation(id, startDate, endDate, statuses, sources);
    forkJoin(orders$, ordersCount$).subscribe(([orders, ordersCount]) => {
      const count = +ordersCount['data']['Count'];
      this.historicalOrdersByStation[id].orders = orders;
      this.historicalOrdersByStation[id].pagination.total = orders.length > count ? orders.length : count;
      console.log(this.historicalOrdersByStation[id]);
    });
  }

  getTrucksByOrderIds(ordersGroupByStation) {
    if (!ordersGroupByStation || !ordersGroupByStation.length) {
      return;
    }

    let orders = [];

    ordersGroupByStation.forEach((items) => {
      if (!items) {
        return;
      }
      if (Array.isArray(items) && !items.length) {
        return;
      }
      if (items && items.length) {
        orders = [...orders, ...items];
        return;
      }

      orders.push(items);
    });

    this._truckDataService.findTruckByOrderIds(orders.map(x => x.getId()).join(',')).then((rs) => {
      this.truckSchedules = rs;
    });
  }

  getTruckPlate(order) {
    if (!order) {
      return;
    }
    let foundTruck = this.truckSchedules.find(x => x['SystemSchedule']['orderId'] == order.getId());
    const re = /[^0-9](?=[0-9])/g;
    if (foundTruck) {
      return `.${foundTruck.Truck.truckPlate}`.replace(re, '$& ');
    }
    return '.--- ----';
  }

  loadOrderByStation(stationId: string, offset: number, limit: number) {
    const startDate = UtilsService.getStartOfDayTime(
      this.historyFilterDate[0]
    );
    const endDate = UtilsService.getEndOfDayTime(this.historyFilterDate[1]);
    const statuses = this.selectedStatuses;
    const sources = this.selectedSourceTypes;
    this._OrderDataService.findOrderByStation(stationId, startDate, endDate, statuses, sources, offset * limit, limit)
      .then((orders) => {
        if (!!orders && orders.length > 0) {
          this.expansionGroupByStation[stationId] = {
            isExpand: true
          };
          orders.forEach(
            (order: OrderModel) => {
              this.expansionGroupByStation[stationId][
                order.getId()
                ] = false;
            }
          );
          this.historicalOrdersByStation[stationId].orders = orders;
        }
      });
  }

  openOrderDetailDialog(order: OrderModel) {
    let orderDialog = this._DialogService.open(
      OmOrderDetailsDialogComponent,
      {
        id: order.getId(),
        readonly: false
      }
    );
    console.log(order);

    orderDialog.afterClosed().subscribe((res) => {
      // if (res === 'Updated') {
      //     this.onRefresh();
      // }
      console.log(res);
      this.loadHistoryOrderOfStation(order.stationId);
    });
  }

  getPageList(pagination: any) {
    // console.log(pagination);
    if (isNaN(this.getTotalItems(pagination))) {
      return Array(1);
    }
    return new Array(
      Math.ceil(this.getTotalItems(pagination) / pagination.pageSize)
    );
  }

  getDisplayedItem(array: any[], pagination) {
    const displayedItems = array.slice(
      pagination.pageSize * pagination.currentPage,
      pagination.pageSize * (pagination.currentPage + 1)
    );
    return displayedItems;
  }

  getCurrentPageInfo(pagination: any) {
    const total = this.getTotalItems(pagination);
    const startIndex = this.getPageStartIndex(pagination);
    const endIndex = startIndex + pagination.pageSize;
    return `${total === 0 ? 0 : startIndex + 1} - ${
      endIndex > total ? total : endIndex
    } of ${total}`;
  }

  getTotalItems(pagination) {
    return pagination.total;
  }

  getPageStartIndex(pagination: any) {
    return pagination.pageSize * pagination.currentPage;
  }

  toggleStationRows(stationIds: string[], isExpand) {
    stationIds.forEach((stationId: string) => {
      if (!!this.expansionGroupByStation[stationId]) {
        Object.keys(this.expansionGroupByStation[stationId]).forEach(
          (orderId: string) => {
            this.expansionGroupByStation[stationId].isExpand = isExpand;
            this.expansionGroupByStation[stationId][
              orderId
              ] = isExpand;
          }
        );
      }
    });
  }

  toggleStationRow(stationId: string) {
    this.expansionGroupByStation[stationId].isExpand = !this
      .expansionGroupByStation[stationId].isExpand;
  }

  toggleOrderRow(stationId: string, orderId: string) {
    this.expansionGroupByStation[stationId][orderId] = !this
      .expansionGroupByStation[stationId][orderId];
  }

  isExpandedRow(stationId: string, orderId: string): boolean {
    return this.expansionGroupByStation[stationId][orderId] === true;
  }

  getProductItemWidth() {
    return `${100 / 4}%`;
  }

  getProductCodeClass(productCode: string) {
    return productCode.toLowerCase();
  }

  isEmpty() {
    return (
      !!this.historicalOrdersByStation &&
      UtilsService.isEmptyObj(this.historicalOrdersByStation)
    );
  }

  onStationDetails(id) {
    this._DialogService.open(CmStationDetailsDialogComponent, {id: id});
  }

  uploadSAPFile() {
    let dialogRef = this._DialogService.open(UploadSapFileDialogComponent, {});

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Uploaded') {
        this.onRefresh();
      }
    });
  }

  applyFilter() {
    let orderStatuses = this.selectedStatuses;
    let sourceTypes = this.selectedSourceTypes;
    let searchControlAlias = this.searchControl.value;
    if (!!this.historicalOrdersByStation) {
      this.currentStationIds.forEach(stationId => {
        if (!!this.historicalOrdersByStation[stationId]) {
          const rawOrders: OrderModel[] = _.cloneDeep(
            this.historicalOrdersByStation[stationId].orders
          );
          if (!!rawOrders) {
            searchControlAlias = searchControlAlias.toLowerCase();
            const orderIds: IHashObject<boolean> = {};

            let orders = rawOrders.filter(
              order =>
                orderStatuses.includes(order.orderStatus) &&
                (sourceTypes.includes(order.source) ||
                  (sourceTypes.indexOf('No source') > -1
                    ? order.source == undefined
                    : false))
            );

            orders.forEach((order: OrderModel) => {
              const items = [];
              order.item.forEach(i => {
                if (
                  (!!i.productCode &&
                    i.productCode
                      .toLowerCase()
                      .includes(searchControlAlias)) ||
                  (!!i.quantity &&
                    i.quantity
                      .toString()
                      .includes(searchControlAlias))
                ) {
                  items.push(i);
                  orderIds[order.getId()] = true;
                }
              });
              if (
                (!!order.getId() &&
                  order
                    .getId()
                    .toLowerCase()
                    .includes(searchControlAlias)) ||
                (!!order.deliveredTime &&
                  order.deliveredTime.includes(
                    searchControlAlias
                  ))
              ) {
                orderIds[order.getId()] = true;
              }

              if (
                items.length === 0 &&
                !!orderIds[order.getId()]
              ) {
                order.item = [...order.item];
              } else {
                order.item = items;
              }
            });

            orders = orders.filter(order =>
              Object.keys(orderIds).includes(order.getId())
            );
            this.historicalOrdersByStation[stationId] = {
              orders: orders,
              pagination: {
                currentPage: 0,
                pageSize: PAGING.LIMIT,
                total: orders.length
              }
            };
          } else {
            this.historicalOrdersByStation[stationId] = null;
          }
        }
      });
    }
  }

  onNew() {
    let orderDialog = this._DialogService.open(OmNewComponent);

    orderDialog.afterClosed().subscribe((res) => {
      if (res === 'Created') {
        this.onRefresh();
      }
    });
  }

  onRefresh() {
    this.selectOrder(null);
    const ids = this.getCurrentPageStationIds();
    if (ids.length > 0) {
      this.loadHistoryOrder(ids, 0, PAGING.LIMIT); // always reset paging of orders when station reload
    } else {
      this._resetStationState();
    }
  }

  onStationPageChange(stationId, pagination) {
    this.loadOrderByStation(stationId, pagination.currentPage, PAGING.LIMIT);
  }

  onPreviousPage(pagination, isSubstationPaging, stationId) {
    this.selectOrder(null);
    const self = this;
    pagination.currentPage = pagination.currentPage - 1;
    clearTimeout(self.paginationTimeout);
    self.paginationTimeout = setTimeout(() => {
      if (isSubstationPaging) {
        self.onRefresh();
      } else {
        self.onStationPageChange(stationId, pagination);
      }
    }, 500);

  }

  onNextPage(pagination, isStationsPaging, stationId) {
    this.selectOrder(null);
    const self = this;
    pagination.currentPage = pagination.currentPage + 1;
    clearTimeout(self.paginationTimeout);
    self.paginationTimeout = setTimeout(() => {
      if (isStationsPaging) {
        self.onRefresh();
      } else {
        self.onStationPageChange(stationId, pagination);
      }
    }, 500);

  }

  getCurrentPageStationIds(): string[] {
    const startIndex = this.getPageStartIndex(this.stationPagination);
    const endIndex = startIndex + this.stationPagination.pageSize;

    return this.selectedStationIds.slice(startIndex, endIndex);
  }

  onStationSelectionChange(newV: any) {
    this.selectedStationIds = newV;
    this.stationPagination.total = this.selectedStationIds.length;
    console.log(this.stationPagination);
    console.log(this.stationPagination.total / this.stationPagination.pageSize);
    if (this.stationPagination.total / this.stationPagination.pageSize <= this.stationPagination.currentPage) {
      this.stationPagination.currentPage = 0;
    }
    this.onRefresh();
  }

  onStatusSelectionChange(newV: any) {
    this.selectedStatuses = newV;
    this.stationPagination.currentPage = 0;
    this.onRefresh();
  }

  //clear all text on search box
  clearSearch() {
    this.searchControl.setValue('');
  }

  onSourceSelectionChange(newV: any) {
    this.selectedSourceTypes = newV;
    //this.applyFilter();
    this.stationPagination.currentPage = 0;
    this.onRefresh();
  }

  private _resetStationState() {
    this.historicalOrdersByStation = {};
    this.expansionGroupByStation = {};
    this.currentStationIds = [];

  }

  onRequestMessage(order: OrderModel) {
    this._DialogService.open(OmOrderRemarkDialogComponent, {
      message: order.remark,
      datetime: order.lastUpdated,
      userName: order.userName
    }, {});
  }

  selectOrder(order: OrderModel) {
    if (order !== null) {
      if (this.selectedOrders.indexOf(order) >= 0) {
        this.selectedOrders.splice(this.selectedOrders.indexOf(order), 1);
      } else {
        this.selectedOrders.push(order);
      }

    } else {
      this.selectedOrders = [];
    }
    if (this.selectOrderCallback) {
      this.selectOrderCallback.emit(this.selectedOrders);
    }
  }

  importCIOrders() {
    let dialogRef = this._DialogService.open(ImportManualCiOrdersDialogComponent, {});

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Uploaded') {
        this.onRefresh();
      }
    });
  }
}
