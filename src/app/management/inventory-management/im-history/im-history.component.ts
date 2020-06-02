import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {IHashObject} from '@app/shared/models/interfaces/generic-types.interface';
import {ListViewMode} from '@app/shared/models/interfaces/view-mode.interface';
import {IChartColumnLineDailyModel} from '@app/shared/components/charts/chart-column-line-daily/chart-column-line-daily.model';
import {CustomerService} from '@app/shared/services/customer.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {UtilsService} from '@app/shared/services/utils.service';
import {StationProductHistory} from '@app/shared/models/data.models/station/station-product-history';
import {DialogService} from '@shared/services/others/dialog.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {PaginatorModel} from '@shared/components/paginator-custom/paginator-custom.component';
import {InventoryDataService} from '@shared/services/data/inventory-data.service';
import {StationProductInventoryHistoryModel} from '@shared/models/data.models/inventory/station-product-inventory-history.model';

@Component({
    selector: 'app-im-history',
    templateUrl: './im-history.component.html',
    styleUrls: ['./im-history.component.scss']
})
export class ImHistoryComponent implements OnInit, OnChanges {
    @Input() stations: OrderModel[] = [];
    inventoryFilterDate: Date[];
    inventoryStationControl = new FormControl();
    // stations: CustomerStationModel[];
    dicStationName: IHashObject<string>;
    inventoryByStation: IHashObject<any>;
    expansionInventoryGroupByStation: IHashObject<IHashObject<boolean>>;
    selectedStationIds: string[] = [];
    currentSelectedStationIds: string[] = [];
    currentViewMode = ListViewMode.Grid;
    viewModeEnum = ListViewMode;

    inventoryChartDataByStation: IHashObject<IChartColumnLineDailyModel>;
    DATE_RANGE_IN_DAY = 7;
    STATION_PAGE_SIZE = 5;
    HISTORY_PAGE_SIZE = 5;
    stationPaginator: PaginatorModel;
    data: any;

    constructor(
        private _customerService: CustomerService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _DialogService: DialogService,
        private _InventoryDataService: InventoryDataService
    ) {
        const today = moment().toDate();
        this.inventoryFilterDate = [
            moment(today).subtract(this.DATE_RANGE_IN_DAY, 'days').toDate(),
            today,
        ];
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        const array: string[] = [];
        this.dicStationName = {};
        console.log(this.stations);
        if (this.stations && this.stations.length && this.stations[0]) {
            this.stations = _.orderBy(this.stations, (el) => {
                return el.stationName;
            });

            _.map(this.stations, (el) => {
                array.push(el.getId());
                this.dicStationName[el.getId()] = el.stationName;
            });

            this.selectedStationIds = array;
            if (this.selectedStationIds.length) {
                this.stationPaginator = new PaginatorModel(this.selectedStationIds.length, this.STATION_PAGE_SIZE);
                this.onRefresh();
            }
        }
    }

    onInventoryDateChange(selectedDates: Date[]) {
        if (!!selectedDates && !!this.stations && !!this.selectedStationIds) {
            this.inventoryFilterDate = selectedDates;
            this.onRefresh();
        }
    }

    changeViewMode(mode: ListViewMode) {
        this.currentViewMode = mode;
    }

    async loadHistoryInventory(stationIds: string[]) {
        if (!stationIds.length) {
            return;
        }
        // console.log("load data");
        const startDate = moment(this.inventoryFilterDate[0]).startOf('day').valueOf();
        const endDate = moment(this.inventoryFilterDate[1]).endOf('day').valueOf();

        const result = await this._customerService.getHistoryInventoryByMultipleStation(stationIds, startDate, endDate);

        const dataGroupByStationId = UtilsService.groupBy(result, 'stationId');
        this.inventoryByStation = {};
        this.inventoryChartDataByStation = {};
        this.expansionInventoryGroupByStation = {};
        Object.keys(dataGroupByStationId).forEach((stationId: string) => {
            const inventories: StationProductHistory[] = dataGroupByStationId[stationId];
            if (!!inventories && inventories.length > 0) {
                if (!!stationId) {
                    this.expansionInventoryGroupByStation[stationId] = {
                        isExpand: true,
                    };
                    const groupByReadingTime = UtilsService.groupBy(inventories, 'readingTime');
                    const readingTimeArray = Object.keys(groupByReadingTime).sort().reverse();
                    this.inventoryByStation[stationId] = {
                        keys: readingTimeArray,
                        pagination: {
                            currentPage: 0,
                            pageSize: 5,
                            total: readingTimeArray.length
                        }
                    };

                    const columns = [];
                    const category = readingTimeArray;
                    readingTimeArray.forEach(readingTime => {
                        const inventoryData = groupByReadingTime[readingTime].sort((a, b) => UtilsService.sortByNameFn(b, a, 'productCode'));
                        this.inventoryByStation[stationId][readingTime] = inventoryData;
                        const groupByCode = UtilsService.groupBy(inventoryData, 'productCode');
                        Object.keys(groupByCode).forEach(productCode => {
                            const item = groupByCode[productCode][0];
                            const totalQuantity = UtilsService.calcTotalValueByProperty(groupByCode[productCode], 'totalQuantity');
                            const existedData = columns.find(c => c.name === item.productCode);
                            if (!!existedData) {
                                existedData.data.push(totalQuantity);
                            } else {
                                columns.push({
                                    name: item.productCode,
                                    data: [totalQuantity],
                                    color: this.getColorByProductCode(item.productCode)
                                });
                            }
                        });
                    });
                    this.inventoryChartDataByStation[stationId] = {
                        columns: columns,
                        spLine: null,
                        category: category
                    };
                } else {
                    const message = 'No data found';
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    this.inventoryByStation = {};
                    this.expansionInventoryGroupByStation = {};
                }
            } else {
                const message = 'No data found';
                this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                this.inventoryByStation = {};
                this.inventoryChartDataByStation = {};
                this.expansionInventoryGroupByStation = {};
            }
        });
    }

    toggleStationRows(stationIds: string[], isExpand) {
        stationIds.forEach((stationId: string) => {
            if (!!this.expansionInventoryGroupByStation[stationId]) {
                this.expansionInventoryGroupByStation[stationId].isExpand = isExpand;
            }
        });
    }

    getPageList(pagination: any) {
        return new Array(Math.ceil(pagination.total / pagination.pageSize));
    }

    getDisplayedItem(array: any[], pagination) {
        const displayedItems = array.slice(pagination.pageSize * pagination.currentPage, pagination.pageSize * (pagination.currentPage + 1));
        return displayedItems;
    }

    getCurrentPageInfo(pagination: any) {
        const startIndex = pagination.pageSize * pagination.currentPage;
        const endIndex = startIndex + pagination.pageSize;
        const total = pagination.total;
        return `${total === 0 ? 0 : startIndex + 1} - ${endIndex > total ? total : endIndex} of ${total}`;
    }

    getProductCodeClass(productCode: string) {
        return productCode.toLowerCase();
    }

    isEmpty() {
        return !!this.inventoryByStation && UtilsService.isEmptyObj(this.inventoryByStation);
    }

    getColorByProductCode(productCode: string): string {
        switch (productCode) {
            case 'Euro4-97':
                return '#ff5d6a';
            case 'Premium-95':
                return '#ffe600';
            case 'B10-Diesel':
            case 'Diesel-C':
                return '#c19669';
            case 'Euro5-B7':
                return '#2496c9';
            default:
                return '#fff';
        }
    }

    onStationDetails(id) {
        this._DialogService.open(CmStationDetailsDialogComponent, {
            id: id,
            readonly: false,
        });
    }

    onStationSelectionChange(newV: any) {
        this.selectedStationIds = newV;
        this.stationPaginator = new PaginatorModel(this.selectedStationIds.length, this.STATION_PAGE_SIZE);
    }

    onRefresh() {
        this.loadHistoryInventory(this.currentSelectedStationIds);
    }

    async loadInventoryHistoryByStations(stationIds: string[], dates: Date[]) {
        if (!stationIds.length || !dates.length) {
            return {};
        }
        const result: any = {};
        const startDate = moment(dates[0]).startOf('day').valueOf();
        const endDate = moment(dates[1]).endOf('day').valueOf();
        await Promise.all(_.map(stationIds, async (stationId) => {
            const object = new HistoryObject(stationId);
            // await this.countInventoryHistoryByStation(object, startDate, endDate);
            await this.loadInventoryHistoryByStation(object, startDate, endDate);
            result[stationId] = object;
        }));
        return result;
    }

    countInventoryHistoryByStation(object: HistoryObject, startDate: number, endDate: number) {
        return this._InventoryDataService.countHistoricalInventoryOfStation(object.stationId, startDate, endDate)
            .then((count) => {
                object.paginator = new PaginatorModel(count, this.HISTORY_PAGE_SIZE);
                return object;
            });
    }

    loadInventoryHistoryByStation(object: HistoryObject, startDate: number, endDate: number) {
        // const currentIndexs = object.paginator.getCurrentIndexs();
        // return this._InventoryDataService.findHistoricalInventoryOfStation(object.stationId, startDate, endDate, currentIndexs[0], currentIndexs.length)
        return this._InventoryDataService.findHistoricalInventoryOfStation(object.stationId, startDate, endDate)
            .then((rs) => {
                object.data = rs;
                return object;
            });
    }

    onGroupPaginationChange($event: any) {
        // console.log($event);
        this.currentSelectedStationIds = _.pullAt(_.clone(this.selectedStationIds), $event);
        // console.log(this.currentSelectedStationIds);
        //TODO, fix after talk with Kislay about grouping on api, nam
        this.onRefresh();
        // this.loadInventoryHistoryByStations(this.currentSelectedStationIds, this.inventoryFilterDate)
        //     .then((rs) => {
        //         console.log(rs);
        //         this.data = rs;
        //     });
    }
}

class HistoryObject {
    paginator: PaginatorModel;
    stationId: string;
    data: StationProductInventoryHistoryModel[];

    constructor(stationId: string, paginator: PaginatorModel = null) {
        this.paginator = paginator;
        this.stationId = stationId;
    }

    setData(data: StationProductInventoryHistoryModel[]) {

    }
}
