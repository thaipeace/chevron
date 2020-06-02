import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {NmListComponent} from './nm-list/nm-list.component';
import {NmDetailsDialogComponent} from './nm-details-dialog/nm-details-dialog.component';
import {NmDeleteDialogComponent} from './nm-delete-dialog/nm-delete-dialog.component';
import {NmListDialogComponent} from './nm-list-dialog/nm-list-dialog.component';

@NgModule({
    declarations: [NmListComponent, NmDetailsDialogComponent, NmDeleteDialogComponent, NmListDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [NmListComponent, NmDetailsDialogComponent,],
    entryComponents: [NmDetailsDialogComponent, NmDeleteDialogComponent, NmListDialogComponent]
})
export class NotificationManagementModule {
}
