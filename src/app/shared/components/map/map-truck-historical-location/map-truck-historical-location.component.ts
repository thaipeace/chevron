import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import * as _ from 'lodash';
import {GeoPoint} from '@shared/models/geo-point.model';
import {TRUCK_COLOR} from '@shared/constants/value.constant';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {NguiMapComponent} from '@ngui/map';
import {MAP_INFO_WINDOWS} from '@shared/constants/map.constant';

declare const google: any;

@Component({
    selector: 'app-map-truck-historical-location',
    templateUrl: './map-truck-historical-location.component.html',
    styleUrls: ['./map-truck-historical-location.component.scss']
})
export class MapTruckHistoricalLocationComponent extends DefaultMapClass implements OnInit, OnChanges {
    @Input() truck: TruckModel;
    @Input() events: TruckEventModel[];
    @Input() groups: any[];
    @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;

    allPoints: GeoPoint[] = [];
    map;

    iwInfos = MAP_INFO_WINDOWS;
    showEvent: TruckEventModel;

    constructor() {
        super();
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        const {groups, events} = changes;

        if (groups && groups.currentValue) {
            this.generateRoutes();
            // console.log(this.groups);
        }
        if (events && events.currentValue) {
            console.log(events.currentValue);
            this.generateRoutes();
        }
    }

    onMapReady(map) {
        this.map = map;
        this.generateRoutes();
        if (google) {
            google.maps.event.addListener(this.map, 'click', function (event) {
                console.log(`{lat: ${event.latLng.lat()}, lng: ${event.latLng.lng()}}`);
                console.log(`${event.latLng.lat()},${event.latLng.lng()}`);
            });
        }
    }

    generateRoutes() {
        if (this.map) {
            this.allPoints = [];
            _.map(this.groups, (el) => {
                el.routes = [];
                _.map(el.data, (item) => {
                    el.routes.push(item.geoPoint);
                    this.allPoints.push(item.geoPoint);
                });
                this.allPoints.push(el.startPoint);
            });

            // add one more to connect routes
            _.map(this.groups, (el, index) => {
                if (this.groups[index + 1] && this.groups[index + 1].routes.length) {
                    el.routes.push(this.groups[index + 1].routes[0]);
                }
            });

            const lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
            };

            super.resetMapBounds();

            _.map(this.groups, (el) => {
                if (el.routes && el.routes.length) {
                    new google.maps.Polyline({
                        path: el.routes,
                        strokeColor: TRUCK_COLOR.Gone,
                        icons: [{
                            icon: lineSymbol,
                            offset: '100%'
                        }],
                        map: this.map
                    });
                }
            });

            this.allPoints = _.concat(this.allPoints, _.map(this.events, (el) => el.geoPoint));

            super.setMapBounds(this.map, this.allPoints);

        }

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
