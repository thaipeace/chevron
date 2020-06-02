import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTankPageComponent } from './cm-tank-page/cm-tank-page.component';
import { SharedModule } from '@shared/shared.module';
import { CmTankDetailsDialogComponent } from './cm-tank-details-dialog/cm-tank-details-dialog.component';
import { CmTankNewComponent } from './cm-tank-new/cm-tank-new.component';
import { CmTankListComponent } from './cm-tank-list/cm-tank-list.component';
import { CmTankDetailsComponent } from './cm-tank-details/cm-tank-details.component';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';

@NgModule({
  declarations: [
    CmTankPageComponent,
    CmTankDetailsDialogComponent,
    CmTankNewComponent,
    CmTankListComponent,
    CmTankDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    InventoryManagementModule
  ],
  exports: [
    CmTankListComponent,
    CmTankDetailsComponent
  ],
  entryComponents: [
    CmTankDetailsDialogComponent,
    CmTankNewComponent
  ]
})
export class CmTankModule {
}
