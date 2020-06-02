import {Component, OnInit} from '@angular/core';
import {SmDefaultList} from '@management/settings-management/sm-class/sm-default-list.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {SupplyPointDataService} from '@shared/services/data/settings/supply-point-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {MpmMapSelectionDialogComponent} from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {SmSpNewDialogComponent} from '@management/settings-management/sm-supply-point/sm-sp-new-dialog/sm-sp-new-dialog.component';
import {SmSpDetailsCompactComponent} from '@management/settings-management/sm-supply-point/sm-sp-details-compact/sm-sp-details-compact.component';

@Component({
  selector: 'app-sm-sp-list',
  templateUrl: './sm-sp-list.component.html',
  styleUrls: ['./sm-sp-list.component.scss']
})
export class SmSpListComponent extends SmDefaultList implements OnInit {
  displayedColumns = [
    'checkbox',
    'index',
    'SupplyPointName',
    'Created',
    'Modified',
    'actions'
  ];

  constructor(public _SideBarService: SideBarService,
              public _SupplyPointDataService: SupplyPointDataService,
              public _DialogService: DialogService) {
    super(_SideBarService, _SupplyPointDataService, _DialogService, SmSpNewDialogComponent, SmSpDetailsCompactComponent, MpmMapSelectionDialogComponent);

  }
}
