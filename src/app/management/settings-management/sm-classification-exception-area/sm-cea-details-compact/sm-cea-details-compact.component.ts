import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';
import {SideBarService} from '@shared/services/side-bar.service';
import * as moment from 'moment';
import {ExceptionAreaDataService} from '@shared/services/data/settings/exception-area-data.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sm-cea-details-compact',
  templateUrl: './sm-cea-details-compact.component.html',
  styleUrls: ['./sm-cea-details-compact.component.scss']
})
export class SmCeaDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['ExceptionAreaName', 'Description'];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _ExceptionAreaDataService: ExceptionAreaDataService) {
    super(_DialogService, _SideBarService, _ExceptionAreaDataService);
  }

  generateFormData(obj) {
    console.log(obj);
    super.generateFormData(obj);
    this.formDOM.addControl('IsRestricted', new FormControl(obj.getValue('IsRestricted') === 'true', []));
  }

  onUpdate() {
    if (!this.formDOM.get('IsRestricted').value) {
      this.formDOM.get('IsRestricted').setValue(false);
    }
    super.onUpdate();
  }
}
