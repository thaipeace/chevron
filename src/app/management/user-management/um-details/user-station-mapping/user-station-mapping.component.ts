import {
    Component,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import {CustomerDataService} from '@shared/services/data/customer-data.service';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import * as _ from 'lodash';
import {CustomerStationUserMappingModel} from '@shared/models/data.models/customer/customer-station-user-mapping.model';

@Component({
    selector: '[app-user-station-mapping]',
    templateUrl: './user-station-mapping.component.html',
    styleUrls: ['./user-station-mapping.component.scss']
})
export class UserStationMappingComponent implements OnInit, OnDestroy {
    @Input() username: string = null;
    customerIds: string;
    selectedCustomers: string[] = [];
    associatedStations: StationModel[] = [];
    pendingStations: StationModel[] = [];
    selectedStations: StationModel[] = [];
    stations: any[] = [];
    selectedAssociatedStations: any[] = [];
    map: any;
    zoomLevel: number = 7;

    private _eventListener: any;

    constructor(
        private _CustomerDataService: CustomerDataService,
        private _StationDataService: StationDataService
    ) {
    }

    ngOnInit() {
        this._CustomerDataService.customerAllObservable
            .subscribe(rs => {
                if (rs == null) {
                    this._CustomerDataService.findAll();
                } else {
                    this.customerIds = rs
                        .map(el => {
                            return el.sysId;
                        })
                        .join(', ');
                }

                // this._StationDataService
                //   .findAllByCustomerId(this.customerIds)
                //   .then(rs => {
                //     this.pendingStations = rs;
                //     this.loadAssociatedStation();
                //   });
            });
        this._StationDataService.stationAllObservable
            .subscribe((rs) => {
                if (rs == null) {
                    this._StationDataService.findAll();
                } else {
                    this.pendingStations = rs;
                }
            });
    }

    loadAssociatedStation() {
        this._StationDataService.findAllByUsername(this.username).then(rs => {
            this.associatedStations = rs;

            if (this.pendingStations.length && this.associatedStations.length) {
                _.map(this.associatedStations, el => {
                    if (el) {
                        let found = _.find(this.pendingStations, e => {
                            if (e) {
                                return e.sysId === el.sysId;
                            }
                        });
                        if (found) {
                            this.pendingStations.splice(this.pendingStations.indexOf(found), 1);
                        }
                    }
                });
            }
            this.updateStationList();
            this.updateAssociatedStationList();
        });
    }

    associate(item: any) {
        let array: CustomerStationUserMappingModel[] = [
            new CustomerStationUserMappingModel({
                customerId: item.customerId,
                stationId: item.id,
                userName: this.username
            })
        ];
        this._StationDataService.associateStationUserMulti(array).then(() => {
            let selectedItem = this.pendingStations.find((e) => {
                return e.getId() == item.id;
            });
            this.pendingStations.splice(this.pendingStations.indexOf(selectedItem), 1);
            this.associatedStations.push(selectedItem);
            this.updateStationList();
            this.updateAssociatedStationList();
        });
    }

    disassociate(item: any) {
        this._StationDataService
            .disassociateStationUser(item.id, this.username)
            .then(() => {
                let selectedItem = this.associatedStations.find((e) => {
                    return e.getId() == item.id;
                });
                this.associatedStations.splice(this.associatedStations.indexOf(selectedItem), 1);
                this.pendingStations.push(selectedItem);
                this.updateStationList();
                this.updateAssociatedStationList();
            });
    }

    compareStation(array: StationModel[], item: StationModel) {
        return _.find(array, el => {
            return item.getId() === el.getId();
        });
    }

    ngOnDestroy() {
        if (typeof google !== 'undefined') {
            google.maps.event.removeListener(this._eventListener);
        }
    }

    onMapReady(map) {
        this.map = map;
    }

    onIdle($event) {
    }

    onMapClick($event) {
    }

    updateStationList() {
        this.stations = [];
        this.pendingStations.map(el => {
            this.stations.push({
                id: el.getId(),
                name: el.stationName,
                customerId: el.customerId
            });
        });
    }

    updateAssociatedStationList() {
        this.selectedAssociatedStations = [];
        this.associatedStations.map(el => {
            this.selectedAssociatedStations.push({
                id: el.getId(),
                name: el.stationName,
                customerId: el.customerId
            });
        });
        if (this.selectedAssociatedStations.length > 1) {
            this.zoomLevel = 4;
        } else {
            this.zoomLevel = 7;
        }
    }
}
