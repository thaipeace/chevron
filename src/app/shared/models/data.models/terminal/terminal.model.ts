import {IGeoPointModel} from '../customer/customer-station.model';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {PayloadsConstant} from '@shared/constants/payloads.constant';

export class TerminalModel extends DefaultObject implements ICoordinateModel {
  KEY: string = PayloadsConstant.TERMINAL.OBJECT_FIND;
  coordinates: GeoPoint[];
  centerBound: GeoPoint;
  name: string;

  sysId: string;
  address: string;
  description: string;
  lastUpdated: string;
  terminalName: string;
  geoPoints: IGeoPointModel[];
  geoPoint: GeoPoint;
  createDate: string;

  constructor(_data = {}) {
    super(_data, 'TerminalId');
    this.address = this.getValue('address');
    this.description = this.getValue('Description');
    this.lastUpdated = this.getValue('lastUpdated');
    this.terminalName = this.getValue('terminalName');
    this.name = this.getValue('TerminalName');
    this.geoPoints = this.getValue('geoPoint');
    this.createDate = this.getValue('createDate');
    const point = this.getValue('geoPoint');
    if (point) {
      this.geoPoint = new GeoPoint(point.latitude, point.longitude);
    }

    this.generateGeofenPoints();
  }
}

