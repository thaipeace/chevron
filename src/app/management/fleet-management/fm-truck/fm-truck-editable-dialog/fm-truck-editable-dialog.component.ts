import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { TQLFormData } from '@shared/models/default/default-object.model';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { TruckDataService } from '@shared/services/data/truck-data.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@shared/constants/value.constant';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { DialogService } from '@app/shared/services/others/dialog.service';

@Component({
    selector: 'app-fm-truck-editable-dialog',
    templateUrl: './fm-truck-editable-dialog.component.html',
    styleUrls: ['./fm-truck-editable-dialog.component.scss']
})
export class FmTruckEditableDialogComponent implements OnInit {
    isNew: boolean;
    truckDetail: TruckModel;

    companies: TruckCompanyModel[];
    defaultCompanyId: string;
    truckCompanyIds: string[];
    formData: TQLFormData;
    disabledSelect: boolean;
    rfTruck: FormGroup;
    compartmentArray: FormArray;

    isLoadCompany = false;
    keys = ['truckPlate', 'safeLoadingPassDate', 'companyId', 'totalCapacity', 'truckCompartment', 'isPtoSupported'];

    constructor(
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<FmTruckEditableDialogComponent>,
        private _authenService: AuthenticationService,
        private _DialogService: DialogService,
        private _companyDataService: TruckCompanyDataService,
        private _truckDataService: TruckDataService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            truckDetail: TruckModel;
            defaultCompanyId: string;
            truckCompanyIds: string[];
            disabledSelect: boolean;
        }
    ) {
        const { truckDetail, defaultCompanyId, truckCompanyIds, disabledSelect } = data;

        this.truckDetail = truckDetail;
        this.defaultCompanyId = defaultCompanyId;
        this.truckCompanyIds = truckCompanyIds;
        this.disabledSelect = disabledSelect;
        console.log(disabledSelect);
    }

    ngOnInit() {
        this.formData = TruckModel.getFormData();
        this.formData['safeLoadingPassDate'].value = new Date();
        this.formData['isPtoSupported'].value = this.formData['isPtoSupported'].value || 'false';

        this.rfTruck = new FormGroup({
            truckPlate: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            safeLoadingPassDate: new FormControl(new Date(), [Validators.required]),
            companyId: new FormControl('', [Validators.required]),
            totalCapacity: new FormControl('', [Validators.required]),
            isPtoSupported: new FormControl('false', [])
        });

        this.compartmentArray = new FormArray([new FormControl('', [Validators.required])]);

        this._companyDataService.truckCompanyAllObservable.subscribe(companies => {
            if (!this.isLoadCompany && companies && companies.length === 0) {
                this.isLoadCompany = true;
                this._companyDataService.findAll();
                return;
            }

            this.companies =
                !!this.truckCompanyIds && this.truckCompanyIds.length > 0
                    ? companies.filter((c: TruckCompanyModel) => this.truckCompanyIds.includes(c.companyId))
                    : companies;
            if (!this.truckDetail) {
                this.isNew = true;
                if (!!this.defaultCompanyId) {
                    this.rfTruck.get('companyId').setValue(this.defaultCompanyId);
                }
            } else {
                this.isNew = false;
                this.formData = TruckModel.getFormData();
                this.formData.updateValues(this.truckDetail._data);
            }
        });
    }

    doUpdate() {
        console.log(this.compartmentArray.value);
        let compartments = this.compartmentArray.value.map((value, key) => ({ key, value }));

        Object.keys(this.rfTruck.controls).forEach(key => this.formData.setValue(key, this.rfTruck.get(key).value));
        this.formData.setValue(
            'safeLoadingPassDate',
            new Date(this.rfTruck.get('safeLoadingPassDate').value).getTime()
        );

        this._truckDataService.isNotExistedTruck(this.rfTruck.get('truckPlate').value).then(condition => {
            if (this.isNew && condition) {
                this._truckDataService.createTruck(this.formData).then(rs => {
                    console.log(rs);
                    if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
                        this._truckDataService
                            .createTruckCompartments(compartments, rs[1]['Create']['Truck']['sysId'])
                            .then(data => console.log(data));
                        const message = `${this.formData.getValue('truckPlate')} is created successfully`;
                        this._snackBar.open(message, X_BUTTON, {
                            duration: NOTIFICATION_DEFAULT_DURARION
                        });
                        this.dialogRef.close(true);
                    } else {
                        if (rs && rs[1] && rs[1]['Create']['Message']) {
                            const message = rs[1]['Create']['Message'];
                            this._snackBar.open(message, X_BUTTON, {
                                duration: NOTIFICATION_DEFAULT_DURARION
                            });
                        } else {
                            const message = `There are some problems. Please try again!`;
                            this._snackBar.open(message, X_BUTTON, {
                                duration: NOTIFICATION_DEFAULT_DURARION
                            });
                        }
                    }
                });
            } else {
                this._DialogService.open(MessageQuestionDialogComponent, {
                    question: `Truck "${this.rfTruck.get('truckPlate').value}" is Existed!`,
                    type: 'close'
                });
            }
        });
        // else {
        //     this._truckDataService
        //         .update(this.truckDetail.getId(), this.formData, this._authenService.getUsername())
        //         .then(rs => {
        //             if (rs && rs[1] && rs[1]['Update']['Status'] === 'Success') {
        //                 const message = `${this.formData.getValue('truckPlate')} is updated successfully`;
        //                 this._snackBar.open(message, X_BUTTON, {
        //                     duration: NOTIFICATION_DEFAULT_DURARION
        //                 });
        //                 this.dialogRef.close(true);
        //             } else {
        //                 if (rs && rs[1] && rs[1]['Update']['Message']) {
        //                     const message = rs[1]['Update']['Message'];
        //                     this._snackBar.open(message, X_BUTTON, {
        //                         duration: NOTIFICATION_DEFAULT_DURARION
        //                     });
        //                 } else {
        //                     const message = `There are some problems. Please try again!`;
        //                     this._snackBar.open(message, X_BUTTON, {
        //                         duration: NOTIFICATION_DEFAULT_DURARION
        //                     });
        //                 }
        //             }
        //         });
        // }
    }

    onNoClick() {
        this.dialogRef.close();
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    enableUpdate() {
        return this.rfTruck.valid && this.compartmentArray.valid;
    }
}
