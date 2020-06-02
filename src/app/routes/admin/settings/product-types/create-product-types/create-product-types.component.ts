import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-create-product-types',
  templateUrl: './create-product-types.component.html',
  styleUrls: ['./create-product-types.component.scss']
})
export class CreateProductTypesComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};
  public baseProductTypes: any[] = [];
  public baseProductsQuery: string = '';

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateProductTypesComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.setBaseProductTypes();
  }

  setBaseProductTypes() {
    let listAllBaseProductsPayload = new Payload(PayloadsConstant.settings.listAllBaseProducts, []);

    this.apiDataService.executeQuery(listAllBaseProductsPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      this.baseProductTypes = raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.BaseProducts.BaseProduct)
        : [];
    }, error => {
      console.log('Loading error');
    });
  }

  onCreate() {
    this.setBaseProductsQuery();
    let exePayload = new Payload(PayloadsConstant.settings.createProduct,
      [this.selectedItem.productCode, this.selectedItem.description, this.selectedItem.colorCode,
        this.baseProductsQuery]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancel(true);
      }
      
      this._snackBar.open(message, X_BUTTON, { duration: 5000 });
    }, error => {
      console.log('Loading error');
    });
  }

  onCancel(isRefresh?) {
    this.dialogRef.close(isRefresh);
  }

  setBaseProductsQuery() {
    let baseProductsQueryArr = this.selectedItem.basesProductTypes.map(b => `<baseProductId>${b.BaseProductId}</baseProductId>`);
    this.baseProductsQuery = baseProductsQueryArr.join('');
  }

  onSelectedBasesProductTypesChange(event) {
    this.selectedItem.basesProductTypes = event;
  }

  invalidUpdate() {
    let result = false;
    result = !this.selectedItem.basesProductTypes || !this.selectedItem.colorCode
    return result;
  }

}
