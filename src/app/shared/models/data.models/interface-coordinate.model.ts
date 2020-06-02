import {GeoPoint} from '@shared/models/geo-point.model';

export interface ICoordinateModel {
  KEY: string;
  centerBound: GeoPoint;
  coordinates: GeoPoint[];
  name: string;
}

export class CoordinateModel {
  KEY: string = '';
  centerBound: GeoPoint;
  coordinates: GeoPoint[];
  name: string;

  constructor() {

  }
}
