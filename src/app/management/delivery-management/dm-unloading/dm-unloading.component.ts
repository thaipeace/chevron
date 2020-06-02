import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {GET_COLOR_BY_PRODUCTCODE, PRODUCT_CODE} from '@shared/constants/value.constant';
import {FmTruckDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {OmOrderDetailsDialogComponent} from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';
import * as _ from 'lodash';

@Component({
    selector: '[app-dm-unloading]',
    templateUrl: './dm-unloading.component.html',
    styleUrls: ['./dm-unloading.component.scss']
})
export class DmUnloadingComponent implements OnInit, OnChanges {
    @Input() trucks: TruckModel[];
    groups: any[];

    PRODUCT_CODE: any = PRODUCT_CODE;
    GET_COLOR_BY_PRODUCTCODE = GET_COLOR_BY_PRODUCTCODE;

    constructor(private _DialogService: DialogService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {trucks} = changes;
        if (trucks && trucks.currentValue) {
            this.generateStation();
        }
    }

    generateStation() {
        this.groups = [];
        const stations = _.uniqBy(_.map(this.trucks, (el) => el.currentOrder.station), (el) => el.getId());
        _.map(stations, (el) => {
            this.groups.push({
                station: el,
                trucks: _.filter(this.trucks, (truck) => truck.currentOrder.station.getId() == el.getId())
            });
        });
    }

    onTruckDetails(truck: TruckModel) {
        this._DialogService.open(FmTruckDetailsDialogComponent, {id: truck.getId()});
    }

    onOrderDetails(order: OrderModel) {
        this._DialogService.open(OmOrderDetailsDialogComponent, {id: order.getId()});
    }

}
