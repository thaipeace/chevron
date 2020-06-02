import * as _ from 'lodash';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {OrderItemModel} from '@shared/models/data.models/order/order-item.model';

export class CompartmentModel extends DefaultObject {
  orderItem: OrderItemModel;
  currentProduct: any;
  divert: any;

  constructor(_data = {}) {
    super(_data, 'sysId');
  }

  setOrder(orderItem: OrderItemModel) {
    this.orderItem = orderItem;
  }
}

