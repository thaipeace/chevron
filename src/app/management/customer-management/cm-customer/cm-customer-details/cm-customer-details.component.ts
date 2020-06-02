import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CustomerModel } from '@app/shared/models/data.models/customer/customer.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { CustomerDataService } from '@shared/services/data/customer-data.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { MatSnackBar } from '@angular/material';
import { MapService } from '@shared/services/map.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { ICustomerTreeNode } from '@app/shared/models/interfaces/tree-view.interface';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { emailValidator } from '@app/shared/validators/email';
import { numberFormat } from 'highcharts';
import { telPhoneValidator } from '@app/shared/validators/telPhone';

@Component({
    selector: 'app-cm-customer-details',
    templateUrl: './cm-customer-details.component.html',
    styleUrls: ['./cm-customer-details.component.scss']
})
export class CmCustomerDetailsComponent extends DefaultComponent implements OnInit, OnChanges {
    @Input() customer: CustomerModel;
    @Input() node: ICustomerTreeNode;
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();

    stations: StationModel[] = [];
    contactNumber: FormArray;
    customerDetails: FormGroup = new FormGroup({
        contactNumber: new FormControl('', [Validators.required, noWhitespaceValidator]),
        customerAddress: new FormControl('', [Validators.required, noWhitespaceValidator]),
        customerName: new FormControl('', [Validators.required, noWhitespaceValidator]),
        emailAddress: new FormControl('', [Validators.required, noWhitespaceValidator, emailValidator])
    });
    edit = false;

    constructor(
        private _AuthenticationService: AuthenticationService,
        private _CustomerDataService: CustomerDataService,
        private _MapService: MapService,
        private _MatSnackBar: MatSnackBar,
        private _StationDataService: StationDataService
    ) {
        super();
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.edit = false;
        this.customerDetails.setValue({
            customerName: this.customer._data['customerName'],
            contactNumber: this.customer._data['contactNumber'],
            customerAddress: this.customer._data['customerAddress'],
            emailAddress: this.customer._data['emailAddress']
        });

        this.contactNumber = new FormArray([]);
        String(this.customer._data['contactNumber'])
            .split(',')
            .forEach(number =>
                this.contactNumber.push(new FormControl(number.trim(), [Validators.required, telPhoneValidator]))
            );

        const { customer } = changes;

        if (!!customer && !!customer.currentValue) {
            this.addPromises(this._StationDataService.findAllByCustomerId(this.customer.getId()).then((stations: StationModel[]) => {
                this.stations = stations;
            }));
        }
    }

    onRefresh() {
        this.refreshed.emit(true);
    }

    onEdit() {
        this.edit = true;
    }

    onSave() {
        const formData: TQLFormData = CustomerModel.getFormData();
        formData.updateValues(this.customer._data);

        if (this.customerDetails.valid) {
            // formData.updateValues(this.customerDetails.value);
            formData.setValue('customerName', this.customerDetails.get('customerName').value);
            formData.setValue('customerAddress', this.customerDetails.get('customerAddress').value);
            formData.setValue('emailAddress', this.customerDetails.get('emailAddress').value);
            formData.setValue('contactNumber', this.contactNumber.value.join(', '));
            // console.log(formData);

            this._CustomerDataService.update(formData, this._AuthenticationService.getUsername()).then(rs => {
                // console.log(rs);
                if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
                    const message = `Update successfully`;
                    this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                    this.edit = false;
                    this.refresh.emit();
                } else {
                    if (rs && rs[1] && rs[1]['Save']['Message']) {
                        const message = rs[1]['Save']['Message'];
                        this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                    } else {
                        const message = `There are some problems. Please try again!`;
                        this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                    }
                }
            });
        } else {
            const message = `There are some problems. Please try again!`;
            this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }
    }

    onCancelEdit() {
        Object.keys(this.customerDetails.controls).forEach(key =>
            this.customerDetails.get(key).setValue(this.customer._data[key])
        );
        this.edit = false;
    }

    enableSubmit() {
        return this.customerDetails.valid && this.contactNumber.valid;
    }
}
