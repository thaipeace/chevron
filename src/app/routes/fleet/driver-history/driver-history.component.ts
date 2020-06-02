import { Component, OnInit } from '@angular/core';
import { HISTORY_ORDERS, DRIVERS } from '@app/shared/constants/dummy.constant';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { DriverDetailComponent } from '../driver-detail/driver-detail.component';

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss']
})
export class DriverHistoryComponent implements OnInit {
  history_orders: any[];
  drivers: any[];
  
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.drivers = _.cloneDeep(DRIVERS);
    this.loadHistoryOrder();
  }

  loadHistoryOrder() {
    this.history_orders = _.cloneDeep(HISTORY_ORDERS, true);
    this.history_orders.forEach(order => {
      order.drivers = [this.getRandomDriver(), this.getRandomDriver()];
    });
  }

  openDriverDetail(driver): void {
    const dialogRef = this.dialog.open(DriverDetailComponent, {
        data: driver,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
}


  getRandomDriver() {
    return this.drivers[Math.floor(Math.random() * this.drivers.length)];
  }

}
