import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HistoryPageComponent} from './history-page/history-page.component';
import {HistoryOrderComponent} from './history-order/history-order.component';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {HistoryInventoryComponent} from './history-inventory/history-inventory.component';
import {OrderManagementModule} from '@management/order-management/order-management.module';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';

@NgModule({
  declarations: [HistoryPageComponent, HistoryOrderComponent, HistoryInventoryComponent],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    OrderManagementModule,
    InventoryManagementModule,
  ]
})
export class HistoryModule {
}
