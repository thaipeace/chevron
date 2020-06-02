import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmTpListComponent} from './sm-tp-list/sm-tp-list.component';
import {SmTpDetailsCompactComponent} from './sm-tp-details-compact/sm-tp-details-compact.component';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [SmTpListComponent, SmTpDetailsCompactComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapManagementModule,
  ],
  exports: [
    SmTpListComponent
  ],
  entryComponents: [
    SmTpDetailsCompactComponent
  ]
})
export class SmTripPreferenceModule {
}
