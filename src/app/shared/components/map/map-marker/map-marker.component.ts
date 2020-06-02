import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MAP_INFO_WINDOWS, MAP_STYLES} from '@shared/constants/map.constant';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {MapService} from '@shared/services/map.service';
import * as _ from 'lodash';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {NguiMapComponent} from '@ngui/map';

declare const google: any;

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent extends DefaultMapClass implements OnInit, OnChanges {
  @Input() stations: StationModel[] = [];
  @Input() events: TruckEventModel[] = [];
  @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;

  map;
  styles: any = MAP_STYLES;
  stationMarkers;
  bounds;

  iwInfos = MAP_INFO_WINDOWS;
  showEvent: TruckEventModel;
  readonly MIN_ZOOM = 15;

  constructor(private _MapService: MapService) {
    super();
  }

  ngOnInit() {
    super.resetMapBounds();
    if (this.stations && this.stations.length) {
      this.renderStationMarkers(this.stations);
    }
    if (this.events && this.events.length) {
      console.log(this.events);
      _.map(this.events, (el) => {
        super.setMapBounds(this.map, [el.geoPoint], this.MIN_ZOOM);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let {stations, eventMarkers} = changes;

    if ((stations && stations.currentValue) || (eventMarkers && eventMarkers.currentValue)) {
      this.ngOnInit();
    }
  }

  onMapReady(map) {
    this.map = map;
    this.ngOnInit();
  }

  renderStationMarkers(stations: StationModel[]) {
    _.map(this.stationMarkers ? [...this.stationMarkers] : [], (el) => {
      //clear marker
      el.setMap(null);
    });
    this.stationMarkers = [];
    this._MapService.stationsToMapLocation(google, stations, (rs) => {
      this.renderMarker(rs);
    });
  }

  renderMarker(position: GeoPoint) {
    if (!this.center) {
      this.center = position;
    }
    const marker = new google.maps.Marker({
      map: this.map,
      position: position
    });
    super.setMapBounds(this.map, [position], this.MIN_ZOOM);
    this.stationMarkers.push(marker);
  }

  onCustomMarkerInit($event: any, item: any) {
    item.marker = $event;
  }

  onEventDetails(event: TruckEventModel) {
    console.log(event);
    this.closeDialogInfo();
    this.showEvent = event;
    this.nguiMapComponent.openInfoWindow(this.iwInfos.EVENT, event.marker);
  }

  closeDialogInfo() {
    this.nguiMapComponent.closeInfoWindow(this.iwInfos.EVENT);
  }
}
