import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {FmTruckDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {OmOrderDetailsDialogComponent} from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';

@Component({
    selector: '[app-dm-on-transit]',
    templateUrl: './dm-on-transit.component.html',
    styleUrls: ['./dm-on-transit.component.scss']
})
export class DmOnTransitComponent implements OnInit, OnChanges {
    @Input() trucks: TruckModel[];
    @Output() onSelectTruckCallback: EventEmitter<any> = new EventEmitter();
    selectedTrucks: TruckModel[] = [];

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

    onSelectTruck(truck: TruckModel) {
        if (this.selectedTrucks.indexOf(truck) >= 0) {
            this.selectedTrucks = [];
        } else {
            this.selectedTrucks = [truck];
        }
        this.onSelectTruckCallback.emit(this.selectedTrucks);
    }

    onSelectMultiTruck(truck: TruckModel) {
        if (this.selectedTrucks.indexOf(truck) >= 0) {
            this.selectedTrucks.splice(this.selectedTrucks.indexOf(truck), 1);
        } else {
            this.selectedTrucks.push(truck);
        }
        this.onSelectTruckCallback.emit(this.selectedTrucks);
    }
}
