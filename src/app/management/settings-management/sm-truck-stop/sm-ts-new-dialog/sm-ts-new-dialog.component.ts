import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';

@Component({
  selector: 'app-sm-ts-new-dialog',
  templateUrl: './sm-ts-new-dialog.component.html',
  styleUrls: ['./sm-ts-new-dialog.component.scss']
})
export class SmTsNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmTsNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.TRUCK_STOP.CREATE,
      [this.selectedItem.truckStopName, this.selectedItem.description]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancel(true);
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    })
  }

  onCancel(isRefresh: boolean = false) {
    this.dialogRef.close(isRefresh);
  }

}
