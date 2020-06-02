import {EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialogRef} from '@angular/material';
import {MAP_STYLES} from '@shared/constants/map.constant';
import {DEFAULT_MAP} from '@shared/constants/config.constant';
import {TRUCK_COLOR} from '@shared/constants/value.constant';
import {ResizeService} from '@shared/services/resize.service';
import {GeoPoint} from '@shared/models/geo-point.model';
import * as _ from 'lodash';

export class DefaultComponent implements OnDestroy {
  @Output() onPromise: EventEmitter<any> = new EventEmitter<any>();
  _subscriptionList: Subscription;
  _promises: Promise<any>[] = [];

  constructor() {
    this.unsubscribeAll();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    if (this._subscriptionList) {
      this._subscriptionList.unsubscribe();
    }
    this._subscriptionList = new Subscription();

  }

  addSubscribes(...subscriptions) {
    subscriptions.forEach((el) => {
      this._subscriptionList.add(el);
    });
  }

  addPromises(...promises) {
    promises.forEach((el) => {
      this._promises.push(el);
    });

    this.onPromise.emit(Promise.all(this._promises).then(() => {
      this._promises = [];
    }));
  }

}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export interface IDialogComponent {
  DEFAULT_WIDTH: number;
}

export class DefaultDialogComponent extends DefaultComponent {

  constructor(public dialogRef: MatDialogRef<any>) {
    super();
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onOk() {
    this.dialogRef.close(true);
  }
}

export class DefaultChartComponent extends DefaultComponent {
  constructor() {
    super();
    ResizeService.init();
  }

  onResize(callback = () => {
  }) {
    ResizeService.addEvent(callback);
  }
}

declare const google: any;

export class DefaultMapClass extends DefaultComponent {
  DEFAULT_ZOOM = 13;
  styles: any = MAP_STYLES;
  center: any = DEFAULT_MAP.LOCATION;
  zoom: any = this.DEFAULT_ZOOM;
  bounds: any;
  google;

  constructor() {
    super();
    // this.google = google;
    this.resetMapBounds();
  }

  resetMapBounds() {
    if (typeof google !== 'undefined') {
      this.bounds = new google.maps.LatLngBounds();
    }
  }

  setMapBounds(map, points: any[] = [], minZoom: number = null) {
    if (!(!!map && points.length)) {
      return;
    }
    const self = this;
    if (!self.bounds) {
      this.resetMapBounds();
    }
    if (typeof google !== 'undefined' && map) {
      for (let i = 0; i < points.length; i++) {
        if (points[i]) {
          self.bounds.extend(points[i]);
        }
      }
      map.fitBounds(self.bounds);
      let listener = google.maps.event.addListener(map, 'idle', function () {
        //TODO tmp disabled, nam, 12/02/2019
        // if (map.getZoom() > self.DEFAULT_ZOOM) {
        //   map.setZoom(self.DEFAULT_ZOOM);
        // }
        if (minZoom && map.getZoom() > minZoom) {
          map.setZoom(minZoom);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }

  renderDirection(map, from, to, callback = () => {
  }, obj = null) {
    if (obj) {
      obj.setMap(null);
    }
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay =
      new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: TRUCK_COLOR.GOING,
          strokeOpacity: 1.0,
          strokeWeight: 3
        },
        suppressMarkers: true,
        preserveViewport: true
      });
    directionsDisplay.setMap(map);
    directionsService.route({
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode['DRIVING']
    }, function (response, status) {
      if (status === google.maps.DirectionsStatus['OK']) {
        directionsDisplay.setDirections(response);
        callback();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    return directionsDisplay;
  }

  renderGoneRoute(map, data) {
    return new google.maps.Polyline({
      path: data,
      strokeColor: TRUCK_COLOR.Gone,
      strokeWeight: 3,
      map: map
    });
  }

  renderGoingRoute(map, data) {
    return new google.maps.Polyline({
      path: data,
      strokeColor: TRUCK_COLOR.GOING,
      strokeWeight: 3,
      map: map
    });
  }

  unattachMap(el) {
    if (el) {
      el.setMap(null);
    }
  }

  getCenterOfArray(points: GeoPoint[] = []): GeoPoint {
    if (!points.length) {
      return null;
    }
    const bounds = new google.maps.LatLngBounds();
    _.map(points, el => bounds.extend(el));
    // console.log(bounds.getCenter());
    const center = bounds.getCenter();
    // console.log(new GeoPoint(center.lat(), center.lng()));
    return new GeoPoint(center.lat(), center.lng());
  }
}
