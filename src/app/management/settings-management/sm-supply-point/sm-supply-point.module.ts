import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmSpNewDialogComponent} from './sm-sp-new-dialog/sm-sp-new-dialog.component';
import {SmSpDetailsCompactComponent} from './sm-sp-details-compact/sm-sp-details-compact.component';
import {SmSpListComponent} from './sm-sp-list/sm-sp-list.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmSpNewDialogComponent, SmSpDetailsCompactComponent, SmSpListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule
  ],
  exports: [
    SmSpListComponent
  ],
  entryComponents: [
    SmSpNewDialogComponent, SmSpDetailsCompactComponent
  ]
})
export class SmSupplyPointModule {
}
