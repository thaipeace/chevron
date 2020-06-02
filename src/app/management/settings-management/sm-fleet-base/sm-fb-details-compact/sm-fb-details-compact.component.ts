import {Component} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {DialogService} from '@shared/services/others/dialog.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {FleetBaseDataService} from '@shared/services/data/settings/fleet-base-data.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';

@Component({
  selector: 'app-sm-fb-details-compact',
  templateUrl: './sm-fb-details-compact.component.html',
  styleUrls: ['./sm-fb-details-compact.component.scss']
})
export class SmFbDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['FleetBaseName', 'Description', 'RotATimeSpan'];

  rotaTime: Date = new Date();

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _FleetBaseDataService: FleetBaseDataService) {
    super(_DialogService, _SideBarService, _FleetBaseDataService);
  }

  generateFormData(obj) {
    const groups = {};
    _.map(this.keys, (el) => {
      return groups[el] = new FormControl(obj.getValue(el) || '', el === 'RotATimeSpan' ? [] : [Validators.required]);
    });
    this.formDOM = new FormGroup(groups);
    this.rotaTime = new Date(parseInt(this.formDOM.get('RotATimeSpan').value));
    this.coordinates = obj.coordinates.slice();
  }

  toHourMinuteSecond(time: any) {
    return moment(parseInt(time)).format('HH:mm:ss');
  }


  onUpdate() {
    this.formDOM.get('RotATimeSpan').setValue(moment(this.rotaTime).valueOf());
    super.onUpdate();
  }
}
