import { Component, Input, OnInit } from '@angular/core';
import { TimeItemModel } from '@shared/models/time-item.model';
import { InventoryDataService } from '@shared/services/data/inventory-data.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DynamicItem } from '@shared/models/dynamic-item.class';
import { SideBarService } from '@shared/services/side-bar.service';
import { DmWindowsDetailsCompactComponent } from '@management/delivery-management/dm-windows-details-compact/dm-windows-details-compact.component';
import { DialogService } from '@shared/services/others/dialog.service';
import { DmWindowsNewDialogComponent } from '@management/delivery-management/dm-windows-new-dialog/dm-windows-new-dialog.component';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { DeliveryDataService } from '@shared/services/data/delivery-data.service';
import { DeliveryWindowModel } from '@shared/models/data.models/delivery/delivery-window.model';
import { COLOR_CODE } from '@shared/constants/color.constant';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';

@Component({
  selector: 'app-dm-windows',
  templateUrl: './dm-windows.component.html',
  styleUrls: ['./dm-windows.component.scss']
})
export class DmWindowsComponent extends DefaultComponent implements OnInit {
  @Input() readonly: boolean;
  @Input() station: StationModel;
  groups: DeliveryWindowModel[] = [];
  timeRange: TimeItemModel[];
  selectedTimePeriod: any;
  chartData;
  selectedItem;

  SIDE_COMPACT_CONTAINER: string = 'delivery-window-details-container';

  showMax: boolean = false;
  rawData: any;

  periods: any[] = [
    {
      name: 'Trailing 24 Hours',
      value: 1,
    },
    {
      name: 'Trailing 48 Hours',
      value: 2,
    },
    {
      name: 'Trailing Week',
      value: 3,
    },
    {
      name: 'Trailing Month (= 31 days)',
      value: 4,
    },
    {
      name: 'Trailing Year',
      value: 5,
    }
  ];

  selectedDate: any = new Date();

  constructor(
    private _InventoryDataService: InventoryDataService,
    private _SideBarService: SideBarService,
    private _DialogService: DialogService,
    private _DeliveryDataService: DeliveryDataService
  ) {
    super();
    this.timeRange = [];
    for (let i = 1; i < 25; i++) {
      this.timeRange.push(new TimeItemModel(i));
    }

    this.addSubscribes(this._SideBarService.statusObservable.subscribe((rs) => {
      if (rs.status === SideBarService.STATUSES.CLOSE) {
        if (rs.destination === this.SIDE_COMPACT_CONTAINER) {
          this.selectedItem = null;
        }
      }
    }));

    this.addSubscribes(this._SideBarService.refreshObservable.subscribe((rs) => {
      if (rs === 'deliveryWindow') {
        this.onRefresh();
      }
    }));
  }

  loadChart() {
    if (!this.station) return;
    this._DeliveryDataService.findAllActiveDeliveryWindowsByStation(this.station.getId(),
      moment(this.selectedDate).startOf('month').valueOf(), moment(this.selectedDate).endOf('month').valueOf())
      .then((rs) => {
        this.rawData = rs;
        this.renderChart(this.rawData);
      });
  }

  renderChart(rs) {
    if (!rs || !rs.length) {
      this.chartData = null;
      return;
    }
    const data = this.massageData(rs);
    let arraySlot = [];
    _.map(data, (el) => {
      arraySlot = arraySlot.concat(el.array);
    });
    arraySlot = _.orderBy(arraySlot, (el) => el.startTime.valueOf());
    // console.log(arraySlot);
    const deliveryData = [];
    const maxData = [];
    const startTime = moment().startOf('day');
    const total = _.sumBy(arraySlot, (el) => el.object.count);
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < arraySlot.length; j++) {
        if (arraySlot[j].startTime.valueOf() <= startTime.valueOf() && arraySlot[j].endTime.valueOf() >= startTime.valueOf()) {
          deliveryData.push([startTime.valueOf(), arraySlot[j].object.count / total * 100.0]);
          maxData.push([startTime.valueOf(), arraySlot[j].object.max]);
          break;
        } else {
          if (j === arraySlot.length - 1) {
            deliveryData.push([startTime.valueOf(), 0]);
            maxData.push([startTime.valueOf(), 0]);
          }
        }
      }
      startTime.add(1, 'hour');
    }

    const dataArray = [{
      name: 'Number of Deliveries',
      data: deliveryData,
      color: COLOR_CODE.TURQUOISE_MEDIUM
    }];

    if (this.showMax) {
      dataArray.push({
        name: 'Max Deliveries Threshold',
        data: maxData,
        color: COLOR_CODE.METER.DANGER
      });
    }

    this.chartData = {
      container: 'chart-delivery-window',
      unit: '',
      data: dataArray,
      categories: [],
      currentTimePoint: 0
    };
  }

  ngOnInit() {
    this.onRefresh();
    // TODO
    this.selectedTimePeriod = this.periods[0].value;
  }

  loadData() {
    if (this.station) {
      this._DeliveryDataService.findAllActiveDeliveryWindowsByStation(this.station.getId(),
        moment(this.selectedDate).startOf('day').valueOf(), moment(this.selectedDate).endOf('day').valueOf())
        .then((rs) => {
          this.groups = this.massageData(rs);
        });
    }

  }

  massageData(data) {
    _.map(data, (el) => {
      let startTimeInHours: any = moment(parseInt(el.getRawValue('startTime')));
      startTimeInHours = startTimeInHours.hours() + startTimeInHours.minutes() / 60;
      let endTimeInHours: any = moment(parseInt(el.getRawValue('endTime')));
      endTimeInHours = endTimeInHours.hours() + endTimeInHours.minutes() / 60;
      const startTime = moment(moment().startOf('day').valueOf() + startTimeInHours * 60 * 60 * 1000);
      const endTime = moment(moment().startOf('day').valueOf() + endTimeInHours * 60 * 60 * 1000);

      if (startTimeInHours < endTimeInHours) {
        el.array = [{
          'name': el.getValue('DeliveryWindowName'),
          'object': el,
          'startTime': startTime,
          'endTime': endTime,
          'start': startTimeInHours * 100,
          'end': endTimeInHours * 100,
        }];
      } else {
        //overnight, create 2 box time
        // 1 hour is 100px, 1 minute is 100/60 px
        el.array = [{
          'name': el.getValue('DeliveryWindowName'),
          'object': el,
          'startTime': moment().startOf('day'),
          'endTime': endTime,
          'start': 0,
          'end': endTimeInHours * 100,
        }, {
          'name': el.getValue('DeliveryWindowName'),
          'object': el,
          'startTime': startTime,
          'endTime': moment().endOf('day'),
          'start': startTimeInHours * 100,
          'end': 24 * 100,
        }];
      }
    });
    return data;
  }

  onNew() {
    this._DialogService.open(DmWindowsNewDialogComponent, { station: this.station }, {},
      (rs) => {
        if (rs) {
          this.onRefresh();
        }
      });
  }

  onRefresh() {
    this.loadData();
    this.loadChart();
  }

  onTimePeriodChange($event: any) {
  }

  openDetails(item) {
    this.selectedItem = item;
    this._SideBarService.open(new DynamicItem(DmWindowsDetailsCompactComponent, {
      containerId: this.SIDE_COMPACT_CONTAINER,
      data: item,
      id: item.getId()
    }));
  }

  prevDay() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'days').toDate();
    this.onRefresh();
  }

  nextDay() {
    this.selectedDate = moment(this.selectedDate).add(1, 'days').toDate();
    this.onRefresh();
  }

  onTimeChange($event: any) {
    // console.log($event);
    // console.log(this.selectedDate);
    this.onRefresh();
  }
}
