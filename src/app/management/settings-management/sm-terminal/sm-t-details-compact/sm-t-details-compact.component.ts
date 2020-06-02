import {Component, OnInit} from '@angular/core';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';

@Component({
  selector: 'app-sm-t-details-compact',
  templateUrl: './sm-t-details-compact.component.html',
  styleUrls: ['./sm-t-details-compact.component.scss']
})
export class SmTDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['TerminalName', 'Description', 'Latitude', 'Longitude', 'Altitude'];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _TerminalDataService: TerminalDataService) {
    super(_DialogService, _SideBarService, _TerminalDataService);
  }
}
