import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmTsListComponent} from './sm-ts-list/sm-ts-list.component';
import {SmTsDetailsCompactComponent} from './sm-ts-details-compact/sm-ts-details-compact.component';
import {SmTsNewDialogComponent} from './sm-ts-new-dialog/sm-ts-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmTsListComponent, SmTsDetailsCompactComponent, SmTsNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
  ],
  exports: [
    SmTsListComponent
  ],
  entryComponents: [
    SmTsDetailsCompactComponent, SmTsNewDialogComponent
  ]
})
export class SmTruckStopModule {
}
