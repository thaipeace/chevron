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

@Component({
  selector: 'app-edit-base-product-types',
  templateUrl: './edit-base-product-types.component.html',
  styleUrls: ['./edit-base-product-types.component.scss']
})
export class EditBaseProductTypesComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @Input() data;
  control: SideBarControl = null;
  promise;

  originSelectedBaseProductType: any = null;
  selectedBaseProductType: any = null;
  isEditing: boolean = false;
  isColorChanged: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    super();
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedBaseProductType = this.data.baseProductType;
      this.originSelectedBaseProductType = Object.assign({}, this.selectedBaseProductType);
    }
  }

  onCloseEditing(isRefresh?) {
    this._SideBarService.close();
    this.control.fn_close();

    if (isRefresh) {
      this._SideBarService.refresh('baseProductType');
    }
  }

  onUpdate() {
    let exePayload = new Payload(
      PayloadsConstant.settings.updateBaseProduct,
      [this.selectedBaseProductType.BaseProductId, this.selectedBaseProductType.BaseProductCode, 
        this.selectedBaseProductType.ColorCode, this.selectedBaseProductType.Description,
        this.selectedBaseProductType.BaseProductCategory]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'success') {
        this.onCloseEditing(true);
      }
      
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });

  }

  doCancel() {
    this.isEditing = false;
    this.selectedBaseProductType = this.originSelectedBaseProductType;
  }

  isUpdatable() {
    return this.selectedBaseProductType.ColorCode && this.isColorChanged;
  }

}
