import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { SideBarService } from '@app/shared/services/side-bar.service';

@Component({
  selector: 'app-sm-dpg-new-dialog',
  templateUrl: './sm-dpg-new-dialog.component.html',
  styleUrls: ['./sm-dpg-new-dialog.component.scss']
})
export class SmDpgNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};

  constructor(
    public dialogRef: MatDialogRef<SmDpgNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.DELIVERY_POINT_GROUP.CREATE,
      [this.selectedItem.name, this.selectedItem.description]
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
