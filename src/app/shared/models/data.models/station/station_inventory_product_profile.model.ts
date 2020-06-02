import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';

export class StationInventoryProductProfileModel extends DefaultObject {
  products: IStationProductProfile[];

  constructor(_data = {}) {
    super(_data, '');
    this.products = this.getValue('Product');
  }
}

export interface IStationProductProfile {
  productCode: string;
  lastUpdated: string;
  totalQuantity: number;
  totalUllage: string;
  stationId: string;
  maxFillCapacity: number;
  totalCapacity: number;
  minThreshold: number;
  deadStock: number;
}
