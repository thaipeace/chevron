import {Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {TruckCompanyModel} from '@shared/models/data.models/fleet/truck-company.model';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {AuthenticationService} from '@app/user-management/shared/services';
import {valueSafeValidator} from '@app/shared/validators/value-safe';
import {noWhitespaceValidator} from '@app/shared/validators/no-white-spaces';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {SideBarService} from '@shared/services/side-bar.service';

@Component({
    selector: 'app-fm-company-details',
    templateUrl: './fm-company-details.component.html',
    styleUrls: ['./fm-company-details.component.scss']
})
export class FmCompanyDetailsComponent extends DefaultComponent implements OnChanges {
    @Input() id;
    @Input() truckCompanyIds: string[];
    @Input() readonly = true;
    @Output() refresh = new EventEmitter();

    companyForm: FormGroup;
    edit = false;

    object: TruckCompanyModel;

    constructor(
        private _truckCompanyDataService: TruckCompanyDataService,
        private _authenService: AuthenticationService,
        private _snackBar: MatSnackBar,
        private _SideBarService: SideBarService,
    ) {
        super();
        this.companyForm = new FormGroup({
            companyName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            contactPerson: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            contactNumber: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            companyCode: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator])
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {id} = changes;
        this.edit = false;

        if (!!id && !!id.currentValue) {
            this.loadDetails();
        }
    }

    loadDetails() {
        this.addPromises(
            this._truckCompanyDataService.findById(this.id)
                .then(rs => {
                    this.object = rs;
                    Object.keys(this.companyForm.controls).forEach(key => this.companyForm.get(key).setValue(rs[key]));
                }));
    }

    onSave() {
        const formData = this.object;

        if (this.companyForm.valid) {
            Object.keys(this.companyForm.controls).forEach(key => (formData[key] = this.companyForm.get(key).value));

            this._truckCompanyDataService.update(this.id, formData, this._authenService.getUsername()).then(rs => {
                if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
                    this.edit = false;
                    this.loadDetails();
                    this.refresh.emit();
                    const message = `${formData.getValue('companyName')} is updated successfully`;
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                } else {
                    if (rs && rs[1] && rs[1]['Save']['Message']) {
                        const message = rs[1]['Save']['Message'];
                        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    } else {
                        const message = `There are some problems. Please try again!`;
                        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    }
                }
            });
        } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }
    }

    onEdit() {
        this.edit = true;
    }

    onCancelEdit() {
        this.edit = false;
        this.loadDetails();
    }

    onRefreshDetails($event: any) {
        this.addPromises($event);
    }

    onTabChange() {
        this._SideBarService.close();
    }
}
