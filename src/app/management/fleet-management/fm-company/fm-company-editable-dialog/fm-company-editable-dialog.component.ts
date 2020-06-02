import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { telPhoneValidator } from '@app/shared/validators/telPhone';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { DialogService } from '@app/shared/services/others/dialog.service';

@Component({
    selector: 'app-fm-company-editable-dialog',
    templateUrl: './fm-company-editable-dialog.component.html',
    styleUrls: ['./fm-company-editable-dialog.component.scss']
})
export class FmCompanyEditableDialogComponent implements OnInit {
    companyForm: FormGroup;
    isNew: boolean;
    companyDetail: TruckCompanyModel;
    divue: any;
    hasExist = false;

    constructor(
        private _fb: FormBuilder,
        private _DialogService: DialogService,
        public dialogRef: MatDialogRef<FmCompanyEditableDialogComponent>,
        private _truckCompanyDataService: TruckCompanyDataService,
        @Inject(MAT_DIALOG_DATA) public data: { companyDetail: TruckCompanyModel }
    ) {
        const { companyDetail } = data;

        this.isNew = !companyDetail;

        if (this.isNew) {
            this.companyForm = _fb.group({
                companyName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
                contactPerson: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
                contactNumber: new FormControl('', [Validators.required, telPhoneValidator]),
                companyCode: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
                companyId: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator])
            });
        } else {
            // this.companyDetail = companyDetail;
            // this.companyForm = _fb.group({
            //   companyName: new FormControl(this.companyDetail.companyName, [
            //     Validators.required
            //   ]),
            //   contactPerson: new FormControl(this.companyDetail.contactPerson, [
            //     telPhoneValidator,
            //     Validators.required
            //   ]),
            //   contactNumber: new FormControl(this.companyDetail.contactNumber, [
            //     Validators.required,
            //     telPhoneValidator
            //   ]),
            //   companyCode: new FormControl(this.companyDetail.companyCode, [
            //     Validators.required
            //   ]),
            //   companyId: new FormControl(this.companyDetail.companyId, [
            //     Validators.required
            //   ])
            // });
        }
    }

    ngOnInit() {}

    onSaveClick() {
        this._truckCompanyDataService.checkNameExists(this.companyForm.get('companyName').value).then(rs => {
            this.hasExist = rs;
            if (!rs) {
                this.dialogRef.close(this.companyForm.getRawValue());
            } else {
                this._DialogService.open(MessageQuestionDialogComponent, {
                    question: `"${this.companyForm.get('companyName').value}" is existed!`,
                    type: 'close'
                });
            }
        });
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
