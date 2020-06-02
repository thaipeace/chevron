import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerModel } from '@shared/models/data.models/customer/customer.model';
import { CustomerDataService } from '@shared/services/data/customer-data.service';
import { NotificationModel } from '@app/shared/models/data.models/notification/notification.model';
import { NotificationDataService } from '@app/shared/services/data/notification-data.service';

@Component({
  selector: 'app-nm-details-dialog',
  templateUrl: './nm-details-dialog.component.html',
  styleUrls: ['./nm-details-dialog.component.scss']
})
export class NmDetailsDialogComponent implements OnInit {
  id;
  notification: NotificationModel;
  unwants: string[] = ['entityId'];
  notificationData: any = {};

  constructor(
    public dialogRef: MatDialogRef<NmDetailsDialogComponent>,
    private _notificationDataService: NotificationDataService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.loadDetails();
  }

  ngOnInit() {
  }

  loadDetails() {
    this._notificationDataService.findById(this.id)
      .then((rs) => {
        this.notification = rs;
        this.notificationData = this.notification._data;
        delete this.notificationData.entityId;
      });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
