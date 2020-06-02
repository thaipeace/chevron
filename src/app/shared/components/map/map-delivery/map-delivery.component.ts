import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {MapService} from '@shared/services/map.service';
import * as _ from 'lodash';
import {GeoPoint} from '@shared/models/geo-point.model';
import {DEFAULT_MAP} from '@shared/constants/config.constant';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {NguiMapComponent} from '@ngui/map';
import {MAP_INFO_WINDOWS} from '@shared/constants/map.constant';

declare const google: any;

@Component({
    selector: 'app-map-delivery',
    templateUrl: './map-delivery.component.html',
    styleUrls: ['./map-delivery.component.scss']
})
export class MapDeliveryComponent extends DefaultMapClass implements OnInit, OnChanges {
    @Input() onTransitTrucks: TruckModel[] = [];
    @Input() unloadingTrucks: TruckModel[] = [];
    @Input() selectedTrucks: TruckModel[] = [];
    @Input() currentTime: number;
    @Input() isAutoZoom: boolean = false;
    @Input() showHistoricalRoute: boolean = false;
    @Input() isGoogleRoute: boolean = false;
    @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;

    trucks: TruckModel[] = [];
    map;
    terminalLocation;
    mapLines: any[] = [];
    showStation: StationModel;
    showTruck: TruckModel;

    allPoints: any[] = [];
    allPointsOfSelectedTrucks: any[] = [];

    iwInfos = MAP_INFO_WINDOWS;

    constructor(private _MapService: MapService) {
        super();
        this.terminalLocation = new GeoPoint(DEFAULT_MAP.LOCATION.split(',')[0], DEFAULT_MAP.LOCATION.split(',')[1]);
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {onTransitTrucks, selectedTrucks, unloadingTrucks, isGoogleRoute, isAutoZoom, showHistoricalRoute} = changes;
        if (isAutoZoom && isAutoZoom.previousValue != isAutoZoom.currentValue) {
            return;
        }

        this.reset();
        if (this.currentTime) {
            if ((onTransitTrucks && onTransitTrucks.currentValue)
                || (selectedTrucks && selectedTrucks.currentValue)) {
                setTimeout(() => {
                    //prevent change date, truck not rerender
                    this.renderRoutes();
                });

            }

            if ((onTransitTrucks && !onTransitTrucks.currentValue)
                && (unloadingTrucks && !unloadingTrucks.currentValue)) {
                //reset original terminal location
                super.resetMapBounds();
                this.setBounds([this.terminalLocation]);
            }
        }


        // if (isGoogleRoute && isGoogleRoute.currentValue != null) {
        //     console.log(isGoogleRoute);
        //     this.loadDirections();
        // }

    }

    onMapReady(map: any) {
        this.map = map;
        this.renderRoutes();
    }

    reset() {
        _.map(this.mapLines, (el) => {
            super.unattachMap(el);
        });
        this.mapLines = [];
        this.allPoints = [];
        this.allPointsOfSelectedTrucks = [];
        this.trucks = [];
    }

    renderRoutes() {
        if (this.map && (this.unloadingTrucks || this.onTransitTrucks)) {
            super.resetMapBounds();

            _.map(this.unloadingTrucks, (truck) => {
                if (truck.currentLocation) {
                    this.allPoints.push(truck.currentLocation.geoPoint);
                }
                // get station location
                this._MapService.stationsToMapLocation(google, [truck.currentOrder.station], (rs) => {
                    this.allPoints.push(rs);
                    this.setBounds(this.allPoints);
                });
            });


            this.trucks = this.selectedTrucks && this.selectedTrucks.length ? [...this.selectedTrucks] : [...this.onTransitTrucks];

            _.map(this.trucks, (truck) => {
                if (truck.currentLocation) {
                    this.allPoints.push(truck.currentLocation.geoPoint);
                }
                // get station location
                this._MapService.stationsToMapLocation(google, _.map(truck.pendingOrders, (el) => el.station), (rs) => {
                    this.allPoints.push(rs);
                    this.setBounds(this.allPoints);
                });

                //render route
                this.renderTruckRoute(truck, false);
                if (this.showHistoricalRoute) {
                    this.renderTruckRoute(truck, true);
                }
            });

            console.log(this.trucks);
        }

    }

    /* loadDirections() {
         const self = this;
         if (this.isGoogleRoute) {
             _.map(this.trucks, (truck) => {
                 this._MapService.stationsToMapLocation(google, [truck.currentOrder.station], (rs) => {
                     const to = rs;
                     const currentLocation = truck.generateLastLocationByTimestamp(self.currentTime);
                     if (currentLocation) {
                         self.mapLines.push(super.renderDirection(self.map, currentLocation.geoPoint, to, () => {
                             self.setBounds([currentLocation.geoPoint, to]);
                         }));
                     }
                 });
             });
         } else {
             _.map(this.mapLines, (el) => {
                 super.unattachMap(el);
             });
         }
     }*/

    // renderUnloadingStation() {
    //     if (this.unloadingTrucks && this.unloadingTrucks.length) {
    //         const locations = _.map(this.unloadingTrucks, (el) => el.currentOrder.station.geoPoint);
    //         this.setBounds(locations);
    //     }
    // }

    renderTruckRoute(truck, isGone) {
        let locations = [];
        if (isGone) {
            locations = _.map(truck.getLocationToTimestamp(this.currentTime), (el) => el.geoPoint);
            this.mapLines.push(super.renderGoneRoute(this.map, locations));
        } else {
            locations = _.map(truck.getLocationFromTimestamp(this.currentTime), (el) => el.geoPoint);
            this.mapLines.push(super.renderGoingRoute(this.map, locations));
        }

        this.setBounds(locations);
    }

    setBounds(array = []) {
        if (this.isAutoZoom) {
            super.setMapBounds(this.map, [...array]);
        }
    }

    onStationDetails(station: StationModel) {
        console.log(station);
        this.closeDialogInfo();
        this.showStation = station;
        this.nguiMapComponent.openInfoWindow('iw-station', station.marker);
    }

    onTruckDetails(truck: TruckModel) {
        console.log(truck);
        this.closeDialogInfo();
        this.showTruck = truck;
        this.nguiMapComponent.openInfoWindow('iw-truck', truck.marker);
    }

    onCustomMarkerInit($event: any, item: TruckModel) {
        item.marker = $event;
    }

    closeDialogInfo() {
        this.nguiMapComponent.closeInfoWindow(this.iwInfos.STATION);
        this.nguiMapComponent.closeInfoWindow(this.iwInfos.TRUCK);
    }


}
