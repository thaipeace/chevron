import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TruckHistoricalLocationModel} from '@shared/models/data.models/fleet/truck-historical-location.model';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import {FmTruckEventDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-event-details-dialog/fm-truck-event-details-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';
import {BsDaterangepickerDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {ToastService} from '@shared/services/others/toast.service';
import {TRUCK_DEFAUTLS} from '@shared/constants/value.constant';

@Component({
    selector: 'app-fm-truck-event-list',
    templateUrl: './fm-truck-event-list.component.html',
    styleUrls: ['./fm-truck-event-list.component.scss']
})
export class FmTruckEventListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() truck: TruckModel;
    @ViewChild(BsDaterangepickerDirective) drp: BsDaterangepickerDirective;
    locations: TruckEventModel[] = [];
    dateRange: Date[] = [new Date(), new Date()];
    map: any;
    station;

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
            this.onRefresh();
        }
    }

    load() {
        if (this.truck && this.truck.truckPlate) {
            this._TruckDataService.findEventByDateRange(this.truck.truckPlate
                , this.dateRange[0].getTime(), this.dateRange[1].getTime())
                .then((rs) => {
                    this.locations = rs;
                    console.log(rs);
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
        this.onRefresh();
      }else{
        console.log(this.drp);
        this._ToastService.openSimple('Allow to select maximum 3 days of data');
        this.dateRange = tmp;
        setTimeout(()=>{
          this.drp.show();
        });

      }

    }

    onEventDetails(event: TruckEventModel) {
        this._DialogService.open(FmTruckEventDetailsDialogComponent,
            {event});
    }

    onRefresh() {
        this.load();
    }
}
