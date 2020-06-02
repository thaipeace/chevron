import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ApiDataService} from '@shared/services/api-data.service';
import {DataUtilService} from '@shared/services/data-util.service';
import {Payload} from '@shared/models/payload';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

@Component({
  selector: 'app-sm-t-new-dialog',
  templateUrl: './sm-t-new-dialog.component.html',
  styleUrls: ['./sm-t-new-dialog.component.scss']
})
export class SmTNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmTNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.TERMINAL.createTerminalData,
      [this.selectedItem.terminalName, this.selectedItem.description,
        this.selectedItem.longitude, this.selectedItem.latitude, this.selectedItem.altitude]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      if (res) {
        let raw = this.dataUtilService.convertXmlToJson(res);
        let message = raw.APIResponse.Message;
        if (raw.APIResponse.Status === 'Success') {
          this.onCancel(true);
        }
        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
      } else {
        this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
      }
    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    });
  }

  onCancel(isRefresh: boolean = false) {
    this.dialogRef.close(isRefresh);
  }

}
