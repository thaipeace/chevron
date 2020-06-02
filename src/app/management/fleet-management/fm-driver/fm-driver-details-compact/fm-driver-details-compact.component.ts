import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {DriverDataService} from '@shared/services/data/driver-data.service';
import {DriverModel} from '@shared/models/data.models/fleet/driver.model';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {DriverProfileModel} from '@shared/models/data.models/fleet/driver-profile.model';
import {DriverStatus} from '@shared/models/data.models/fleet/driver-status.model';
import {DriverSleepingHoursModel} from '@shared/models/data.models/fleet/driver-sleeping-hours.model';
import {DriverWorkingHoursModel} from '@shared/models/data.models/fleet/driver-working-hours.model';
import {TQLFormData} from '@shared/models/default/default-object.model';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {FmDriverDetailsDialogComponent} from '@management/fleet-management/fm-driver/fm-driver-details-dialog/fm-driver-details-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';

@Component({
    selector: 'app-fm-driver-details-compact',
    templateUrl: './fm-driver-details-compact.component.html',
    styleUrls: ['./fm-driver-details-compact.component.scss']
})
export class FmDriverDetailsCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
    @Input() data;
    control: SideBarControl = null;
    id;// = 'NUAXMQRBAAAKYHYTM3Z23HWR';
    weekDay = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    grids: any[];
    currentTime = moment();
    today = moment();
    driver: DriverModel;
    selectedGrid;
    driverStatuses: DriverStatus[];
    sleepingHours: any[] = [];
    workingHours: any[] = [];
    promise;
    view: string = 'tab1';

    constructor(private _DriverDataService: DriverDataService,
                private _DialogService: DialogService,
                private _SideBarService: SideBarService) {
        super();
        this.generateCalendar(this.currentTime);//help UI look better, nam
        this.addSubscribes(this._SideBarService.refreshObservable
            .subscribe((rs) => {
                if (rs) {
                    this.refresh();
                }
            }));
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.onDataChange();
    }

    onDataChange() {
        if (this.data && this.data['control']) {
            this.control = this.data['control'];
        }
        if (this.data && this.data['id']) {
            this.id = this.data['id'];
            this.refresh();
        }
    }

    onDetails() {
        this._DialogService.open(FmDriverDetailsDialogComponent, {
            id: this.driver.getId(),
            driverId: this.driver.chevronDriverId,
            index: 1
        }, {}, () => {
            this._SideBarService.refresh();
        });
    }

    loadDriverProfile() {
        return this._DriverDataService.findDriverStatusTimeByTimeRange(
            this.id,
            this.currentTime.startOf('month').valueOf(),
            this.currentTime.endOf('month').valueOf()
        )
            .then((rs) => {
                _.map(rs, (profile) => {
                    const found = _.find(this.grids, (grid) => {
                        return TimeGrid.isSame(grid.time, moment(profile.profileDate));
                    });
                    if (typeof found !== 'undefined') {
                        found.setProfile(this.driverStatuses, profile);
                    }
                });
            });
    }

    getSleepingHours() {
        return this._DriverDataService
            .findDriverSleepingTimeByTimeRange(
                this.id,
                this.currentTime.startOf('month').valueOf(),
                this.currentTime.endOf('month').valueOf()
            )
            .then(rs => {
                this.sleepingHours = _.map(rs, (el) => {
                    return new DriverSleepingHoursModel(el.DriverSleepingHours);
                });
            });
    }

    getWorkingHours() {
        return this._DriverDataService
            .findDriverWorkingTimeByTimeRange(
                this.id,
                this.currentTime.startOf('month').valueOf(),
                this.currentTime.endOf('month').valueOf()
            )
            .then(rs => {
                this.workingHours = _.map(rs, (el) => {
                    return new DriverWorkingHoursModel(el.DriverWorkingHours);
                });
            });
    }

    generateCalendar(time) {
        this.grids = [];

        const startDate = moment(time).startOf('month');
        startDate.subtract(startDate.day(), 'day');
        const tomorrow = moment().add(1, 'day');
        for (let i = 0; i < 42; i++) {
            let grid = new TimeGrid(moment(startDate));
            this.grids.push(grid);
            if (typeof this.selectedGrid === 'undefined' || this.selectedGrid === null) {
                if (TimeGrid.isSame(grid.time, tomorrow)) {
                    this.selectedGrid = grid;
                }
            } else {
                if (TimeGrid.isSame(grid.time, this.selectedGrid.time)) {
                    this.selectedGrid = grid;
                }
            }
            startDate.add(1, 'day');
        }

        //fix for next, previous month
        if (typeof this.selectedGrid === 'undefined' || this.selectedGrid === null) {
            this.selectedGrid = this.grids[this.grids.length / 2];
        }
    }

    nextMonth() {
        this.currentTime.add(1, 'month');
        this.generateCalendar(this.currentTime);
        this.selectedGrid = null;
        this.refresh();
    }

    previousMonth() {
        this.currentTime.subtract(1, 'month');
        this.generateCalendar(this.currentTime);
        this.selectedGrid = null;
        this.refresh();
    }

    refresh() {
        this.promise = this._DriverDataService.findAllStatus()
            .then((rs) => {
                this.driverStatuses = rs;
                return this._DriverDataService.findById(this.id)
                    .then((rs) => {
                        this.driver = rs;
                        return this.loadProfile();
                    });
            });
    }

    loadProfile() {
        this.generateCalendar(this.currentTime);
        return Promise.all([
            this.loadDriverProfile(),
            this.getSleepingHours(),
            this.getWorkingHours(),
        ]).then(() => {
            this.selectGrid(this.selectedGrid);
        });
    }

    convertDriverStatus(driverStatus: any) {
        const found = _.find(this.driverStatuses, (el) => {
            return el.Key === driverStatus;
        });
        return typeof found !== 'undefined' ? found['Value'] : 'status';
    }

    selectGrid(item: any) {
        if (typeof item === 'undefined') {
            return;
        }
        this.selectedGrid = item;
        const sleepingArray = [];
        const workingArray = [];
        const startTime = moment(this.selectedGrid.time).startOf('day').valueOf();
        const endTime = moment(this.selectedGrid.time).endOf('day').valueOf();
        _.map(this.sleepingHours, (el) => {
            if ((el.sleepStartTime < startTime && el.wakingUpTime < startTime) || (el.sleepStartTime > endTime && el.wakingUpTime > endTime)) {
                //    do nothing
            } else {
                sleepingArray.push(el);
            }
        });
        _.map(this.workingHours, (el) => {
            if ((el.workingStartTime < startTime && el.workingEndTime < startTime) || (el.workingStartTime > endTime && el.workingEndTime > endTime)) {
                //    do nothing
            } else {
                workingArray.push(el);
            }
        });

        this.selectedGrid.setSleepTime(sleepingArray);
        this.selectedGrid.setWorkTime(workingArray);

    }

    updateStatus(status, grid) {
        const payloadData = new TQLFormData();

        payloadData.setValue('driverId', this.id);
        payloadData.setValue('status', status);
        payloadData.setValue('profileDate', moment(grid.time).startOf('day').valueOf());

        if (grid.profile) {
            if (status === grid.profile.driverStatus) {
                //both statuses are same, delete current status
                this.deleteProfileStatus(grid.profile);
                return;
            }
            //update
            payloadData.setValue('profileDate', grid.profile.profileDate);
            this.promise = this._DriverDataService.updateDriverStatus(payloadData);
        } else {
            //create
            payloadData.setValue('profileDate', moment(grid.time).startOf('day').valueOf());
            this.promise = this._DriverDataService.createDriverStatus(payloadData);
        }

        this.promise.then(() => {
            this.loadProfile();
        });
    }

    close() {
        this.control.fn_close();
    }

    deleteProfileStatus(profile: DriverProfileModel) {
        const formData = DriverProfileModel.getFormData();
        formData.setValue('sysId', profile.getId());
        this.promise = this._DriverDataService.deleteProfileStatus(formData);
        this.promise.then((rs) => {
            if (rs[0]) {
                this.loadProfile();
            } else {
                console.log(rs);
            }
        });
    }
}

class TimeGrid {
    label;
    time;
    current = false;
    profile: DriverProfileModel;
    statusLong;
    sleepingHours;
    sleepingBoxes;
    workingHours;
    workingBoxes;

    constructor(time) {
        this.time = time;
        this.label = time.date();
        if (TimeGrid.isSame(this.time, moment())) {
            this.current = true;
        }
    }

    setProfile(statuses: DriverStatus[], profile: DriverProfileModel) {
        this.profile = profile;
        const found = _.find(statuses, (el) => {
            return el.Key === profile.driverStatus;
        });
        this.statusLong = typeof found !== 'undefined' ? found['Value'] : 'status';
    }

    setSleepTime(data: any[]) {
        if (data && data.length) {
            this.sleepingHours = data;
            this.sleepingBoxes = [];
            _.map(this.sleepingHours, (el) => {
                this.sleepingBoxes.push({
                    start: (moment(el.sleepStartTime).hours() + moment(el.sleepStartTime).minutes() / 60.0) / 24.0 * 100,
                    end: (moment(el.wakingUpTime).hours() + moment(el.wakingUpTime).minutes() / 60.0) / 24.0 * 100,
                });
            });
        }
    }

    setWorkTime(data: any[]) {
        if (data && data.length) {
            this.workingHours = data;
            this.workingBoxes = [];
            _.map(this.workingHours, (el) => {
                this.workingBoxes.push({
                    start: (moment(el.workingStartTime).hours() + moment(el.workingStartTime).minutes() / 60.0) / 24.0 * 100,
                    end: (moment(el.workingEndTime).hours() + moment(el.workingEndTime).minutes() / 60.0) / 24.0 * 100,
                });
            });
        }
    }


    static isSame(time1, time2) {
        return time1.isSame(time2, 'day')
            && time1.isSame(time2, 'month')
            && time1.isSame(time2, 'year');
    }
}
