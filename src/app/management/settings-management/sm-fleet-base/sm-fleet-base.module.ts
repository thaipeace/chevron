import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmFbListComponent} from './sm-fb-list/sm-fb-list.component';
import {SmFbDetailsCompactComponent} from './sm-fb-details-compact/sm-fb-details-compact.component';
import {SmFbNewDialogComponent} from './sm-fb-new-dialog/sm-fb-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [SmFbListComponent, SmFbDetailsCompactComponent,
    SmFbNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
    TimepickerModule.forRoot()
  ],
  exports: [
    SmFbListComponent
  ],
  entryComponents: [
    SmFbDetailsCompactComponent, SmFbNewDialogComponent
  ]
})
export class SmFleetBaseModule {
}
