import {Component} from '@angular/core';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {TruckStopDataService} from '@shared/services/data/settings/truck-stop-data.service';

@Component({
  selector: 'app-sm-ts-details-compact',
  templateUrl: './sm-ts-details-compact.component.html',
  styleUrls: ['./sm-ts-details-compact.component.scss']
})
export class SmTsDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['TruckStopName', 'Description'];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _TruckStopDataService: TruckStopDataService) {
    super(_DialogService, _SideBarService, _TruckStopDataService);
  }
}
