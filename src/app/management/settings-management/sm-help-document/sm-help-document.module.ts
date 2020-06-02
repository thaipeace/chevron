import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmHdListComponent} from './sm-hd-list/sm-hd-list.component';
import {SmHdDetailsCompactComponent} from './sm-hd-details-compact/sm-hd-details-compact.component';
import {SmHdNewDialogComponent} from './sm-hd-new-dialog/sm-hd-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [SmHdListComponent, SmHdDetailsCompactComponent, SmHdNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
    TimepickerModule.forRoot()
  ],
  exports: [
    SmHdListComponent
  ],
  entryComponents: [
    SmHdDetailsCompactComponent, SmHdNewDialogComponent
  ]
})
export class SmHelpDocumentModule {
}
