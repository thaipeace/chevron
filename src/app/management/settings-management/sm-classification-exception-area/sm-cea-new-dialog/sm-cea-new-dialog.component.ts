import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';

@Component({
  selector: 'app-sm-cea-new-dialog',
  templateUrl: './sm-cea-new-dialog.component.html',
  styleUrls: ['./sm-cea-new-dialog.component.scss']
})
export class SmCeaNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmCeaNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {}

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.EXCEPTION_AREAS.CREATE,
      [this.selectedItem.exceptionAreaName, this.selectedItem.description,
        this.selectedItem.isRestricted || 'false']
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
