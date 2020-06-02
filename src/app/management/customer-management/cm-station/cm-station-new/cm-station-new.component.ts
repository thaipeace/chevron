import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { CustomerDataService } from '@shared/services/data/customer-data.service';
import { CustomerModel } from '@app/shared/models/data.models/customer/customer.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { MapPickupDialogComponent } from '@app/shared/components/map/map-pickup-dialog/map-pickup-dialog.component';
import { telPhoneValidator } from '@app/shared/validators/telPhone';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { NaNValidator } from '@app/shared/validators/nan';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { DialogService } from '@app/shared/services/others/dialog.service';

@Component({
    selector: 'app-cm-station-new',
    templateUrl: './cm-station-new.component.html',
    styleUrls: ['./cm-station-new.component.scss']
})
export class CmStationNewComponent extends DefaultComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    stationDetail: StationModel;
    customerId: string;
    exists = false;
    disabledSelect: boolean;

    viewKeys: string[] = [
        'stationName',
        'distanceFromTerminal',
        'shortName',
        'estimatedHoursFromTerminal',
        'streetAddress',
        'shipTo',
        'stationType',
        'truckSize',
        'customerId',
        'contactNumber'
    ];
    editKeys: string[] = [
        'stationName',
        'shortName',
        'streetAddress',
        'stationType',
        'contactNumber',
        'distanceFromTerminal',
        'estimatedHoursFromTerminal',
        'customerId',
        'shipTo',
        'truckSize'
    ];
    keys: string[];
    isNew = false;
    isLoadCustomer = false;
    customers: CustomerModel[];
    formData: TQLFormData;
    rfStation: FormGroup;
    contactNumberControls: FormArray = new FormArray([]);

    constructor(
        private _stationService: StationDataService,
        private _customerService: CustomerDataService,
        private _snackBar: MatSnackBar,
        private _authenService: AuthenticationService,
        private matDialog: MatDialog,
        private _DialogService: DialogService,
        public dialogRef: MatDialogRef<CmStationNewComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            stationDetail: StationModel;
            customerId: string;
            disabledSelect: boolean;
        }
    ) {
        super();
        const { stationDetail, customerId, disabledSelect } = data;
        this.stationDetail = stationDetail;
        this.customerId = customerId;
        this.disabledSelect = disabledSelect;
    }

    ngOnInit() {
        this.formData = StationModel.getFormData();
        this.addSubscribes(
            this._customerService.customerAllObservable.subscribe(customers => {
                if (!this.isLoadCustomer && customers.length === 0) {
                    this.isLoadCustomer = true;
                    this._customerService.findAll();
                    return;
                }

                this.customers = customers;
                if (!this.stationDetail) {
                    this.isNew = true;
                    this.keys = this.viewKeys;
                    if (!!this.customerId) {
                        this.formData.setValue('customerId', this.customerId);
                    }
                    this.contactNumberControls.push(new FormControl('', [Validators.required, telPhoneValidator]));
                    this.rfStation = new FormGroup({
                        stationName: new FormControl('', [
                            Validators.required,
                            noWhitespaceValidator,
                            valueSafeValidator
                        ]),
                        shortName: new FormControl('', [
                            Validators.required,
                            noWhitespaceValidator,
                            valueSafeValidator
                        ]),
                        streetAddress: new FormControl('', [
                            Validators.required,
                            noWhitespaceValidator,
                            valueSafeValidator
                        ]),
                        stationType: new FormControl('', [
                            Validators.required,
                            noWhitespaceValidator,
                            valueSafeValidator
                        ]),
                        distanceFromTerminal: new FormControl('', [Validators.required]),
                        estimatedHoursFromTerminal: new FormControl('', [Validators.required]),
                        shipTo: new FormControl('', [Validators.required]),
                        truckSize: new FormControl('', [Validators.required])
                    });
                } else {
                    this.isNew = false;
                    this.formData = StationModel.getFormData();
                    this.formData.updateValues(this.stationDetail._data);
                    this.keys = this.editKeys;

                    const contactNumbers: string[] = this.stationDetail.contactNumber.split(',');
                    contactNumbers.forEach((contact: string) => {
                        this.contactNumberControls.push(new FormControl(contact.trim(), [Validators.required]));
                    });
                }
            })
        );
    }

    checkStationName() {
        return this._stationService.isNoExists(this.rfStation.get('stationName').value);
    }

    doUpdate() {
        this.reactiveToFormData(this.rfStation, this.formData);
        this.formData.setValue('contactNumber', this.contactNumberControls.getRawValue().join(','));
        console.log(this.formData);
        if (this.isNew) {
            this.checkStationName().then(val => {
                console.log(val);
                if (val) {
                    this.exists = false;
                    this._stationService.create(this.formData, this._authenService.getUsername()).then(rs => {
                        console.log(rs);
                        if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
                            const message = `Create successfully`;
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
                        question: `"${this.rfStation.get('stationName').value}" is existed!`,
                        type: 'close'
                    });
                }
            });
        }
    }

    reactiveToFormData(rf: FormGroup, formData: TQLFormData) {
        Object.keys(rf.controls).forEach(key => formData.setValue(key, rf.get(key).value));
    }

    pickUpLocation() {
        const _dialog = this.matDialog.open(MapPickupDialogComponent, {
            data: {
                address: this.formData.getValue('streetAddress')
            }
        });
        _dialog.componentInstance.cancel.subscribe(close => (close ? _dialog.close(MapPickupDialogComponent) : null));
        _dialog.componentInstance.pickUp.subscribe(({ change, address }) => {
            if (change) {
                this.formData.setValue('streetAddress', address);
            }
        });
    }

    enableUpdate() {
        return this.rfStation.valid && this.contactNumberControls.valid;
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
