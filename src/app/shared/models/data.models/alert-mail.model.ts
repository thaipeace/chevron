import {DefaultObject, TQLFormData} from '../default/default-object.model';
import * as _ from 'lodash';

export class AlertMailModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'userName': {
        type: 'string',
      },
      'subject': {
        type: 'string',
      },
      'message': {
        type: 'string',
      },
    }
  );

  constructor(_data = {}) {
    super(_data);
  }
}
