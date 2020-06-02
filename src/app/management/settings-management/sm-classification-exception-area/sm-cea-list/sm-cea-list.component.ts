import {Component, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from '@shared/services/side-bar.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {ExceptionAreaDataService} from '@shared/services/data/settings/exception-area-data.service';
import {SmCeaNewDialogComponent} from '@management/settings-management/sm-classification-exception-area/sm-cea-new-dialog/sm-cea-new-dialog.component';
import {SmCeaDetailsCompactComponent} from '@management/settings-management/sm-classification-exception-area/sm-cea-details-compact/sm-cea-details-compact.component';

@Component({
  selector: 'app-sm-cea-list',
  templateUrl: './sm-cea-list.component.html',
  styleUrls: ['./sm-cea-list.component.scss']
})
export class SmCeaListComponent extends SmDefaultList implements OnInit {
  displayedColumns = [
    'checkbox',
    'index',
    'ExceptionAreaName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _ExceptionAreaDataService: ExceptionAreaDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _ExceptionAreaDataService, _DialogService, SmCeaNewDialogComponent, SmCeaDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }
}
