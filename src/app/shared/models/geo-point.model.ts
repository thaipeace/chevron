export class GeoPoint {
  public lat: any;
  public lng: any;

  constructor(lat: any = null, lng: any = null) {
    this.lat = parseFloat(lat);
    this.lng = parseFloat(lng);
  }

  getLat() {
    return this.lat;
  }

  getLng() {
    return this.lng;
  }

  hasPosition() {
    return this.lat !== null && this.lng !== null && !isNaN(this.lat) && !isNaN(this.lng);
  }

  toArray() {
    return [this.getLat(), this.getLng()];
  }

  toPoint() {
    return {lat: this.getLat(), lng: this.getLng()};
  }

  toString() {
    return `${this.getLat()}, ${this.getLng()}`;
  }

  toQueryString() {
    return `<geoPoint>
              <latitude>${this.getLat()}</latitude>
              <longitude>${this.getLng()}</longitude>
            </geoPoint>`;
  }

  toSettingQueryString() {
    return `<geofencePoint>
              <latitude>${this.getLat()}</latitude>
              <longitude>${this.getLng()}</longitude>
            </geofencePoint>`;
  }

  clone() {
    return new GeoPoint(this.lat, this.lng);
  }
}
