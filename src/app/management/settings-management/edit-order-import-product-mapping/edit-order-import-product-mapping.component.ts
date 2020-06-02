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
import { ParamsService } from '@app/shared/services/params.service';
import { DialogService } from '@app/shared/services/others/dialog.service';


@Component({
  selector: 'app-edit-order-import-product-mapping',
  templateUrl: './edit-order-import-product-mapping.component.html',
  styleUrls: ['./edit-order-import-product-mapping.component.scss']
})
export class EditOrderImportProductMappingComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedItem: any = null;
  isEditing: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _DialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }

    this.selectedItem = this.data.item;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedItem = this.data.item;
    }
  }

  onCloseEditing(isRefresh?) {
    this._SideBarService.close();
    this.control.fn_close();

    if (isRefresh) {
      this._SideBarService.refresh('orderImportProductMapping');
    }
  }

  onUpdate() {
    let exePayload = new Payload(
      PayloadsConstant.settings.orderImportProductMapping.update,
      [this.selectedItem.sysId, this.selectedItem.productInATMOS, this.selectedItem.productFromSAP, this.selectedItem.remark]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = 'Update falied';
      if (raw.Update.Status === 'Success') {
        message = 'Update successfully'
        this.onCloseEditing(true);
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });

  }

  doCancel() {
    this.isEditing = false;
  }

}