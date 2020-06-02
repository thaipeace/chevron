import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-om-order-remark-dialog',
    templateUrl: './om-order-remark-dialog.component.html',
    styleUrls: ['./om-order-remark-dialog.component.scss']
})
@staticImplements<IDialogComponent>()
export class OmOrderRemarkDialogComponent extends DefaultDialogComponent implements OnInit {
    static DEFAULT_WIDTH = 400;
    message: string;
    datetime: string;
    userName: string;

    constructor(
        public dialogRef: MatDialogRef<OmOrderRemarkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.message = data['message'] || 'no message';
        this.datetime = data['datetime'] || '';
        this.userName = data['userName'] || '';
    }

    ngOnInit() {
    }

}
