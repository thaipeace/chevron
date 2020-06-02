import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FmDriverPageComponent} from './fm-driver-page/fm-driver-page.component';
import {SharedModule} from '@shared/shared.module';
import {FmDriverDetailsDialogComponent} from './fm-driver-details-dialog/fm-driver-details-dialog.component';
import {FmDriverEditableDialogComponent} from './fm-driver-editable-dialog/fm-driver-editable-dialog.component';
import {FmDriverDeleteDialogComponent} from './fm-driver-delete-dialog/fm-driver-delete-dialog.component';
import {FmDriverDetailsComponent} from './fm-driver-details/fm-driver-details.component';
import {FmDriverListComponent} from './fm-driver-list/fm-driver-list.component';
import {FmDriverPerformanceDailyDetailsDialogComponent} from '@management/fleet-management/fm-driver/fm-driver-performance-daily-details-dialog/fm-driver-performance-daily-details-dialog.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {FmDriverProfileComponent} from './fm-driver-profile/fm-driver-profile.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {FmDriverDetailsCompactComponent} from './fm-driver-details-compact/fm-driver-details-compact.component';
import { FmDriverDetailsDetailComponent } from './fm-driver-details-detail/fm-driver-details-detail.component';

@NgModule({
    declarations: [
        FmDriverPageComponent,
        FmDriverDetailsDialogComponent,
        FmDriverEditableDialogComponent,
        FmDriverDeleteDialogComponent,
        FmDriverDetailsComponent,
        FmDriverListComponent,
        FmDriverPerformanceDailyDetailsDialogComponent,
        FmDriverProfileComponent,
        FmDriverDetailsCompactComponent,
        FmDriverDetailsDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        Md2DatepickerModule,
        MdNativeDateModule,
        BsDatepickerModule.forRoot()
    ],
    entryComponents: [
        FmDriverDetailsDialogComponent,
        FmDriverEditableDialogComponent,
        FmDriverDeleteDialogComponent,
        FmDriverPerformanceDailyDetailsDialogComponent,
        FmDriverDetailsCompactComponent
    ],
    exports: [
        FmDriverDetailsComponent,
        FmDriverDetailsDetailComponent,
        FmDriverListComponent,
        FmDriverProfileComponent,
    ]
})
export class FmDriverModule {
}
