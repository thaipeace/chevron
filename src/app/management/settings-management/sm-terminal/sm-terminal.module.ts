import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmTListComponent} from './sm-t-list/sm-t-list.component';
import {SmTDetailsCompactComponent} from './sm-t-details-compact/sm-t-details-compact.component';
import {SmTNewDialogComponent} from './sm-t-new-dialog/sm-t-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmTListComponent, SmTDetailsCompactComponent, SmTNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
  ],
  exports: [
    SmTListComponent
  ],
  entryComponents: [
    SmTDetailsCompactComponent, SmTNewDialogComponent
  ]
})
export class SmTerminalModule {
}
