import {DefaultObject, TQLFormData} from '../default/default-object.model';
import * as _ from 'lodash';


declare const BE_URL_STATIC: any;

export class MeterTypeModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData();

  constructor(_data = {}) {
    super(_data, 'sysId');
  }

  getImage(): string {
    return `${BE_URL_STATIC}${this.getValue('image')}`;
  }

}
