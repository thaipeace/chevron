import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';

export class TruckRateModel extends DefaultObject {
  size: string;
  distance: string;
  cost: string;
  currency: string;

  constructor(_data = {}) {
    super(_data, 'TruckrateId');
    this.size = this.getValue('Size');
    this.distance = this.getValue('Distance');
    this.cost = this.getValue('Cost');
    this.currency = this.getValue('Currency');
  }

  toQueries() {
    if (!this.size && !this.distance && !this.cost && !this.currency) {
      return '';
    }
    return `<TruckRate>
    <size>${this.size || ''}</size>
            <distance>${this.distance || ''}</distance>
            <cost>${this.cost || ''}</cost>
            <currency>${this.currency || ''}</currency>
            </TruckRate>
    `;
  }
}

