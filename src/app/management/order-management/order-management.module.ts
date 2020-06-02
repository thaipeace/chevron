import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {OmPageComponent} from './om-page/om-page.component';
import {OmListComponent} from './om-list/om-list.component';
import {OmNewComponent} from './om-new/om-new.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {OmMapComponent} from './om-map/om-map.component';
import {OmPrepareCancellationDialogComponent} from './om-prepare-cancellation-dialog/om-prepare-cancellation-dialog.component';
import {OmOrderDetailsDialogComponent} from './om-order-details-dialog/om-order-details-dialog.component';
import {OmOrderRemarkDialogComponent} from './om-order-remark-dialog/om-order-remark-dialog.component';
import {OmOrderRescheduleDialogComponent} from './om-order-reschedule-dialog/om-order-reschedule-dialog.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {OmOrderExportDialogComponent} from './om-order-export-dialog/om-order-export-dialog.component';
import {OmOrderOptimizeDialogComponent} from './om-order-optimize-dialog/om-order-optimize-dialog.component';
import { OmInventoryExportDialogComponent } from './om-inventory-export-dialog/om-inventory-export-dialog.component';

@NgModule({
    declarations: [OmPageComponent, OmListComponent, OmNewComponent, OmMapComponent,
        OmPrepareCancellationDialogComponent, OmOrderDetailsDialogComponent, OmOrderRemarkDialogComponent,
        OmOrderRescheduleDialogComponent,
        OmOrderExportDialogComponent,
        OmOrderOptimizeDialogComponent,
        OmInventoryExportDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
        Md2DatepickerModule,
        MdNativeDateModule
    ],
    exports: [OmPageComponent, OmListComponent, OmNewComponent, OmMapComponent],
    entryComponents: [OmNewComponent, OmOrderDetailsDialogComponent, OmPrepareCancellationDialogComponent, OmOrderRemarkDialogComponent,
        OmOrderRescheduleDialogComponent, OmOrderExportDialogComponent, OmOrderOptimizeDialogComponent, OmInventoryExportDialogComponent]
})
export class OrderManagementModule {
}
