import {Component, OnInit} from '@angular/core';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-cm-customer-new-dialog',
    templateUrl: './cm-customer-new-dialog.component.html',
    styleUrls: ['./cm-customer-new-dialog.component.scss']
})
@staticImplements<IDialogComponent>()
export class CmCustomerNewDialogComponent extends DefaultDialogComponent implements OnInit {
    static DEFAULT_WIDTH: number = 600;
    constructor(public dialogRef: MatDialogRef<CmCustomerNewDialogComponent>,) {
        super(dialogRef);
    }

    ngOnInit() {
    }

}
