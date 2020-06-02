import * as _ from 'lodash';
import * as moment from 'moment';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class DeliveryWindowModel extends DefaultObject {
  duration: number;
  count: number;
  max: number;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.duration = moment(parseInt(this.getRawValue('EndDate')))
      .diff(moment(parseInt(this.getRawValue('StartDate'))), 'days');
    this.count = parseInt(this.getValue('Count'));
    this.max = parseInt(this.getValue('maxMonthlyDeliveryDistribution'));
  }
}

