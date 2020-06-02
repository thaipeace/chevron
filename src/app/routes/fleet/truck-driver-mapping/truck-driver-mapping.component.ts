import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    DoCheck,
    Input,
    HostBinding,
    HostListener
} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
    CdkDragDrop,
    moveItemInArray,
    CdkDrag,
    CdkDropList,
    copyArrayItem,
    CdkDragStart
} from '@angular/cdk/drag-drop';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TruckDataService } from '@shared/services/data/truck-data.service';
import { DriverDataService } from '@shared/services/data/driver-data.service';
import { DialogService } from '@shared/services/others/dialog.service';
import { FmDriverDetailsDialogComponent } from '@app/management/fleet-management/fm-driver/fm-driver-details-dialog/fm-driver-details-dialog.component';
import { FmTruckDetailsDialogComponent } from '@app/management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import { DriverModel } from '@app/shared/models/data.models/fleet/driver.model';
import { TruckModel } from '@app/shared/models/data.models/fleet/truck.model';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import {
    TRUCK_STATUS,
    DRIVER_STATUS,
    X_BUTTON,
    NOTIFICATION_DEFAULT_DURARION
} from '@app/shared/constants/value.constant';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { TruckCompanyUserMappingModel } from '@app/shared/models/data.models/fleet/truck-company-user-mapping.model';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';

@Component({
    selector: 'app-truck-driver-mapping',
    templateUrl: './truck-driver-mapping.component.html',
    styleUrls: ['./truck-driver-mapping.component.scss']
})
export class TruckDriverMappingComponent extends DefaultComponent
    implements OnInit, OnDestroy {
    trucks: TruckModel[] = [];
    drivers: DriverModel[] = [];
    truckCompanies: TruckCompanyModel[] = [];
    displayedTrucks = [];
    displayedDrivers = [];
    truckPlates = [];
    $filterTruck = new Subject<string>();
    $filterDriver = new Subject<string>();
    $destroy = new Subject<boolean>();
    TRUCK_STATUS = TRUCK_STATUS;
    DRIVER_STATUS = DRIVER_STATUS;
    numberOfInServiceTruck: number = null;
    numberOfADriver: number = null;
    numberOfPDriver: number = null;
    searchControlTruck: FormControl = new FormControl('');
    searchControlDriver: FormControl = new FormControl('');
    MAX_DRIVER_PER_TRUCK: number = 6;
    selectedDate: Date = new Date();
    today: Date = new Date();
    currentTimestamp;
    apDisplayDrivers = [];
    isAPDriver: boolean = false;
    dragDriver: any;
    loadingPromise = null;


    constructor(
        private _TruckDataService: TruckDataService,
        private _DialogService: DialogService,
        private _DriverDataService: DriverDataService,
        private _TruckCompanyDataService: TruckCompanyDataService,
        private _snackBar: MatSnackBar,
        private _AuthenticationService: AuthenticationService
    ) {
        super();
        this.currentTimestamp = this.toStartOfDay(this.selectedDate).valueOf();

        this._TruckCompanyDataService.findAll()
            .then((truckCompanies) => {
                this.truckCompanies = truckCompanies;
                switch (this._AuthenticationService.getRole()) {
                    case DEFAULT_ROLES.ADMIN:
                        break;
                    default:
                        this._TruckCompanyDataService
                            .findUserTruckCompanyMappingByUsername(
                                this._AuthenticationService.getUsername()
                            )
                            .then(rs => {
                                this._TruckCompanyDataService.currentTruckCompanyUserMappingSource.next(
                                    rs
                                );
                            });
                }
            });

        this.addSubscribes(
            combineLatest(
                this._TruckDataService.truckAllObservable,
                this._DriverDataService.driverAllObservable,
                this._TruckCompanyDataService.currentTruckCompanyUserMappingObservable,
            ).subscribe(([trucks, drivers, truckCompanyMapping]) => {
                if (
                    trucks &&
                    trucks.length &&
                    drivers &&
                    drivers.length
                ) {
                    this.trucks = trucks;
                    this.drivers = drivers;

                    // load status
                    this.loadDriverCurrentStatus()
                        .then(() => {
                            this.loadTruckDriverMapping();
                        });

                    if (
                        truckCompanyMapping &&
                        truckCompanyMapping.length
                    ) {
                        // filter truck by company
                        const truckCompanyIds = truckCompanyMapping.map(
                            mapping => mapping.truckCompanyId
                        );
                        this.truckCompanies = !!truckCompanyIds
                            ? this.truckCompanies.filter((company: TruckCompanyModel) =>
                                truckCompanyIds.includes(company.getId())
                            )
                            : this.truckCompanies;
                        this.trucks = _.filter(this.trucks, el => {
                            return _.find(this.truckCompanies, { companyId: el.companyId });
                        });
                        this.drivers = _.filter(this.drivers, el => {
                            return _.find(this.truckCompanies, { companyId: el.companyId });
                        });
                    }

                    //    check in service truck
                    this.numberOfInServiceTruck = _.filter(this.trucks, el => {
                        return el.truckState == this.TRUCK_STATUS.IN_SERVICE;
                    }).length;

                    // collect truckplates
                    this.truckPlates = _.map(this.trucks, t => t.truckPlate);

                }
            })
        );
    }

    ngOnInit() {
        // this.$filterTruck.pipe(
        //     debounceTime(200),
        //     takeUntil(this.$destroy)
        // ).subscribe((key: string) => {
        //     this.filterTruck(key);
        // });
        //
        // this.$filterDriver.pipe(
        //     takeUntil(this.$destroy)
        // ).subscribe((key: string) => {
        //     this.filterDriver(key);
        // });
        this.addSubscribes(
            this.searchControlTruck.valueChanges
                .pipe(debounceTime(200))
                .subscribe(searchTerm => {
                    this.filterTruck(searchTerm);
                })
        );
        this.addSubscribes(
            this.searchControlDriver.valueChanges
                .pipe(debounceTime(200))
                .subscribe(searchTerm => {
                    this.filterDriver(searchTerm);
                })
        );

        // this._TruckDataService.findAllTruckDriverMapping()
        //     .then((rs) => {
        //     });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    toStartOfDay(date) {
        return moment(date).startOf('day');
    }

    toEndOfDay(date) {
        return moment(date).endOf('day');
    }

    loadDriverCurrentStatus() {
        const from = this.toStartOfDay(this.selectedDate).valueOf();
        const to = this.toEndOfDay(this.selectedDate).valueOf();
        return this._DriverDataService
            .findDriverCurrentStatus(from, to)
            .then(rs => {
                //clear drivers status
                _.map(this.drivers, driver => {
                    driver.driverStatus = null;
                });

                // check status
                _.map(rs, el => {
                    _.map(this.drivers, driver => {
                        if (el.driverId == driver.getId()) {
                            driver.driverStatus = el.driverStatus;
                        }
                    });
                });

                this.numberOfADriver = _.filter(this.drivers, {
                    driverStatus: this.DRIVER_STATUS.A
                }).length;
                this.numberOfPDriver = _.filter(this.drivers, {
                    driverStatus: this.DRIVER_STATUS.P
                }).length;
            });
    }

    loadTruckDriverMapping() {
        let ids = _.map(this.trucks, el => {
            return el.getId();
        });
        const from = this.toStartOfDay(this.selectedDate).valueOf();
        const to = this.toEndOfDay(this.selectedDate).valueOf();
        // console.log('load truck driver mapping');
        //prevent duplicate
        if (this.loadingPromise === null) {
            this.loadingPromise = this._TruckDataService
                .findAllTruckDriverMappingByTrucks(ids, from, to)
                .then(rs => {
                    this.displayedTrucks = [...this.trucks];
                    this.displayedDrivers = this.getAvailableDrivers(this.drivers);
                    // clear drivers on truck
                    _.map(this.displayedTrucks, el => {
                        el.drivers = [];
                    });

                    //check mapping
                    _.map(rs, mapping => {
                        const truck = _.find(this.displayedTrucks, t => {
                            return t.getId() == mapping.truckId;
                        });
                        const driver = _.find(this.displayedDrivers, d => {
                            return d.getId() == mapping.driverId;
                        });
                        if (!!truck && !!driver) {
                            driver.mappingObject = mapping;
                            truck.addDriver(driver);
                            this.displayedDrivers.splice(
                                this.displayedDrivers.indexOf(driver),
                                1
                            );
                        }
                    });

                    setTimeout(() => {
                        //delay 1s
                        this.loadingPromise = null;
                    }, 1000);
                });
        }

        return this.loadingPromise;
    }

    removeDriver(truck, driver) {
        this._TruckDataService
            .deleteTruckDriverMapping(
                driver.getId(),
                truck.getId(),
                driver.mappingObject.getId()
            )
            .then(rs => {
                truck.removeDriver(driver);
                this.displayedDrivers.unshift(driver);
            });
    }

    addDriver(truck, driver) {
        this._TruckDataService
            .createTruckDriverMapping(
                driver.getId(),
                truck.getId(),
                this._AuthenticationService.getUsername(),
                this.toStartOfDay(this.selectedDate).valueOf()
            )
            .then(rs => {
                if (rs) {
                    driver.mappingObject = rs;
                    truck.addDriver(driver);
                    this.displayedDrivers.splice(
                        this.displayedDrivers.indexOf(driver),
                        1
                    );
                } else {
                    this._snackBar.open('Error on mapping truck and driver', X_BUTTON, {
                        duration: NOTIFICATION_DEFAULT_DURARION
                    });
                }
            });
    }

    filterDriver(key: string) {
        key = key.trim().toLowerCase();
        this.displayedDrivers = this.getAvailableDrivers(this.drivers).filter(
            (driver: DriverModel) => driver.fullName.toLowerCase().includes(key)
        );
    }

    filterTruck(key: string) {
        key = key.trim().toLowerCase();
        this.displayedTrucks = this.trucks.filter(
            truck =>
                truck.truckPlate.toLowerCase().includes(key) ||
                truck.totalCapacity === +key ||
                // truck.status.toLowerCase().includes(key) ||
                truck.drivers.find(driver =>
                    driver.fullName.toLowerCase().includes(key)
                )
            // truck.performance.toLowerCase().includes(key)
        );
    }

    checkAvailableDriver(driver) {
        if (this.isAPDriver) {
            if (driver['driverStatus'] == 'A' || driver['driverStatus'] == 'P') {
                return true;
            }
            return false;
        }
        return true;
    }

    drop(event: CdkDragDrop<string[]>, item) {
        if (
            item.drivers.length < this.MAX_DRIVER_PER_TRUCK &&
            !item.isOutOfService()
        ) {
            this.addDriver(item, event.item.data);
        }
    }

    getAvailableDrivers(drivers: DriverModel[]): DriverModel[] {
        const result = drivers
            .filter(
                (driver: DriverModel) =>
                    !this.displayedTrucks.some((truck: TruckModel) =>
                        truck.drivers.some(d => d.sysId === driver.getId())
                    )
            )
            .sort((a, b) => (a.fullName > b.fullName ? 1 : -1));

        return result;
    }

    trackByFn(item, index) {
        return item.fullName;
    }

    openDriverDetail(item): void {
        this._DialogService.open(
            FmDriverDetailsDialogComponent,
            { id: item.getId() },
            {},
            () => {
                this.onRefresh();
            }
        );
    }

    onTruckDetails(item: any) {
        this._DialogService.open(FmTruckDetailsDialogComponent, {
            id: item.getId()
        });
    }

    changeTruckStatus(item: TruckModel, value: string) {
        if (item.truckState !== value) {
            this._TruckDataService.updateTruckStatus(item.getId(), value).then(rs => {
                this._TruckDataService.findAll();
                this._snackBar.open(
                    `Truck ${item.truckPlate}'s status is changed`,
                    X_BUTTON,
                    { duration: NOTIFICATION_DEFAULT_DURARION }
                );
            });
        }
    }

    checkNumberOfAvailableDriver(id: any) {
        return _.filter(
            this.displayedDrivers,
            ({ driverStatus, companyId }) =>
                (driverStatus === 'A' || driverStatus === 'P') && companyId === id
        ).length
            ? true
            : false;
    }

    public toggle(event: any) {
        this.isAPDriver = event.checked;
    }

    onRefresh() {
        this.displayedTrucks = [];
        this.displayedDrivers = [];
        this._TruckDataService.findAll();
    }

    onDateChange(selectedDate: Date) {
        this.selectedDate = selectedDate;
        this.onRefresh();
    }

    onDragDriver($event: CdkDragStart<any>) {
        this.dragDriver = $event.source.data;
    }

    onDragDriverRelease($event: CdkDragStart<any>) {
        this.dragDriver = null;
    }
}
