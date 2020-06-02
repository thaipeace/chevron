import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmCustomerPageComponent } from './cm-customer-page/cm-customer-page.component';
import { CmCustomerDetailsDialogComponent } from './cm-customer-details-dialog/cm-customer-details-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { CmCustomerNewComponent } from './cm-customer-new/cm-customer-new.component';
import { CmCustomerDetailsComponent } from './cm-customer-details/cm-customer-details.component';
import { CollapseModule } from 'ngx-bootstrap';
import { CmStationModule } from '@management/customer-management/cm-station/cm-station.module';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { CmCustomerNewDialogComponent } from './cm-customer-new-dialog/cm-customer-new-dialog.component';

@NgModule({
  declarations: [CmCustomerPageComponent, CmCustomerDetailsDialogComponent, CmCustomerNewComponent, CmCustomerDetailsComponent, CmCustomerNewDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    CmStationModule,
    CollapseModule,
    Md2DatepickerModule,
    MdNativeDateModule
  ],
  exports: [
    CmCustomerDetailsComponent,
  ],
  entryComponents: [
    CmCustomerDetailsDialogComponent,
    CmCustomerNewComponent
  ]
})
export class CmCustomerModule {
}
