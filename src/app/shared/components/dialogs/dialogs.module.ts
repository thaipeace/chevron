import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadSapFileDialogComponent} from './upload-sap-file-dialog/upload-sap-file-dialog.component';
import {MessageQuestionDialogComponent} from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {SystemHelpDialogComponent} from '@shared/components/dialogs/system-help-dialog/system-help-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@shared/material/material.module';
import {PdfDialogComponent} from './pdf-dialog/pdf-dialog.component';
import {ImportManualCiOrdersDialogComponent} from './import-manual-ci-orders-dialog/import-manual-ci-orders-dialog.component';
import {WizardImportDialogComponent} from './wizard-import-dialog/wizard-import-dialog.component';
import {PipeModule} from '@shared/pipe/pipe.module';
import {BsDatepickerModule} from 'ngx-bootstrap';

const DIALOGS = [UploadSapFileDialogComponent, MessageQuestionDialogComponent, SystemHelpDialogComponent, PdfDialogComponent, ImportManualCiOrdersDialogComponent, WizardImportDialogComponent];

@NgModule({
  declarations: [...DIALOGS],
  entryComponents: [...DIALOGS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipeModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [...DIALOGS]
})
export class DialogsModule {
}
