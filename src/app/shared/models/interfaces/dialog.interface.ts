import {GeoPath} from '@shared/models/geo-path.model';
import {GeoPoint} from '@shared/models/geo-point.model';

export interface IDialogEvent<T> {
  confirm: (result: T) => void;
  dismiss: () => void;
}
export interface DialogGeoPoint extends IDialogEvent<GeoPoint> {
  geoPoint: GeoPoint;
}

export interface DialogGeoPolygon extends IDialogEvent<GeoPath> {
  geoPath: GeoPath;
}
