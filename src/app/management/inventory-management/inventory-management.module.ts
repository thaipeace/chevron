import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImNewComponent} from './im-new/im-new.component';
import {SharedModule} from '@shared/shared.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {StationInventoryDetailsComponent} from './station-inventory-details/station-inventory-details.component';
import {ImCurrentComponent} from './im-current/im-current.component';
import {ImHistoryComponent} from './im-history/im-history.component';
import {ImHistoryImportDialogComponent} from './im-history-import-dialog/im-history-import-dialog.component';

@NgModule({
  declarations: [
    ImNewComponent,
    StationInventoryDetailsComponent,
    ImCurrentComponent,
    ImHistoryComponent,
    ImHistoryImportDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RoutesRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [ImHistoryComponent, ImNewComponent, StationInventoryDetailsComponent, ImCurrentComponent, ImHistoryImportDialogComponent],
  entryComponents: [ImNewComponent, ImHistoryImportDialogComponent]
})
export class InventoryManagementModule {
}
