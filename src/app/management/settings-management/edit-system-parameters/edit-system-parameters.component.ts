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

@Component({
  selector: 'app-edit-system-parameters',
  templateUrl: './edit-system-parameters.component.html',
  styleUrls: ['./edit-system-parameters.component.scss']
})
export class EditSystemParametersComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedParam: any = null;
  originSelectedParam: any = null;
  isEditing: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private paramsService: ParamsService
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
      this.selectedParam = this.data.parameter;
      this.originSelectedParam = Object.assign({}, this.selectedParam);
    }
  }

  onCloseEditing() {
    this._SideBarService.close();
    this.control.fn_close();
  }

  onUpdateParamValue() {
    let updateParamPayload = new Payload(
      PayloadsConstant.settings.updateParameter,
      [this.selectedParam.id, this.selectedParam.category, this.selectedParam.name,
        this.selectedParam.description || '', this.selectedParam.keyType, this.selectedParam.key,
        this.selectedParam.type, this.selectedParam.value]
    );
    this.apiDataService.executeQuery(updateParamPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      if (raw.Status === 'Success') {
        this.paramsService.getAllParams();
        this._snackBar.open(`${this.selectedParam.name}: updated successfully`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        this.onCloseEditing();
      } else {
        this._snackBar.open(`${this.selectedParam.name}: updated failed`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
    }, error => {
      console.log('Loading error');
    });

  }

  doCancel() {
    this.isEditing = false;
    this.selectedParam = this.originSelectedParam;
  }
}
