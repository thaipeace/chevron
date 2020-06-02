import {DefaultObject} from '@shared/models/default/default-object.model';

export class OrderItemModel extends DefaultObject {
  constructor(_data = {}) {
    super(_data, 'sysId');
  }
}

