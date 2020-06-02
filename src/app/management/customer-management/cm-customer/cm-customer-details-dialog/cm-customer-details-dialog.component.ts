import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';
import {CustomerDataService} from '@shared/services/data/customer-data.service';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';

@Component({
    selector: 'app-cm-customer-details-dialog',
    templateUrl: './cm-customer-details-dialog.component.html',
    styleUrls: ['./cm-customer-details-dialog.component.scss']
})
export class CmCustomerDetailsDialogComponent extends DefaultDialogComponent implements OnInit {
    id;
    customer: CustomerModel;

    constructor(
        public dialogRef: MatDialogRef<CmCustomerDetailsDialogComponent>,
        private _CustomerDataService: CustomerDataService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        if (data) {
            this.id = data.id;
            this.loadDetails();
        }
    }

    ngOnInit() {
    }

    loadDetails() {
        this._CustomerDataService
            .findById(this.id)
            .then((rs) => {
                this.customer = rs;
            });
    }
}
