import * as _ from 'lodash';
import {CompartmentModel} from '@shared/models/data.models/fleet/compartment.model';
import {DriverModel} from '@shared/models/data.models/fleet/driver.model';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';
import {ORDER_STATUS, TRUCK_STATUS} from '@shared/constants/value.constant';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckHistoricalLocationModel} from '@shared/models/data.models/fleet/truck-historical-location.model';
import {UtilsService} from '@shared/services/utils.service';

export class TruckModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'truckPlate': {
        type: 'string',
        editable: true,
      },
      'totalCapacity': {
        type: 'string',
        editable: true,
      },
      'isPtoSupported': {
        type: 'string',
        editable: true,
      },
      'dedicated': {
        type: 'string',
        editable: true,
      },
      'companyId': {
        type: 'string',
        editable: true,
      },
      'safeLoadingPassDate': {}
    }
  );
  index: string;
  truckPlate: string;
  totalCapacity: number;
  drivers = [];
  isPtoSupported: string;
  compartments: CompartmentModel[] = [];
  lastUpdated: string;
  userName: string;
  companyId: string;
  safeLoadingPassDate: string;
  truckState: string;
  dedicated: string;

  orders: OrderModel[] = [];
  pendingOrders: OrderModel[] = [];
  deliveredOrders: OrderModel[] = [];
  currentOrder: OrderModel;

  historicalLocations: TruckHistoricalLocationModel[];
  currentLocation: TruckHistoricalLocationModel;

  marker;
  regions: any[];

  private deliveryStatus: string = null;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.truckPlate = this.getValue('truckPlate');
    this.totalCapacity = parseFloat(this.getValue('totalCapacity'));
    this.isPtoSupported = this.getValue('isPtoSupported') === 'true' ? 'yes' : 'no';

    this._data['compartment'] = Array.isArray(this._data['compartment'])
      ? this._data['compartment'] : [this._data['compartment']];
    _.map(this.getValue('compartment'), (el) => {
      this.compartments.push(new CompartmentModel(el));
    });

    this.lastUpdated = this.getValue('lastUpdated');
    this.userName = this.getValue('userName');
    this.companyId = this.getValue('companyId');
    this.safeLoadingPassDate = this.getValue('safeLoadingPassDate');
    this.truckState = this.getValue('truckState');

    this.dedicated = this.getValue('dedicated') === 'true' ? 'yes' : 'no';

    // regions
    this.regions = this.getValue('region') || [];
    this.regions = UtilsService.isArray(this.regions) ? this.regions : [this.regions];
  }

  addDriver(item: DriverModel) {
    if (typeof _.find(this.drivers, (el) => {
      return el.getId() == item.getId();
    }) === 'undefined') {
      this.drivers.push(item);
    }
  }

  removeDriver(item: DriverModel) {
    this.drivers.splice(this.drivers.indexOf(item), 1);
  }

  isOutOfService() {
    return this.truckState === TRUCK_STATUS.OUT_OF_SERVICE;
  }

  addOrder(order: OrderModel, timestamp: number = 0) {
    const self = this;
    this.orders.push(order);
    order.currentOrderStatusHistory = null;
    order.updateOrderStatus(timestamp);
    if (order.currentOrderStatusHistory) {
      // console.log(order.currentOrderStatusHistory);
      this.deliveryStatus = this.convertOrderStatus(order.currentOrderStatusHistory.orderStatus, this.deliveryStatus);
      if (order.currentOrderStatusHistory.orderStatus !== ORDER_STATUS.DELIVERED) {
        this.pendingOrders.push(order);
        //sort orders by drop number
        this.pendingOrders = _.orderBy(this.pendingOrders, (el) => el.dropNumber);
        this.currentOrder = _.minBy(this.pendingOrders, (el) => el.dropNumber);
      } else {
        this.deliveredOrders.push(order);
      }
    }
    this.orders = _.orderBy(this.orders,
      [
        (el) => {
          return el.getId() === (self.currentOrder ? self.currentOrder.getId() : null);
        },
        (el) => {
          return el.currentOrderStatusHistory ? el.currentOrderStatusHistory.orderStatus == ORDER_STATUS.DELIVERED : null;
        }
      ],
      ['desc', 'asc']);
  }

  resetOrder() {
    this.orders = [];
    this.pendingOrders = [];
    this.deliveredOrders = [];
    this.deliveryStatus = null;
    this.currentOrder = null;
  }

  getDeliveryStatus() {
    return this.deliveryStatus;
  }

  setHistoricalLocation(locations: TruckHistoricalLocationModel[]) {
    this.historicalLocations = _.orderBy(locations, (el) => el.timestamp);
  }

  getLocationFromTimestamp(timestamp: number) {
    const array = _.filter(this.historicalLocations, (el) => el.timestamp >= timestamp);
    if (this.currentLocation) {
      array.push(this.currentLocation);
    }
    return _.orderBy(array, (el) => el.timestamp);
  }

  getLocationToTimestamp(timestamp: number) {
    const array = _.filter(this.historicalLocations, (el) => el.timestamp <= timestamp);
    if (this.currentLocation) {
      array.push(this.currentLocation);
    }
    return _.orderBy(array, (el) => el.timestamp);
  }

  generateLastLocationByTimestamp(timestamp: number) {
    //shorten this fn can cause error, nam, 07/24/2019
    this.currentLocation = _.maxBy(_.filter(this.historicalLocations, (el) => el.timestamp <= timestamp), (el) => el.timestamp);
    return this.currentLocation;
  }

  getCurrentLocation() {
    // console.log(this.currentLocation);
    return this.currentLocation;
  }

  convertOrderStatus(newV, oldV) {
    let status = oldV;
    switch (newV) {
      case ORDER_STATUS.LOADING:
        status = newV;
        break;
      case ORDER_STATUS.UNLOADING:
        status = status !== ORDER_STATUS.LOADING ? newV : oldV;
        break;
      case ORDER_STATUS.ON_TRANSIT:
        status = (status !== ORDER_STATUS.LOADING && status !== ORDER_STATUS.UNLOADING) ? newV : oldV;
        break;
    }
    return status;
  }

}

