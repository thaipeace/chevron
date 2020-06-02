import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { DriverModel } from '@shared/models/data.models/fleet/driver.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { NotificationDataService } from '@app/shared/services/data/notification-data.service';
import { NotificationModel } from '@app/shared/models/data.models/notification/notification.model';

@Component({
  selector: 'app-nm-delete-dialog',
  templateUrl: './nm-delete-dialog.component.html',
  styleUrls: ['./nm-delete-dialog.component.scss']
})
export class NmDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NmDeleteDialogComponent>,
    private _snackBar: MatSnackBar,
    private _notificationDataService: NotificationDataService,
    @Inject(MAT_DIALOG_DATA) public data: NotificationModel
  ) { }

  ngOnInit() {
  }

  onSaveClick() {
    const payload = new TQLFormData();
    payload.setValue('id', this.data.getId());
    this._notificationDataService.delete(payload).then((rs) => {
      let message = '';
      if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
        message = `Notification Deleted Successfully.`;
      } else {
        message = `There are problems in deleting this notification.`;
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    });
    this.dialogRef.close('Deleted');
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
