import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmDpgListComponent} from './sm-dpg-list/sm-dpg-list.component';
import {SmDpgNewDialogComponent} from './sm-dpg-new-dialog/sm-dpg-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';
import {SmDpgDetailsCompactComponent} from './sm-dpg-details-compact/sm-dpg-details-compact.component';

@NgModule({
  declarations: [SmDpgListComponent, SmDpgNewDialogComponent, SmDpgDetailsCompactComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule
  ],
  exports: [
    SmDpgListComponent
  ],
  entryComponents: [
    SmDpgNewDialogComponent, SmDpgDetailsCompactComponent
  ]
})
export class SmDeliveryPointGroupModule {
}
