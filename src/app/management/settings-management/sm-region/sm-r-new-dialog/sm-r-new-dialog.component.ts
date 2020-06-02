import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ApiDataService} from '@shared/services/api-data.service';
import {DataUtilService} from '@shared/services/data-util.service';
import {Payload} from '@shared/models/payload';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

@Component({
  selector: 'app-sm-r-new-dialog',
  templateUrl: './sm-r-new-dialog.component.html',
  styleUrls: ['./sm-r-new-dialog.component.scss']
})
export class SmRNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};
  public associatedTerminals: string[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmRNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.setAssociatedTerminals();
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.REGION.CREATE,
      [this.selectedItem.regionName, this.selectedItem.description, this.selectedItem.associatedTerminalName]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancel(true);
      }
      this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});

    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    });
  }

  onCancel(isRefresh: boolean = false) {
    this.dialogRef.close(isRefresh);
  }

  setAssociatedTerminals() {
    let exePayload = new Payload(PayloadsConstant.TERMINAL.FIND_ALL, []);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      if (raw.APIResponse.Status === 'Success') {
        this.associatedTerminals = this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Terminals.Terminal);
      }

    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    });
  }

}
