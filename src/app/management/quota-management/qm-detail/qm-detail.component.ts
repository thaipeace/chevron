import {Component, OnInit, Inject} from '@angular/core';
import {StationModel} from '@app/shared/models/data.models/station/station.model';
import {QuotaModel} from '@app/shared/models/data.models/quota/quota.model';
import {QuotaDataService} from '@app/shared/services/data/quota-data.service';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import {QmNewComponent} from '../qm-new/qm-new.component';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {noWhitespaceValidator} from '@app/shared/validators/no-white-spaces';
import {X_BUTTON, NOTIFICATION_CREATION_DURARION, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';

@Component({
    selector: 'app-qm-detail',
    templateUrl: './qm-detail.component.html',
    styleUrls: ['./qm-detail.component.scss']
})
export class QmDetailComponent implements OnInit {
    stations: StationModel[];
    quotaDetail: QuotaModel;
    isEdit = false;
    rfEdit: FormGroup;

    constructor(
        private _QuotaDataService: QuotaDataService,
        public dialogRef: MatDialogRef<QmNewComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { stations: StationModel[], quotaDetail: QuotaModel }
    ) {
        const {stations, quotaDetail} = data;
        this.stations = stations;
        this.quotaDetail = quotaDetail;
    }

    ngOnInit() {
        this.rfEdit = new FormGroup({
            monthlyQuota: new FormControl('', [
                Validators.required,
                noWhitespaceValidator
            ]),
            remainingQuota: new FormControl('', [
                Validators.required,
                noWhitespaceValidator
            ]),
        });

        this.rfEdit.setValue({
            monthlyQuota: this.quotaDetail.monthlyQuota,
            remainingQuota: this.quotaDetail.remainingQuota,
        });
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    onCancelEdit() {
        this.isEdit = false;
        this.rfEdit.setValue({
            monthlyQuota: this.quotaDetail.monthlyQuota,
            remainingQuota: this.quotaDetail.remainingQuota,
        });
    }

    onEdit() {
        this.isEdit = true;
    }

    onSave() {
        if (this.rfEdit.valid) {
            this.saveData();
            this.isEdit = false;
        }
    }

    saveData() {
        const formValue = this.rfEdit.getRawValue();
        this.quotaDetail._data['MonthlyQuota'] = formValue['monthlyQuota'];
        this.quotaDetail._data['RemainingQuota'] = formValue['remainingQuota'];

        const formData = QuotaModel.getFormData();
        formData.updateValues(this.quotaDetail._data);

        this._QuotaDataService.update(formData).then(rs => {
            if (rs['data'] && rs['data']['Key'] === 'Success') {
                const message = `Quota is saved successfully`;
                this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_CREATION_DURARION});
                this.dialogRef.close(true);
            } else {
                if (rs['data'] && rs['data']['Message']) {
                    const message = rs['data']['Message'];
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                } else {
                    const message = `There are some problems. Please try again!`;
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                }
            }
        });
    }
}
