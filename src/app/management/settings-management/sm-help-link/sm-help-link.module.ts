import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmHlNewDialogComponent} from './sm-hl-new-dialog/sm-hl-new-dialog.component';
import {SmHlListComponent} from './sm-hl-list/sm-hl-list.component';
import {SmHlDetailsCompactComponent} from './sm-hl-details-compact/sm-hl-details-compact.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmHlNewDialogComponent, SmHlListComponent, SmHlDetailsCompactComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
  ],
  exports: [
    SmHlListComponent
  ],
  entryComponents: [
    SmHlNewDialogComponent, SmHlDetailsCompactComponent
  ]
})
export class SmHelpLinkModule {
}
