import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TruckHistoricalLocationModel} from '@shared/models/data.models/fleet/truck-historical-location.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {DialogService} from '@shared/services/others/dialog.service';
import {FmTruckEventDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-event-details-dialog/fm-truck-event-details-dialog.component';
import {FmTruckLocationsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-locations-dialog/fm-truck-locations-dialog.component';
import {TRUCK_DEFAUTLS} from '@app/shared/constants/value.constant';
import {ToastService} from '@shared/services/others/toast.service';
import {BsDaterangepickerDirective} from 'ngx-bootstrap';

@Component({
    selector: 'app-fm-truck-historical-location',
    templateUrl: './fm-truck-historical-location.component.html',
    styleUrls: ['./fm-truck-historical-location.component.scss']
})

export class FmTruckHistoricalLocationComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(BsDaterangepickerDirective) drp: BsDaterangepickerDirective;
    @Input() truck: TruckModel;
    locations: TruckHistoricalLocationModel[] = [];
    events: TruckEventModel[] = [];
    eventTableData: MatTableDataSource<TruckEventModel>;
    dateRange: Date[] = [new Date(), new Date()];
    map: any;
    station;
    groups = [];

    // tableData: MatTableDataSource<TruckEventModel>;
    displayedColumns = ['index', 'EventType', 'description', 'GeoPoint', 'startTime', 'actions'];

    groupingTypes = [{
        name: 'Hours',
        value: 'hour'
    }, {
        name: 'Days',
        value: 'day'
    }];
    selectedGroupingTypes: moment.unitOfTime.DurationConstructor = 'day';
    groupingTypesValue = 1;

    constructor(private _TruckDataService: TruckDataService,
                private _ToastService: ToastService,
                private _DialogService: DialogService) {
    }

    ngOnInit() {
        this.dateRange = [
            moment().subtract(TRUCK_DEFAUTLS.DEFAULT_HISTORY_DATA_BY_DAY, 'day').toDate(),
            moment().toDate()
        ];
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {truck} = changes;

        if (!!truck && !!truck.currentValue) {
            this.load();
        }
    }

    generateEventData(events: TruckEventModel[]) {
        // let currentEvents = events;
        events = this.events.map((u, index) => {
            u.index = (index + 1).toString();
            return u;
        });
        this.eventTableData = new MatTableDataSource(events);
        // this.eventTableData.paginator = this.paginator;
        return this.eventTableData;
    }

    load() {
        if (this.truck && this.truck.truckPlate) {
            this._TruckDataService.findHistoricalLocationByPlateNumber(this.truck.truckPlate
                , this.dateRange[0].getTime(), this.dateRange[1].getTime())
                .then((rs) => {
                    this._TruckDataService.findEventByDateRange(this.truck.truckPlate
                        , this.dateRange[0].getTime(), this.dateRange[1].getTime())
                        .then((events) => {
                            this.locations = _.orderBy(rs, (el) => {
                                return el.getRawValue('readingTime');
                            }, ['asc']);
                            this.events = _.orderBy(events, (el) => {
                                return el.getRawValue('startTime');
                            }, ['asc']);
                            this.convertData(this.locations, this.events);
                        });
                });

        }
    }

    ngOnDestroy() {
    }

    onMapReady(map) {
        this.map = map;
    }

    onIdle($event) {
    }

    onMapClick(event) {
    }

    onDateChange(selectedDates: Date[]) {
      const tmp = [moment(this.dateRange[0]).toDate(),moment(this.dateRange[1]).toDate()];
      if(moment(selectedDates[1]).diff(moment(selectedDates[0]), 'days') <=3){
        this.dateRange = selectedDates;
        this.load();
      }else{
        console.log(this.drp);
        this._ToastService.openSimple('Allow to select maximum 3 days of data');
        this.dateRange = tmp;
        setTimeout(()=>{
          this.drp.show();
        });
      }

    }

    convertData(data, events) {
        this.groups = [...this.generateGroupData(data, data, events)];

        // check if any event do not push to group yet
        let groupedEvents = _.concat(..._.map(this.groups, (el) => el['events']));
        if (groupedEvents.length !== events.length) {
            let remainingEvents = _.differenceBy(events, groupedEvents, (el) => el.getId());
            this.groups = [...this.groups, ...this.generateGroupData(remainingEvents, [], remainingEvents)];
        }
        this.groups = _.sortBy(this.groups, (el) => el['from'].valueOf());
        _.map(this.groups, (el, index) => {
            el['index'] = index + 1;
        });
    }

    generateGroupData(data, locations, events) {
        let group = null;
        let groupArray = [];
        _.map(data, (el) => {
            const timestamp = el.timestamp;
            if (!(group && timestamp >= group['from'].valueOf() && timestamp <= group['to'].valueOf())) {
                let time = moment(timestamp);
                time.startOf(this.selectedGroupingTypes);
                group = {
                    index: 0,
                    isCollapsed: true,
                    from: time,
                    to: moment(time)
                        .add(this.groupingTypesValue, this.selectedGroupingTypes)
                        .subtract('second', 1),
                    data: [],
                    events: [],
                    fromLabel: '',
                    toLabel: '',
                    startPoint: el.geoPoint
                };
                group['fromLabel'] = group.from.format('YYYY-MM-DD (HH:mm)');
                group['toLabel'] = group.to.format('YYYY-MM-DD (HH:mm)');
                group['events'] = _.filter(events, (event) => {
                    return event.timestamp >= group['from'].valueOf() && event.timestamp <= group['to'].valueOf();
                });
                group['data'] = _.filter(locations, (location) => {
                    return location.timestamp >= group['from'].valueOf() && location.timestamp <= group['to'].valueOf();
                });
                groupArray.push(group);
            }
        });
        return groupArray;
    }

    onRefresh() {
        this.load();
    }

    onEventDetails(event: TruckEventModel) {
        this._DialogService.open(FmTruckEventDetailsDialogComponent,
            {event});
    }

    onGroupDetails(group) {
        this._DialogService.open(FmTruckLocationsDialogComponent, {locations: group.data, truck: this.truck});
    }

    toggleAllRows(array: any[], isCollapsed: boolean) {
        _.map(array, (el) => {
            el['isCollapsed'] = isCollapsed;
        });
    }

    changeGroupingType($event) {
        this.convertData(this.locations, this.events);
    }

}
