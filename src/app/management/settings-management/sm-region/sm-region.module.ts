import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmRListComponent} from './sm-r-list/sm-r-list.component';
import {SmRDetailsCompactComponent} from './sm-r-details-compact/sm-r-details-compact.component';
import {SmRNewDialogComponent} from './sm-r-new-dialog/sm-r-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmRListComponent, SmRDetailsCompactComponent, SmRNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
  ],
  exports: [
    SmRListComponent
  ],
  entryComponents: [
    SmRDetailsCompactComponent, SmRNewDialogComponent
  ]
})
export class SmRegionModule {
}
