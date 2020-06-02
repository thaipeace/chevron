import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';

export class ProductModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.PRODUCT.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  id: string;
  name: string;
  color: string;

  constructor(_data = {}) {
    super(_data, 'ProductId');
    this.generateGeofenPoints();
    this.name = this.getValue('ProductCode');
    this.id = this.getId();
    this.color = this.getValue('ColorCode');
  }
}

