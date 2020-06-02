import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {SideBarService} from '@shared/services/side-bar.service';
import {TimeItemModel} from '@shared/models/time-item.model';

@Component({
  selector: 'app-sm-truck-schedule-chart',
  templateUrl: './sm-truck-schedule-chart.component.html',
  styleUrls: ['./sm-truck-schedule-chart.component.scss']
})
export class SmTruckScheduleChartComponent implements OnInit, OnChanges {
  @Input() schedules: any[];
  @Input() selectedDate: any;
  @Output() onSelectTrip = new EventEmitter();

  groups: any[];
  timeRange: TimeItemModel[];
  sortAsc = null;
  selectedTrip;

  // selectedTruckPlate;

  constructor(private _SideBarService: SideBarService) {
    this.timeRange = [];
    for (let i = 1; i < 25; i++) {
      this.timeRange.push(new TimeItemModel(i));
    }

    this._SideBarService.statusObservable.subscribe((el) => {
      if (el.status === SideBarService.STATUSES.CLOSE) {
        this.selectedTrip = null;
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const {schedules} = changes;
    if (schedules && schedules.currentValue) {
      this.convertData();
    }
  }

  toggleSort() {
    if (this.sortAsc === null) {
      this.sortAsc = true;
    } else {
      this.sortAsc = !this.sortAsc;
    }
    this.onSort(this.sortAsc);
  }

  onSort(asc) {
    this.groups = _.orderBy(this.groups, (el) => {
      return el.name;
    }, asc ? 'asc' : 'desc');
  }

  convertData() {
    console.log(this.schedules);
    let tmpGroups = [];
    const startDateTime = moment(this.selectedDate).startOf('day');
    const endDateTime = moment(this.selectedDate).startOf('day');
    _.map(_.groupBy(this.schedules, (el) => {
      return el.TruckPlate;
    }), (array, key) => {
      const schedules = [];
      _.map(array, (el) => {
        schedules.push(el['ScheduleDetails']['Schedule']);
      });
      tmpGroups.push({
        name: key,
        array: array,
        schedules: schedules
      });
    });
    //TODO need to fix, nam

    // this.massageChart(tmpGroups);
    _.map(tmpGroups, (obj) => {
      _.map(obj.array, (el, index) => {
        if (!(!!el) || !el['ScheduleTimeFrom'] || !el['ScheduleDetails'] || !el['ScheduleDetails']['Schedule'] || !el['ScheduleDetails']['Schedule'].length) {
          obj.array.splice(index, 1);
          return;
        }
        el['chart'] = {
          start: 0,
          end: 0,
          startTime: moment(parseInt(el['ScheduleTimeFrom'])),
          //TODO need to fix later, nam
          endTime: moment(parseInt(el['ScheduleDetails']['Schedule'][0]['ScheduleTime'])),
          drops: el['ScheduleDetails']['Schedule']
        };

        let differentFrom = el['chart']['startTime'].diff(startDateTime, 'minutes');
        differentFrom = _.max([differentFrom, 0]);
        let differentTo = el['chart']['endTime'].diff(startDateTime, 'minutes');
        differentTo = _.min([differentTo, 24 * 60]);
        // 1 hour is 100px, 1 minute is 100/60 px
        el['chart']['start'] = differentFrom * 100 / 60;
        el['chart']['end'] = differentTo * 100 / 60;
      });
    });

    this.groups = [];

    _.map(tmpGroups, (value, index) => {
      if (value && value.array.length) {
        this.groups.push(value);
        tmpGroups.splice(index, 1);
      }
    });

    this.groups = this.groups.concat(tmpGroups);
    this.sortAsc = null;
    console.log(this.groups);
  }

  /*massageChart(groups) {
    const startDateTime = moment(this.selectedDate).startOf('day');
    const endDateTime = moment(this.selectedDate).startOf('day');
    console.log(groups);
    _.map(groups, (obj) => {
      _.map(obj.schedules, (el, index) => {
        if (!el['fixedscheduledTimeFrom'] && !el['fixedestimatedTime']) {
          obj.schedules.splice(index, 1);
          return;
        }
        el['chart'] = {
          start: 0,
          end: 0,
          startTime: moment(el['fixedscheduledTimeFrom']),
          endTime: moment(el['fixedestimatedTime']),
        };

        let differentFrom = el['chart']['startTime'].diff(startDateTime, 'minutes');
        differentFrom = _.max([differentFrom, 0]);
        let differentTo = el['chart']['endTime'].diff(startDateTime, 'minutes');
        differentTo = _.min([differentTo, 24 * 60]);
        // 1 hour is 100px, 1 minute is 100/60 px
        el['chart']['start'] = differentFrom * 100 / 60;
        el['chart']['end'] = differentTo * 100 / 60;
      });
    });
  }*/

  openCompact(trip: any) {
    this.selectedTrip = trip;
    this.onSelectTrip.emit(trip);
    /*this.selectedTruckPlate = truckPlate;
    const schedules = _.filter(this.schedules, (el) => {
        return this.selectedTruckPlate === el.truck.truckPlate;
    });
    this._SideBarService.open(new DynamicItem(SmTruckScheduleCompactComponent
        , {array: schedules, selectedStation: stationName}));*/
  }

}

