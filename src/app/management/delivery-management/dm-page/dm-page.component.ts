import {Component, OnInit} from '@angular/core';
import GasStationModel from '@app/shared/models/gas-station.model';
import {HttpClient} from '@angular/common/http';
import {TruckOilContainerModel, TruckContainer} from '@app/shared/models/truck-oil-container.model';
import * as moment from 'moment';
import * as _ from 'lodash';

import {DeliveryDataService} from '@shared/services/data/delivery-data.service';
import {SystemScheduleModel} from '@shared/models/data.models/delivery/system-schedule.model';
import {OrderDataService} from '@shared/services/data/order-data.service';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {ORDER_STATUS} from '@shared/constants/value.constant';

import {LabelType, Options} from 'ng5-slider';
import {MapService} from '@shared/services/map.service';
import {OrderStatusHistoryModel} from '@shared/models/data.models/order/order-status-history.model';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {DmHintDialogComponent} from '../dm-hint-dialog/dm-hint-dialog.component';

@Component({
    selector: 'app-dm-page',
    templateUrl: './dm-page.component.html',
    styleUrls: ['./dm-page.component.scss']
})
export class DmPageComponent implements OnInit {


    selectedFromDateTime: any;
    currentDateTime: any;
    from;
    to;

    scheduleList: SystemScheduleModel[] = [];
    orderList: OrderModel[] = [];
    truckList: TruckModel[] = [];
    truckLoadingList: TruckModel[] = [];
    truckUnloadingList: TruckModel[] = [];
    truckOnTransitList: TruckModel[] = [];
    selectedTruckList: TruckModel[] = [];

    orderStatusHistoryTMP: OrderStatusHistoryModel[];

    sliderValue: number;
    sliderOptions: Options;
    isHistory: any = false;
    isAutoZoom: boolean = true;
    showHistoricalRoute: boolean = true;

    ORDER_STATUS = ORDER_STATUS;

    constructor(private http: HttpClient,
                private _DeliveryDataService: DeliveryDataService,
                private _MapService: MapService,
                private _OrderDataService: OrderDataService,
                private _TruckDataService: TruckDataService,
                private _DialogService: DialogService
    ) {
        this.selectedFromDateTime =
            moment().toDate();
        // moment(1560655251000).add(1, 'day').subtract(7, 'hour').toDate();
        this.currentDateTime = moment().toDate();
    }

    ngOnInit() {
        this.onDateTimeChange();
    }

    onRefresh() {
        this.loadDataByDateRange();
    }

    onDateTimeChange($event: any = null) {
        if (this.selectedFromDateTime) {
            this.from = moment(this.selectedFromDateTime).startOf('day');
            this.to = moment(this.selectedFromDateTime).endOf('day');
            this.renderSlider();
            this.onRefresh();
        }
    }

    onShowHint() {
        this._DialogService.open(DmHintDialogComponent);
    }

    toggleHistory($event) {
        this.isHistory = !this.isHistory;
        if (!this.isHistory) {
            this.selectedFromDateTime = new Date();
            this.onDateTimeChange();
        }
    }

    renderSlider() {
        let dateRange: Date[] = [];
        for (let i: number = 0; i <= 1380; i++) {
            dateRange.push(moment(this.from).add(i, 'minute').toDate());
        }
        this.sliderValue = this.selectedFromDateTime.getTime();
        this.sliderOptions = {
            tickStep: 60,
            showTicks: true,
            draggableRange: false,
            stepsArray: dateRange.map((date: Date, index) => {
                return {value: date.getTime(), legend: moment(date).hour() + ''};
            }),
            translate: (value: number, label: LabelType): string => {
                return moment(value).format('YYYY-MM-DD (HH:mm)');
            },
        };

    }

    loadDataByDateRange() {
        this._DeliveryDataService.findCombinationByDateRange(this.from.valueOf(), this.to.valueOf())
            .then((rs: SystemScheduleModel[]) => {
                this.convertData(rs);
            });
    }

    convertData(data: SystemScheduleModel[]) {
        this.scheduleList = data;

        this.truckList = _.uniqBy(_.map(this.scheduleList, (el) => {
            return el.truck;
        }), (truck) => {
            return truck.getId();
        });

        this.orderList = _.uniqBy(_.map(this.scheduleList, (el) => {
            el.order.dropNumber = el.dropNumber;
            el.order.station = el.station;
            return el.order;
        }), (order) => {
            return order.getId();
        });

        this.loadOrderStatus()
            .then(() => {
                return Promise.all(
                    _.map(this.truckList, (truck) => {
                        return this.loadOnTransitTruckLocation(truck);
                    })
                );
            })
            .then(() => {
                this.generateData();
            });
    }

    loadOrderStatus() {
        this.truckLoadingList = [];
        this.truckOnTransitList = [];
        this.truckUnloadingList = [];

        return this._OrderDataService.findStatusHistoryByIds(_.map(this.orderList,
            (el) => {
                return el.getId();
            }))
            .then((rs) => {
                this.orderStatusHistoryTMP = rs;
                this.generateData();
            });

    }

    generateData() {
        this.truckLoadingList = [];
        this.truckOnTransitList = [];
        this.truckUnloadingList = [];

        //update order status
        _.map(this.orderList,
            (order) => {
                order.setOrderStatusHistory(_.filter(this.orderStatusHistoryTMP, (orderSh) => {
                    return orderSh.orderId === order.getId();
                }));
            });

        //add orders to truck
        _.map(this.truckList, (truck) => {
            truck.resetOrder();
            truck.generateLastLocationByTimestamp(this.selectedFromDateTime.getTime());
            _.map(this.scheduleList, (el) => {
                if (el.truckId === truck.getId()) {
                    truck.addOrder(_.find(this.orderList, (order) => {
                        return order.getId() === el.orderId;
                    }), this.selectedFromDateTime.getTime());
                }
            });
            switch (truck.getDeliveryStatus()) {
                case ORDER_STATUS.LOADING:
                    this.truckLoadingList.push(truck);
                    break;
                case ORDER_STATUS.UNLOADING:
                    this.truckUnloadingList.push(truck);
                    break;
                case ORDER_STATUS.ON_TRANSIT:
                    this.truckOnTransitList.push(truck);
                    break;
            }
        });

        this.truckLoadingList = [...this.truckLoadingList];
        this.truckOnTransitList = [...this.truckOnTransitList];
        this.truckUnloadingList = [...this.truckUnloadingList];
        this.selectedTruckList = _.intersectionWith(this.selectedTruckList, this.truckOnTransitList, _.isEqual);
        console.log(this.truckList);
    }

    onSliderValueChange($event: number) {
        this.selectedFromDateTime = new Date(this.sliderValue);
        this.generateData();
    }

    loadOnTransitTruckLocation(truck: TruckModel) {
        const truckTrip = _.find(this.scheduleList, (el) => el.truckId == truck.getId()).truckTrip;
        return this._TruckDataService.findHistoricalLocationByPlateNumber(truck.truckPlate, truckTrip.fromTimeStamp, truckTrip.toTimeStamp ? truckTrip.toTimeStamp : new Date().valueOf())
            .then((rs) => {
                truck.setHistoricalLocation(rs);
            });
    }


    onSelectTruckCallback($event: TruckModel[]) {
        this.selectedTruckList = [...$event];
    }

    onChangeShowHistoricalRoute($event: any) {
        this.truckLoadingList = [...this.truckLoadingList];
        this.truckOnTransitList = [...this.truckOnTransitList];
        this.truckUnloadingList = [...this.truckUnloadingList];
        this.selectedTruckList = [...this.selectedTruckList];
    }
}
