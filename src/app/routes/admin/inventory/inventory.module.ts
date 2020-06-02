import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryPageComponent} from './inventory-page/inventory-page.component';
import {InventoryCurrentComponent} from './inventory-current/inventory-current.component';
import {InventoryHistoryComponent} from './inventory-history/inventory-history.component';
import {SharedModule} from '@shared/shared.module';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';

@NgModule({
  declarations: [InventoryPageComponent, InventoryCurrentComponent, InventoryHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    InventoryManagementModule
  ]
})
export class InventoryModule {
}
