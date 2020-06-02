import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';

export class ExceptionAreaModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.EXCEPTION_AREAS.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;

  constructor(_data = {}) {
    super(_data, 'ExceptionAreaId');
    this.generateGeofenPoints();
    this.name = this.getValue('ExceptionAreaName');
  }
}

