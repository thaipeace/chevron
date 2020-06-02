import * as _ from 'lodash';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { DefaultObject, TQLFormData } from '@shared/models/default/default-object.model';

export class NotificationModel extends DefaultObject {
  index: string;
  id: string
  station: StationModel;
  abbreviatedMessage: string;
  type: string;
  message: string;
  source: string;
  category: string;
  categoryNumber: string;
  priority: string;
  datetime: string;
  username: string;
  stationId: string;

  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
      },
    }
  );

  constructor(_data = {}) {
    super(_data, 'sysId');
    if (this.getValue('sysId')) {
      this.id = this.getValue('sysId')
      this.type = this.getValue('Type') || this.getValue('type');
      this.message = this.getValue('alertText');
      this.priority = this.getValue('priority');
      this.datetime = this.getValue('readingTime');
      this.station = null;
      this.stationId = '';
      this.abbreviatedMessage = '';
      this.source = this.getValue('domainName');
      this.category = '';
      this.categoryNumber = '';
      this.username = '';
    }
  }
}
