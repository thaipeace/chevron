import { Component, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_MAP } from '@shared/constants/config.constant';
import { StationDataService } from '@shared/services/data/station-data.service';
import { StationModel } from '@shared/models/data.models/station/station.model';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import { NguiMapComponent } from '@ngui/map';

@Component({
    selector: 'app-cm-map',
    templateUrl: './cm-map.component.html',
    styleUrls: ['./cm-map.component.scss']
})
export class CmMapComponent extends DefaultMapClass implements OnInit {
    center = DEFAULT_MAP.LOCATION;
    stations: StationModel[] = [];
    @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;
    marker;

    constructor(private _StationDataService: StationDataService) {
        super();
    }

    ngOnInit() {
        this.addSubscribes(this._StationDataService.stationAllObservable
            .subscribe((rs) => {
                this.stations = rs;
            }));
    }

    onRefresh() {
        this._StationDataService.findAll();
    }

    onMapReady(map) {
    }

    openLocation(marker) {
        this.marker = marker;
        this.nguiMapComponent.openInfoWindow('iw', marker);
    }

    closeDialogInfo() {
        this.nguiMapComponent.closeInfoWindow('iw');
    }
}
