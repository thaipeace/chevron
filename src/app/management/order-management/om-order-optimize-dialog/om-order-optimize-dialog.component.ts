import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {OrderDataService} from '@shared/services/data/order-data.service';
import * as moment from 'moment';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

@Component({
    selector: 'app-om-order-optimize-dialog',
    templateUrl: './om-order-optimize-dialog.component.html',
    styleUrls: ['./om-order-optimize-dialog.component.scss']
})
export class OmOrderOptimizeDialogComponent extends DefaultDialogComponent implements OnInit {
    datetime: Date;

    constructor(
        public dialogRef: MatDialogRef<OmOrderOptimizeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private _OrderDataService: OrderDataService) {
        super(dialogRef);
    }

    ngOnInit() {
        this.datetime = moment().toDate();
    }


    onOptimize() {
        const obj = moment(this.datetime);
        this._OrderDataService.optimizeOrderByDate(obj.month(), obj.day(), obj.year())
            .then((rs) => {
                if (rs['data']['Response']['Status'] === 'Success') {
                    this._snackBar.open(rs['data']['Response']['Message'], X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                }
                this.onCancel();
            });
    }
}
