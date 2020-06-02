import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';

export class TripPreferenceModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.TRIP_PREFERENCE.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;
  value: string;

  constructor(_data = {}) {
    super(_data, 'TripReferenceId');
    this.name = this.getValue('StatusName');
    this.value = this.getValue('ModeOfUpdate');
  }
}

