import { Injectable } from '@angular/core';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { GeoPoint } from '@shared/models/geo-point.model';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private YOUR_API_KEY = 'AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug';

  constructor(private http: HttpClient) {}

  stationsToMapLocation(google, stations: StationModel[], callback) {
    _.map(stations, el => {
      if (el.geoPoint && el.geoPoint.hasPosition()) {
        callback(el.geoPoint);
      } else {
        this.addressToGeoPoint(google, el.streetAddress, (rs: GeoPoint) => {
          if (rs) {
            el.geoPoint = rs;
          }
          callback(rs);
        });
      }
    });
  }

  addressToGeoPoint(google, address, callback) {
    new google.maps.Geocoder().geocode({ address: address }, function(results, status) {
      if (status === 'OK') {
        callback(new GeoPoint(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
      } else {
        callback(null);
      }
    });
  }

  getAddressString(lat: number, lng: number): Observable<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.YOUR_API_KEY}`
    );
  }

  getGeoPointByAddress(address: string) {
    address = address.replace(' ', '+');
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.YOUR_API_KEY}`
    );
  }
}
