import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-create-order-import-product-mapping',
  templateUrl: './create-order-import-product-mapping.component.html',
  styleUrls: ['./create-order-import-product-mapping.component.scss']
})
export class CreateOrderImportProductMappingComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateOrderImportProductMappingComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.settings.orderImportProductMapping.create,
      [this.selectedItem.productFromSAP, this.selectedItem.productInATMOS]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      console.log(raw);
      let message = 'Created failed';
      if (raw.Create.Status === 'Success') {
        message = 'Create successfully';
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
