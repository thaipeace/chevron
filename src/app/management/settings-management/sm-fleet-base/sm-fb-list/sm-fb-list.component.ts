import {Component, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from '@shared/services/side-bar.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmFbNewDialogComponent} from '@management/settings-management/sm-fleet-base/sm-fb-new-dialog/sm-fb-new-dialog.component';
import {SmFbDetailsCompactComponent} from '@management/settings-management/sm-fleet-base/sm-fb-details-compact/sm-fb-details-compact.component';
import {FleetBaseDataService} from '@shared/services/data/settings/fleet-base-data.service';
import {MpmMapSelectionDialogComponent} from '@app/management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';

@Component({
  selector: 'app-sm-fb-list',
  templateUrl: './sm-fb-list.component.html',
  styleUrls: ['./sm-fb-list.component.scss']
})
export class SmFbListComponent extends SmDefaultList implements OnInit {
  displayedColumns = [
    'checkbox',
    'index',
    'FleetBaseName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _FleetBaseDataService: FleetBaseDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _FleetBaseDataService, _DialogService, SmFbNewDialogComponent, SmFbDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }

}
