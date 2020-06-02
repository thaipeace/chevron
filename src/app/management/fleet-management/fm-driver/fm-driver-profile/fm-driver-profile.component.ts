import {
    Component,
    OnInit,
    Input,
    SimpleChanges,
    ElementRef,
    ViewChild, Output
} from '@angular/core';
import * as moment from 'moment';

import {DriverDataService} from '@shared/services/data/driver-data.service';
import * as _ from 'lodash';
import {FmDriverPerformanceDailyDetailsDialogComponent} from '../fm-driver-performance-daily-details-dialog/fm-driver-performance-daily-details-dialog.component';
import {DialogService} from '@app/shared/services/others/dialog.service';

// import EventEmitter = NodeJS.EventEmitter;

@Component({
    selector: 'app-fm-driver-profile',
    templateUrl: './fm-driver-profile.component.html',
    styleUrls: ['./fm-driver-profile.component.scss']
})
export class FmDriverProfileComponent implements OnInit {
    @Input() sysId;
    @Input() driver;
    // @Output() onChange = new EventEmitter();
    @ViewChild('dailyDialog') el: ElementRef;
    @ViewChild('driverPerformanceTable') driverPerformanceTable: ElementRef;

    driverDialog: HTMLElement;
    driverOj: any;
    isMeridian: boolean = false;
    driverSchedule: any[] = [];
    driverTimesheet: any = null;
    driverSysId: string = '';
    displayMonth: any = moment();
    currentTime: any = moment();
    driverHourProfile: any = {
        day: moment(),
        time: {
            sleepStartTime: null,
            wakingUpTime: null,
            workingStartTime: null,
            workingEndTime: null,
            isShow: true
        }
    };
    top: number = 0;
    left: number = 0;
    bottom: number = 0;

    driverSleepingHours: any[] = [];
    driverWorkingHours: any[] = [];
    onLoading: boolean = false;

    headers: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    hourNumber: number[] = Array(24)
        .fill(0)
        .map((x, i) => i);

    status: any = {};

    private now = new Date();
    private firstDate = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        1
    );
    private lastDate = new Date(
        this.now.getFullYear(),
        this.now.getMonth() + 1,
        0
    );

    startTime: any;
    endTime: any;

    constructor(
        private _DialogService: DialogService,
        private _DriverDataService: DriverDataService
    ) {
    }

    ngOnInit() {
        this._DriverDataService.findAllStatus()
            .then(res => {
                let tmpStatus = _.orderBy(
                    res,
                    [el => el.Key.toLowerCase()],
                    ['asc']
                );
                this.status = tmpStatus.reduce((obj, item) => {
                    obj[item.Key] = item.Value;
                    return obj;
                }, {});
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {sysId, driver} = changes;
        if (!!sysId && !!sysId.currentValue) {
            this.driverSysId = sysId.currentValue;
            this.getDriverSchedule();
            this.getDialogElements();
        }

        if (!!driver && !!driver.currentValue) {
            this.driverOj = driver.currentValue;

        }
    }

    mouseIn(e, driverProfile): void {
        if (driverProfile) {
            this.pointToElement(e, driverProfile);
        }
    }

    mouseOut(e): void {
        this.el.nativeElement.style.display = 'none';
    }

    pointToElement(e, driverProfile): void {
        this.driverHourProfile = driverProfile;

        if (
            !this.checkDayHaveSleepingTime(driverProfile.hours) &&
            !this.checkDayHaveWorkingTime(driverProfile.hours) &&
            !driverProfile.status.length
        ) {
            return;
        }

        if (!this.driverDialog || !this.driverPerformanceTable) {
            return;
        }

        this.top =
            e.pageY - this.driverDialog.offsetTop <
            this.driverPerformanceTable.nativeElement.offsetHeight / 2
                ? e.pageY - this.driverDialog.offsetTop
                : e.pageY - this.driverDialog.offsetTop - 500;

        this.top = this.top < 0 ? 0 : this.top;

        this.left =
            e.pageX - this.driverDialog.offsetLeft <
            this.driverPerformanceTable.nativeElement.offsetWidth / 2
                ? e.pageX - this.driverDialog.offsetLeft + 100
                : e.pageX - this.driverDialog.offsetLeft - 500;
        this.left = this.left < 0 ? 0 : this.left;
        this.el.nativeElement.style.display = 'block';
    }

    converseTime(timestamp: string) {
        return new Date(parseInt(timestamp)).toLocaleString();
    }

    getWeeksInMonth(firstDate: string, lastDate: string) {
        this.firstDate = new Date(
            this.now.getFullYear(),
            this.now.getMonth(),
            1
        );
        this.lastDate = new Date(
            this.now.getFullYear(),
            this.now.getMonth() + 1,
            0
        );
        let selectedYear = moment(this.firstDate, 'MM-DD-YYYY').year();
        let startWeek = moment(this.firstDate, 'MM-DD-YYYY').week();
        let endWeek = moment(this.lastDate, 'MM-DD-YYYY').week();
        if (endWeek == 1) {
            endWeek = moment().weeksInYear() + 1;
        }

        let calendar = [];
        for (var week = startWeek; week <= endWeek; week++) {
            calendar.push({
                week: week,
                days: Array(7)
                    .fill(0)
                    .map((n, i) => {
                        let day = moment(`${selectedYear}0101`, 'YYYYMMDD')
                            .week(week)
                            .startOf('week')
                            .clone()
                            .add(n + i, 'day');
                        return {
                            day: day,
                            label: `${day.date()}-${day.month() + 1}`,
                            hours: this.getHours(day),
                            status: '',
                            sleepingTimeInRange: [],
                            workingTimeInRange: []
                        };
                    })
            });
        }

        return calendar;
    }

    getHours(date: moment.Moment) {
        let dateObj = new Date(date.valueOf());
        let hours = [];
        for (let i = 1; i < 24; i++) {
            dateObj.setMinutes(5);
            let timeObj = {
                stime: dateObj.valueOf(),
                etime: dateObj.valueOf(),
                isSleeping: false,
                isWorking: false
            };
            dateObj.setMinutes(59);
            timeObj.etime = dateObj.valueOf();
            hours.push(timeObj);
            dateObj.setHours(i);
        }
        return hours;
    }

    checkDayHaveSleepingTime(hours) {
        return hours.find(x => x.isSleeping);
    }

    checkDayHaveWorkingTime(hours) {
        return hours.find(x => x.isWorking);
    }

    getSleepingHours() {
        this._DriverDataService
            .findDriverSleepingTimeByTimeRange(
                this.driverSysId,
                this.startTime.day.valueOf(),
                this.endTime.day.valueOf()
            )
            .then(sleepingHours => {
                this.driverSleepingHours = [...sleepingHours];
                this.getWorkingHours();
            });
    }

    getWorkingHours() {
        return this._DriverDataService
            .findDriverWorkingTimeByTimeRange(
                this.driverSysId,
                this.startTime.day.valueOf(),
                this.endTime.day.valueOf()
            )
            .then(workingHours => {
                this.driverWorkingHours = [...workingHours];
                this.getDriverStatuses();
            });
    }

    getDriverStatuses() {
        return this._DriverDataService
            .findDriverStatusTimeByTimeRange(
                this.driverSysId,
                this.startTime.day.valueOf(),
                this.endTime.day.valueOf()
            )
            .then(driverProfiles => {
                this.driverSchedule.map(e => {
                    e.days.map(day => {
                        day.hours.map(hour => {
                            let startDate = day.day.startOf('day').valueOf();
                            let endDate = day.day.endOf('day').valueOf();
                            this.driverSleepingHours.map(el => {
                                let sleepStartTime = el.DriverSleepingHours.sleepStartTime.valueOf();
                                let wakingUpTime = el.DriverSleepingHours.wakingUpTime.valueOf();

                                if (
                                    (el.DriverSleepingHours.sleepStartTime >=
                                        hour.stime && el.DriverSleepingHours.sleepStartTime <=
                                        hour.etime) ||
                                    (el.DriverSleepingHours.sleepStartTime <=
                                        hour.stime && el.DriverSleepingHours.wakingUpTime >=
                                        hour.etime) ||
                                    (el.DriverSleepingHours.wakingUpTime >=
                                        hour.stime && el.DriverSleepingHours.wakingUpTime <=
                                        hour.etime)
                                ) {
                                    hour.isSleeping = true;
                                }

                                if (
                                    (sleepStartTime >=
                                        startDate && sleepStartTime <=
                                        endDate) ||
                                    (wakingUpTime >=
                                        startDate && wakingUpTime <=
                                        endDate)
                                ) {
                                    if (
                                        day.sleepingTimeInRange.indexOf(
                                            el.DriverSleepingHours
                                        ) < 0
                                    ) {
                                        day.sleepingTimeInRange.push(
                                            el.DriverSleepingHours
                                        );
                                    }
                                }
                            });
                            this.driverWorkingHours.map(el => {
                                let workingStartTime = parseInt(el.DriverWorkingHours.workingStartTime.valueOf());
                                let workingEndTime = parseInt(el.DriverWorkingHours.workingEndTime.valueOf());
                                if (
                                    (
                                        el.DriverWorkingHours.workingStartTime >=
                                        hour.stime && el.DriverWorkingHours.workingStartTime <=
                                        hour.etime
                                    ) ||
                                    (
                                        el.DriverWorkingHours.workingStartTime <=
                                        hour.stime && el.DriverWorkingHours.workingEndTime >=
                                        hour.etime
                                    ) ||
                                    (
                                        el.DriverWorkingHours.workingEndTime >=
                                        hour.stime && el.DriverWorkingHours.workingEndTime <=
                                        hour.etime
                                    )
                                ) {
                                    hour.isWorking = true;
                                }

                                if (
                                    (workingStartTime >=
                                        startDate && workingStartTime <=
                                        endDate) ||
                                    (workingEndTime >=
                                        startDate && workingEndTime <=
                                        endDate)
                                ) {
                                    if (
                                        day.workingTimeInRange.indexOf(
                                            el.DriverWorkingHours
                                        ) < 0
                                    ) {
                                        day.workingTimeInRange.push(
                                            el.DriverWorkingHours
                                        );
                                    }
                                }
                            });
                        });
                        driverProfiles.map(e => {
                            if (e.profileDate >= day.day.startOf('day') && e.profileDate <= day.day.endOf('day')) {
                                day.status = e.driverStatus;
                                day.profileDate = moment(parseInt(e.profileDate));
                            }
                        });

                    });
                });
            })
            .finally(() => {
                this.onLoading = false;
            });
    }

    getDriverSchedule() {
        this.driverSchedule = this.getWeeksInMonth(
            this.firstDate.valueOf().toString(),
            this.lastDate.valueOf().toString()
        );
        this.startTime = this.driverSchedule[0].days[0];
        this.endTime = this.driverSchedule
            .slice(-1)
            .pop()
            .days.slice(-1)
            .pop();

        this.getSleepingHours();
    }

    switchMonth(isNext: boolean) {
        if (isNext) {
            this.now.setMonth(this.now.getMonth() + 1);
            this.displayMonth.add(1, 'M');
        } else {
            this.now.setMonth(this.now.getMonth() - 1);
            this.displayMonth.subtract(1, 'M');
        }

        this.firstDate = new Date(
            this.now.getFullYear(),
            this.now.getMonth(),
            1
        );
        this.lastDate = new Date(
            this.now.getFullYear(),
            this.now.getMonth() + 1,
            0
        );

        this.getDriverSchedule();
    }

    openDriverProfileDailyDialog(profileDate = null) {
        this._DialogService.open(
            FmDriverPerformanceDailyDetailsDialogComponent,
            {
                driverProfile: this.driverHourProfile,
                driverSysId: this.driverSysId,
                profileDate: profileDate,
                status: this.status,
                driverSleepingHours: this.driverSleepingHours,
                driverWorkingHours: this.driverWorkingHours
            },
            {},
            () => {
                this.onLoading = true;
                this.getDriverSchedule();
            }
        );
    }

    getDialogElements() {
        this.driverDialog = <HTMLElement>(
            document.getElementById('driverDetailDialog')
        );
        if (!this.driverDialog) {
            this.driverDialog = <HTMLElement>(
                document.getElementById('tree-view-panel')
            );
        }
    }

    checkLeaveStatus(status) {
        if ('U, RD, EL , MC , L '.indexOf(status) > 1) {
            return true;
        }
        return false;
    }
}
