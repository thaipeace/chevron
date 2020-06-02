import { Component, OnInit } from "@angular/core";
import { StationModel } from "@shared/models/data.models/station/station.model";
import { StationDataService } from "@shared/services/data/station-data.service";

@Component({
  selector: "app-order-page",
  templateUrl: "./order-page.component.html",
  styleUrls: ["./order-page.component.scss"]
})
export class OrderPageComponent implements OnInit {
  stations: StationModel[] = [];

  constructor(private _StationDataService: StationDataService) {}

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.stations = rs;
      }
    });
  }
}
