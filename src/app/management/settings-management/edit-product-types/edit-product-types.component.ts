import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { IDynamicComponent } from '@shared/models/dynamic-item.class';
import { SideBarControl } from '@shared/models/sidebar-control.class';
import * as _ from 'lodash';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { BaseProductDataService } from '@shared/services/data/settings/base-product-data.service';
import { UtilsService } from '@shared/services/utils.service';

@Component({
  selector: 'app-edit-product-types',
  templateUrl: './edit-product-types.component.html',
  styleUrls: ['./edit-product-types.component.scss']
})
export class EditProductTypesComponent implements OnInit, OnChanges {

  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedProductType: any = null;
  baseProductTypes: any[] = [];
  selectedBasesProductIds: any[] = [];
  isEditing: boolean = false;
  baseProductsQuery: string[] = [];
  selectedBaseProducts: any;
  availableBaseProducts: any;
  baseProducts: any;

  constructor(
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _BaseProductDataService: BaseProductDataService
  ) {

  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }

    this.setBaseProductTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      // this.selectedProductType = this.data.productType;
      this.setSelectedProductType(this.data.productType);
    }
  }

  close() {
    this.control.fn_close();
  }

  setSelectedProductType(data) {
    let exePayload = new Payload(PayloadsConstant.settings.getProductTypeData, [data.ProductId]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);

      if (raw.APIResponse.Status === 'Success') {
        this.selectedProductType = raw.APIResponse.Product;
        if (this.selectedProductType.BaseProducts) {
          this.selectedProductType.BaseProducts.BaseProduct = this.dataUtilService.wrapObjToOneElementArray(
            this.selectedProductType.BaseProducts.BaseProduct
          );

          if (this.selectedProductType.BaseProducts.BaseProduct.length) {
            this.selectedBasesProductIds = this.selectedProductType.BaseProducts.BaseProduct.map(s => s.BaseProductId);
          }
        }
      }
    }, error => {
      console.log('Loading error');
    });
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

  onCloseEditing(isRefresh?) {
    this._SideBarService.close();
    this.control.fn_close();

    if (isRefresh) {
      this._SideBarService.refresh('productType');
    }
  }

  async onUpdateItemValue() {
    await this.clearBaseProductRef();

    this.setBaseProductsQuery();
    let exePayload = new Payload(PayloadsConstant.settings.updateProductDetail,
      [this.selectedProductType.ProductId, this.selectedProductType.ProductCode,
        this.selectedProductType.Description, this.selectedProductType.ColorCode,
        this.baseProductsQuery.join('')]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.onCloseEditing(true);
      }

      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });

  }

  clearBaseProductRef() {
    let exePayload = new Payload(
      PayloadsConstant.settings.deleteAllBaseProductsInProduct,
      [this.selectedProductType.ProductId]
    );
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  setBaseProductsQuery() {
    this.baseProductsQuery = this.selectedBasesProductIds.map(sbpid => `<baseProductId>${sbpid}</baseProductId>`);
  }

  invalidUpdate() {
    let result = false;
    result = !this.selectedBasesProductIds.length || !this.selectedProductType.colorCode;
    return result;
  }

  onCancelEdit() {
    this.isEditing = false;
    this.setSelectedProductType(this.data.productType);
  }

  onEdit() {
    this.isEditing = true;
  }

  onSelectedBasesProductTypesChange(event) {
    this.selectedBasesProductIds = event.map(e => e.BaseProductId);
  }
}
