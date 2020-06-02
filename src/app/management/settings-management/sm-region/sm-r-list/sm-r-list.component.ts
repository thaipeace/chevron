import {Component, OnInit} from '@angular/core';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {RegionDataService} from '@shared/services/data/settings/region-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {SmRNewDialogComponent} from '@management/settings-management/sm-region/sm-r-new-dialog/sm-r-new-dialog.component';
import {SmRDetailsCompactComponent} from '@management/settings-management/sm-region/sm-r-details-compact/sm-r-details-compact.component';

@Component({
  selector: 'app-sm-r-list',
  templateUrl: './sm-r-list.component.html',
  styleUrls: ['./sm-r-list.component.scss']
})
export class SmRListComponent extends SmDefaultList implements OnInit {
  displayedColumns = [
    'checkbox',
    'index',
    'RegionName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _RegionDataService: RegionDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _RegionDataService, _DialogService, SmRNewDialogComponent, SmRDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }

}
