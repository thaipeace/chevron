import { Component, OnInit } from '@angular/core';
import { SmDefaultList } from '@management/settings-management/sm-class/sm-default-list.class';
import { SideBarService } from '@shared/services/side-bar.service';
import { DialogService } from '@shared/services/others/dialog.service';
import { MpmMapSelectionDialogComponent } from '@management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import { DeliveryPointGroupDataService } from '@shared/services/data/settings/delivery-point-group-data.service';
import { SmDpgNewDialogComponent } from '@management/settings-management/sm-delivery-point-group/sm-dpg-new-dialog/sm-dpg-new-dialog.component';
import { SmDpgDetailsCompactComponent } from '@management/settings-management/sm-delivery-point-group/sm-dpg-details-compact/sm-dpg-details-compact.component';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';

@Component({
  selector: 'app-sm-dpg-list',
  templateUrl: './sm-dpg-list.component.html',
  styleUrls: ['./sm-dpg-list.component.scss']
})
export class SmDpgListComponent extends SmDefaultList {
  displayedColumns = [
    'checkbox',
    'index',
    'DeliveryPointGroupName',
    'Created',
    'Modified',
    'actions'
  ];

  stations: StationModel[] = [];
  

  constructor(
    public _SideBarService: SideBarService,
    public _DeliveryPointGroupDataService: DeliveryPointGroupDataService,
    public _DialogService: DialogService,
    private _StationDataService: StationDataService
  ) {
    super(_SideBarService, _DeliveryPointGroupDataService, _DialogService, SmDpgNewDialogComponent, SmDpgDetailsCompactComponent, MpmMapSelectionDialogComponent);
  }

  onMapSelected() {
    this.stations.length = 0;
    this._StationDataService.stationAllObservable.subscribe(res => {
      let stations = res;
      console.log(this.selectedArray);
      this.selectedArray.forEach(item => {
        item.stations = [];
        item.coordinates.forEach(coor => {
          let station = stations.find(s => JSON.stringify(coor) === JSON.stringify(s.geoPoint));
          if (station) {
            item.stations.push(station);
            this.stations.push(station);
          }
        });
      })
      this._DialogService.open(this._SelectedMapComponent, {groups: this.selectedArray, isNotBorder: true, stations: this.stations});
    });
  }

}
