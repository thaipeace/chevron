import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FmTruckPageComponent} from './fm-truck-page/fm-truck-page.component';
import {SharedModule} from '@shared/shared.module';
import {FmTruckDetailsDialogComponent} from '@management/fleet-management/fm-truck/fm-truck-details-dialog/fm-truck-details-dialog.component';
import {FmTruckEditableDialogComponent} from './fm-truck-editable-dialog/fm-truck-editable-dialog.component';
import {FmTruckDetailsComponent} from './fm-truck-details/fm-truck-details.component';
import {FmTruckListComponent} from './fm-truck-list/fm-truck-list.component';
import {FmTruckDeleteDialogComponent} from './fm-truck-delete-dialog/fm-truck-delete-dialog.component';
import {FmTruckHistoricalLocationComponent} from './fm-truck-historical-location/fm-truck-historical-location.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {FmTruckEventListComponent} from './fm-truck-event-list/fm-truck-event-list.component';
import {FmTruckEventDetailsComponent} from './fm-truck-event-details/fm-truck-event-details.component';
import {FmTruckEventDetailsDialogComponent} from './fm-truck-event-details-dialog/fm-truck-event-details-dialog.component';
import { FmTruckLocationsDialogComponent } from './fm-truck-locations-dialog/fm-truck-locations-dialog.component';

@NgModule({
    declarations: [FmTruckPageComponent, FmTruckDetailsDialogComponent, FmTruckEditableDialogComponent,
        FmTruckDetailsComponent, FmTruckListComponent, FmTruckDeleteDialogComponent, FmTruckHistoricalLocationComponent,
        FmTruckEventListComponent, FmTruckEventDetailsComponent, FmTruckEventDetailsDialogComponent, FmTruckLocationsDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
    ],
    entryComponents: [
        FmTruckDetailsDialogComponent,
        FmTruckEditableDialogComponent,
        FmTruckDeleteDialogComponent,
        FmTruckEventDetailsDialogComponent,
        FmTruckLocationsDialogComponent
    ],
    exports: [
        FmTruckDetailsComponent,
        FmTruckListComponent
    ]
})
export class FmTruckModule {
}
