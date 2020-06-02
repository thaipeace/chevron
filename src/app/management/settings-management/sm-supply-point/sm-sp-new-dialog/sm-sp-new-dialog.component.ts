import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ApiDataService} from '@shared/services/api-data.service';
import {DataUtilService} from '@shared/services/data-util.service';
import {Payload} from '@shared/models/payload';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

@Component({
  selector: 'app-sm-sp-new-dialog',
  templateUrl: './sm-sp-new-dialog.component.html',
  styleUrls: ['./sm-sp-new-dialog.component.scss']
})
export class SmSpNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};
  public productCodes: any[] = [];
  public productsCodeQuery: string[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmSpNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.setProductCodes();
  }

  setProductCodes() {
    let getProductTypesPayload = new Payload(PayloadsConstant.settings.listAllProducts, []);
    this.apiDataService.executeQuery(getProductTypesPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      this.productCodes = raw.APIResponse && raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Products.Product)
        : [];
    }, error => {
      console.log('Loading error');
    });
  }

  onCreate() {
    this.setProductsCodeQuery();
    let exePayload = new Payload(PayloadsConstant.SUPPLY_POINT.CREATE,
      [this.selectedItem.supplyName, this.selectedItem.description, this.productsCodeQuery.join('')]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      if (res) {
        let raw = this.dataUtilService.convertXmlToJson(res);
        let message = raw.APIResponse.Message;
        if (raw.APIResponse.Status === 'Success') {
          this.onCancel(true);
        }
        this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      } else {
        this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    })
  }

  onCancel(isRefresh: boolean = false) {
    this.dialogRef.close(isRefresh);
  }

  setProductsCodeQuery() {
    this.productsCodeQuery = this.selectedItem.productCode.map(pc => `<productId>${pc.ProductId}</productId>`);
  }

  onSelectedProductTypesChange(event) {
    this.selectedItem.productCode = event;
  }

}
