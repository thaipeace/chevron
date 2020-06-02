import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';

export class BaseProductModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.BASE_PRODUCT.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;
  type: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.name = this.getValue('baseProductCode');
    this.type = this.getValue('baseProductCategory');
  }
}

