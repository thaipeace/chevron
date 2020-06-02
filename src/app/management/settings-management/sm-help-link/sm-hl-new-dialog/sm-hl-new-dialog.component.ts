import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-sm-hl-new-dialog',
  templateUrl: './sm-hl-new-dialog.component.html',
  styleUrls: ['./sm-hl-new-dialog.component.scss']
})
export class SmHlNewDialogComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH: number = 500;
  public selectedItem: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmHlNewDialogComponent>,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.HELP_LINK.CREATE,
      [this.selectedItem.name, this.selectedItem.key,
      this.selectedItem.value, this.selectedItem.description]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancelAndUpdate();
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCancelAndUpdate() {
    this.dialogRef.close(true);
  }
}
