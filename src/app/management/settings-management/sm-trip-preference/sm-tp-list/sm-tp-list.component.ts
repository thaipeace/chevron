import {Component, OnInit} from '@angular/core';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {TripPreferenceService} from '@shared/services/data/settings/trip-preference.service';
import {SmTpDetailsCompactComponent} from '@management/settings-management/sm-trip-preference/sm-tp-details-compact/sm-tp-details-compact.component';

@Component({
  selector: 'app-sm-tp-list',
  templateUrl: './sm-tp-list.component.html',
  styleUrls: ['./sm-tp-list.component.scss']
})
export class SmTpListComponent extends SmDefaultList implements OnInit {
  displayedColumns = [
    'index',
    'Parameter',
    'Value',
    'Created',
    'Modified',
  ];

  constructor(public _SideBarService: SideBarService,
              public _TripPreferenceService: TripPreferenceService,
              public _DialogService: DialogService) {
    super(_SideBarService, _TripPreferenceService, _DialogService, null, SmTpDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }

}
