import {Component, OnInit} from '@angular/core';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {SmTNewDialogComponent} from '@management/settings-management/sm-terminal/sm-t-new-dialog/sm-t-new-dialog.component';
import {SmTDetailsCompactComponent} from '@management/settings-management/sm-terminal/sm-t-details-compact/sm-t-details-compact.component';

@Component({
  selector: 'app-sm-t-list',
  templateUrl: './sm-t-list.component.html',
  styleUrls: ['./sm-t-list.component.scss']
})
export class SmTListComponent extends SmDefaultList {
  displayedColumns = [
    'checkbox',
    'index',
    'TerminalName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _TerminalDataService: TerminalDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _TerminalDataService, _DialogService, SmTNewDialogComponent, SmTDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }

}
