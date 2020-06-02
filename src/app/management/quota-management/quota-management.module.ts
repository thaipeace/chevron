import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QmListComponent} from './qm-list/qm-list.component';
import {SharedModule} from '@shared/shared.module';
import {QmNewComponent} from './qm-new/qm-new.component';
import {QmDetailComponent} from './qm-detail/qm-detail.component';
import {QmImportDialogComponent} from '@management/quota-management/qm-import-dialog/qm-import-dialog.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {QmDetailsCompactComponent} from '@management/quota-management/qm-details-compact/qm-details-compact.component';

const components = [
  QmListComponent,
  QmNewComponent,
  QmDetailComponent,
  QmImportDialogComponent,
  QmDetailsCompactComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: components,
  entryComponents: [
    QmNewComponent,
    QmDetailComponent,
    QmImportDialogComponent,
    QmDetailsCompactComponent
  ],
})
export class QuotaManagementModule {
}
