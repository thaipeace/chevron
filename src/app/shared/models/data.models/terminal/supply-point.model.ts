import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {UtilsService} from '@shared/services/utils.service';
import * as _ from 'lodash';

export class SupplyPointModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.SUPPLY_POINT.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;
  products: any[];

  constructor(_data = {}) {
    super(_data, 'SupplyPointId');
    console.log(_data);
    this.generateGeofenPoints();
    this.name = this.getValue('SupplyPointName');

    this.products = this.getValue('Products') || [];
    this.products = UtilsService.isArray(this.products) ? this.products : [this.products];
  }
}

