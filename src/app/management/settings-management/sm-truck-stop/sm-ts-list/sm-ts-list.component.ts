import {Component, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from '@shared/services/side-bar.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmTsDetailsCompactComponent} from '@management/settings-management/sm-truck-stop/sm-ts-details-compact/sm-ts-details-compact.component';
import {SmTsNewDialogComponent} from '@management/settings-management/sm-truck-stop/sm-ts-new-dialog/sm-ts-new-dialog.component';
import {TruckStopDataService} from '@shared/services/data/settings/truck-stop-data.service';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import * as _ from 'lodash';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';

@Component({
  selector: 'app-sm-ts-list',
  templateUrl: './sm-ts-list.component.html',
  styleUrls: ['./sm-ts-list.component.scss']
})
export class SmTsListComponent extends SmDefaultList implements OnInit {

  displayedColumns = [
    'checkbox',
    'index',
    'TruckStopName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _TruckStopDataService: TruckStopDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _TruckStopDataService, _DialogService, SmTsNewDialogComponent, SmTsDetailsCompactComponent, MpmMapSelectionDialogComponent);
  }
}
