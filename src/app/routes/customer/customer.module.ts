import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerRoutingModule} from '@app/routes/customer/customer-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '@shared/shared.module';
import {UpdateInventoryDialogComponent} from './dialogs/update-inventory-dialog.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {HistoryModule} from '@app/routes/customer/history/history.module';
import {EstimatedInventoryHintDialogComponent} from './dashboard/estimated-inventory-hint-dialog/estimated-inventory-hint-dialog.component';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';

const dialogs = [
    UpdateInventoryDialogComponent,
    EstimatedInventoryHintDialogComponent
];

@NgModule({
    declarations: [
        DashboardComponent,
        ...dialogs,
    ],
    imports: [
        CommonModule,
        SharedModule,
        HistoryModule,
        CustomerRoutingModule,
      InventoryManagementModule,
        BsDatepickerModule.forRoot(),
    ],
    entryComponents: [...dialogs]
})
export class CustomerModule {
}
