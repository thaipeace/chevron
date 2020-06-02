import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MAP_STYLES } from '@shared/constants/map.constant';
import { DefaultMapClass } from '@app/shared/models/default/default-component.model';
import { MapService } from '@app/shared/services/map.service';

@Component({
  selector: 'app-map-pickup',
  templateUrl: './map-pickup.component.html',
  styleUrls: ['./map-pickup.component.scss']
})
export class MapPickupComponent extends DefaultMapClass implements OnInit {
  styles: any = MAP_STYLES;
  map;
  marker;
  center;
  @Input() address: string;
  @Output() changeAddress = new EventEmitter<string>();

  constructor(private mapService: MapService) {
    super();
  }

  ngOnInit() {
    super.resetMapBounds();
    if (this.address) {
      this.center = this.address;
      this.mapService
        .getGeoPointByAddress(this.address)
        .subscribe(
          (data: any) => (this.marker = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng])
        );
    }
  }

  onMapClick(event) {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    if (!this.marker) {
      this.marker = [latLng.lat, latLng.lng];
    } else {
      event.target.markers[0].setPosition(latLng);
    }
    this.mapService
      .getAddressString(latLng.lat, latLng.lng)
      .subscribe(data => this.changeAddress.emit(data.results[0].formatted_address));
  }

  onMapReady(map) {
    this.map = map;
    this.ngOnInit();
  }
}
