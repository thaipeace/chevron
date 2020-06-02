import {Component, OnInit} from '@angular/core';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';
import {TripPreferenceService} from '@shared/services/data/settings/trip-preference.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {StaticDataService} from '@shared/services/data/static-data.service';
import {UpdateTypeModel} from '@shared/models/data.models/update-type.model';

@Component({
  selector: 'app-sm-tp-details-compact',
  templateUrl: './sm-tp-details-compact.component.html',
  styleUrls: ['./sm-tp-details-compact.component.scss']
})
export class SmTpDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['ModeOfUpdate', 'Description'];
  modes: UpdateTypeModel[];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              private _TripPreferenceService: TripPreferenceService,
              private _StaticDataService: StaticDataService) {
    super(_DialogService, _SideBarService, _TripPreferenceService);

    this._StaticDataService.getAllUpdateType()
      .then((rs) => {
        this.modes = rs;
      });

  }
}

