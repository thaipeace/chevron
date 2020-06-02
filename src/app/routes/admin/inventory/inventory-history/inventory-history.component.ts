import {Component, OnInit} from '@angular/core';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {StationDataService} from '@shared/services/data/station-data.service';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.scss']
})
export class InventoryHistoryComponent implements OnInit {
  stations: StationModel[] = [];

  constructor(private _StationDataService: StationDataService) {

  }

  ngOnInit() {
    this._StationDataService.stationAllObservable
      .subscribe((rs) => {
        if (rs === null) {
          this._StationDataService.findAll();
        } else {
          this.stations = rs;
        }
      });
  }

}
