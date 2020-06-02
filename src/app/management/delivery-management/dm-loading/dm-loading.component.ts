import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {PRODUCT_CODE, GET_COLOR_BY_PRODUCTCODE} from '@shared/constants/value.constant';
import {DialogService} from '@shared/services/others/dialog.service';
import {FmTruckDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {OmOrderDetailsDialogComponent} from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';

@Component({
    selector: '[app-dm-loading]',
    templateUrl: './dm-loading.component.html',
    styleUrls: ['./dm-loading.component.scss']
})
export class DmLoadingComponent implements OnInit, OnChanges {
    @Input() trucks: TruckModel[] = [];
    PRODUCT_CODE: any = PRODUCT_CODE;
    GET_COLOR_BY_PRODUCTCODE = GET_COLOR_BY_PRODUCTCODE;

    constructor(
        private _DialogService: DialogService
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    onTruckDetails(truck: TruckModel) {
        this._DialogService.open(FmTruckDetailsDialogComponent, {id: truck.getId()});
    }

    onOrderDetails(order: OrderModel) {
        this._DialogService.open(OmOrderDetailsDialogComponent, {id: order.getId()});
    }
}
