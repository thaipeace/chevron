import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {SystemScheduleModel} from '@shared/models/data.models/delivery/system-schedule.model';
import {OrderDataService} from '@shared/services/data/order-data.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {OrderStatusHistoryModel} from '@shared/models/data.models/order/order-status-history.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {DEFAULT_MAP} from '@shared/constants/config.constant';
import {MapService} from '@shared/services/map.service';
import * as _ from 'lodash';
import {TRUCK_COLOR} from '@shared/constants/value.constant';

@Component({
    selector: 'app-map-order-tracking',
    templateUrl: './map-order-tracking.component.html',
    styleUrls: ['./map-order-tracking.component.scss']
})
export class MapOrderTrackingComponent extends DefaultMapClass implements OnInit, OnChanges {
    @Input() order: OrderModel;
    @Input() systemSchedule: SystemScheduleModel;
    @Input() orderStatusHistory: OrderStatusHistoryModel[];

    station: StationModel;
    truck: TruckModel;
    routes: GeoPoint[] = [];

    from: GeoPoint;
    current: GeoPoint;
    to: GeoPoint;

    currentLocation;
    directionsDisplay;

    map;
    tmp = [{lat: 4.081234522075324, lng: 101.30573632148366},
        {lat: 3.7113035978909084, lng: 101.48289086249929},
        {lat: 3.289119953858808, lng: 101.54880883124929}];

    constructor(private _OrderDataService: OrderDataService,
                private _TruckDataService: TruckDataService,
                private _MapService: MapService) {
        super();
        this.from = new GeoPoint(DEFAULT_MAP.LOCATION.split(',')[0], DEFAULT_MAP.LOCATION.split(',')[1]);
        this.current = this.from;
        this.currentLocation = this.current.toArray();
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {order, systemSchedule, orderStatusHistory} = changes;
        if ((order && order.currentValue) || (systemSchedule && systemSchedule.currentValue)
            || (orderStatusHistory && orderStatusHistory.currentValue)) {
            this.load();
        }
    }

    onMapReady(map: any) {
        this.map = map;
        this.load();
    }

    load() {
        if (this.map) {
            // console.log(this.order);
            // console.log(this.systemSchedule);
            // console.log(this.orderStatusHistory);
            if (this.order && this.order.station) {
                this.station = this.order.station;
                this._MapService.stationsToMapLocation(google, [this.station], (rs) => {
                    this.to = rs;
                    this.renderRoutes();
                });
            }
            if (this.systemSchedule && this.systemSchedule.truck && this.orderStatusHistory && this.orderStatusHistory.length) {
                this.truck = this.systemSchedule.truck;
                let fromDateTime = _.minBy(this.orderStatusHistory, (el) => el.timestamp).timestamp;
                let toDateTime = _.maxBy(this.orderStatusHistory, (el) => el.timestamp).timestamp;

                this.routes = [];
                this._TruckDataService.findHistoricalLocationByPlateNumber(this.truck.truckPlate, fromDateTime, toDateTime)
                    .then((rs) => {
                        // console.log(rs);
                        if (rs.length) {
                            _.map(rs, (el) => {
                                this.routes.unshift(el.geoPoint);
                            });
                            this.current = this.routes[this.routes.length - 1];
                            this.currentLocation = this.current.toArray();
                        }
                        this.renderRoutes();
                    });
            }

        }
    }

    renderRoutes() {
        const self = this;

        if (this.routes && this.routes.length) {
            new google.maps.Polyline({
                path: this.routes,
                strokeColor: TRUCK_COLOR.Gone,
                strokeWeight: 3,
                map: this.map
            });
            this.setBounds();
        }

        if (this.current && this.to) {
            this.directionsDisplay = super.renderDirection(this.map, this.current, this.to, () => {
                self.setBounds();
            }, this.directionsDisplay);
        }

    }

    setBounds() {
        super.resetMapBounds();
        super.setMapBounds(this.map, [...this.routes, this.from, this.current, this.to]);
    }
}
