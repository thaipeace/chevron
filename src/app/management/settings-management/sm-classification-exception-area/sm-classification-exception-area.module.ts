import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmCeaListComponent} from './sm-cea-list/sm-cea-list.component';
import {SmCeaDetailsCompactComponent} from './sm-cea-details-compact/sm-cea-details-compact.component';
import {SmCeaNewDialogComponent} from './sm-cea-new-dialog/sm-cea-new-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmCeaListComponent, SmCeaDetailsCompactComponent, SmCeaNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule
  ],
  exports: [
    SmCeaListComponent
  ],
  entryComponents: [
    SmCeaDetailsCompactComponent, SmCeaNewDialogComponent
  ]
})
export class SmClassificationExceptionAreaModule {
}
