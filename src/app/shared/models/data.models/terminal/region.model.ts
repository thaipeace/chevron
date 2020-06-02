import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {UtilsService} from '@shared/services/utils.service';
import {TruckRateModel} from '@shared/models/data.models/terminal/truck-rate.model';
import {ProductModel} from '@shared/models/data.models/terminal/product.model';

export class RegionModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.REGION.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;
  supplyPoints: any[];
  truckRates: TruckRateModel[];
  products: ProductModel[];
  availableProducts: ProductModel[];
  selectedProducts: ProductModel[];
  selectedProductsIds: string[];

  constructor(_data = {}) {
    super(_data, 'RegionId');
    this.generateGeofenPoints();
    this.name = this.getValue('RegionName');

    this.supplyPoints = this.getValue('SupplyPoints') || [];
    this.supplyPoints = this.supplyPoints['SupplyPoint'] || [];
    this.supplyPoints = UtilsService.isArray(this.supplyPoints) ? this.supplyPoints : [this.supplyPoints];
    _.map(this.supplyPoints, (item) => {
      item.products = [];
      if (!!item['Products']) {
        item['Products']['Product'] = UtilsService.isArray(item['Products']['Product'])
          ? item['Products']['Product'] : [item['Products']['Product']];
        item.products = item['Products']['Product'];
      }
    });

    this.truckRates = this.getValue('TruckRates') || [];
    this.truckRates = this.truckRates['TruckRate'] || [];
    this.truckRates = _.map(UtilsService.isArray(this.truckRates) ? this.truckRates : [this.truckRates], (el) => new TruckRateModel(el));

    this.products = this.getValue('Products') || [];
    this.products = this.products['Product'] || [];
    this.products = _.map(UtilsService.isArray(this.products) ? this.products : [this.products], (el) => new ProductModel(el));

    this.resetProducts();

  }

  resetProducts(products: ProductModel[] = this.products) {
    this.availableProducts = products.slice();
    this.selectedProducts = [];
    this.selectedProductsIds = _.map(this.selectedProducts, (el) => el.getId());
  }

  setProducts(ids: string[]) {
    this.resetProducts();
    this.selectedProducts = _.filter(this.availableProducts, (el) => ids.indexOf(el.getId()) !== -1);
    this.availableProducts = _.differenceWith(this.availableProducts, this.selectedProducts, _.isEqual);
    this.selectedProductsIds = _.map(this.selectedProducts, (el) => el.getId());
  }
}

