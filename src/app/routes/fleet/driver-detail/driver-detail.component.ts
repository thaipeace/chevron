import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CURRENT_ORDERS } from '@app/shared/constants/dummy.constant';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.scss']
})
export class DriverDetailComponent implements OnInit {
  driver: any;
  next_orders = [];
  current_orders = [];

  constructor(
    public dialogRef: MatDialogRef<DriverDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.driver = data;
  }

  ngOnInit(): void {
    this.loadNextOrder();
    this.loadCurrentOrders();
  }

  loadNextOrder() {
    this.next_orders = _.cloneDeep(CURRENT_ORDERS, true);
    this.next_orders.forEach((el) => {
      el['date'] = moment().add(Math.round(Math.random() * 10) + 3, 'hours').valueOf();
      el['status'] = 'Ready';
    });
  }

  loadCurrentOrders() {
    this.current_orders = _.cloneDeep(CURRENT_ORDERS, true);
    this.current_orders.forEach((el) => {
      el['date'] = moment().subtract(Math.round(Math.random() * 10) + 3, 'hours').valueOf();
    });
  }

  differentByHour(from, to) {
    return moment(to).diff(from, 'hours');
  }

}
