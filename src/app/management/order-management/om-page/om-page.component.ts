import {Component, OnInit} from '@angular/core';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {AuthenticationService} from '@app/user-management/shared/services';

@Component({
  selector: 'app-om-page',
  templateUrl: './om-page.component.html',
  styleUrls: ['./om-page.component.scss']
})
export class OmPageComponent implements OnInit {
  stations: StationModel[] = [];

  constructor(
    private _StationDataService: StationDataService) {
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.stations = rs;
      }
    });
    this._StationDataService.findAll();
  }
}
