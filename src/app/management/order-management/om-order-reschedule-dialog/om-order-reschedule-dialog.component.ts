import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ORDER_TIME_WINDOW} from '@shared/constants/value.constant';
import {OrderDataService} from '@shared/services/data/order-data.service';
import {FormControl, Validators} from '@angular/forms';
import {noWhitespaceValidator} from '@app/shared/validators/no-white-spaces';

@Component({
    selector: 'app-om-order-reschedule-dialog',
    templateUrl: './om-order-reschedule-dialog.component.html',
    styleUrls: ['./om-order-reschedule-dialog.component.scss']
})
export class OmOrderRescheduleDialogComponent extends DefaultDialogComponent implements OnInit {
    order: OrderModel;
    newDateTime: any;
    currentDate: any;
    allTimeWindows: string[];
    selectedTimeWindow: string;
    commentControl: FormControl;


    constructor(
        private _OrderDataService: OrderDataService,
        public dialogRef: MatDialogRef<OmOrderRescheduleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.order = data['order'] || null;
        this.newDateTime = moment().add(5, 'minute').toDate();
        this.currentDate = moment().toDate();
        this.allTimeWindows = [];
        _.map(ORDER_TIME_WINDOW, (el) => {
            console.log(el);
            this.allTimeWindows.push(el);
        });
        this.selectedTimeWindow = this.allTimeWindows[0];
    }

    ngOnInit() {
        this.commentControl = new FormControl('', [
            Validators.required,
            noWhitespaceValidator
        ]);
    }

    onReschedule() {
        if (this.commentControl.valid) {
            if (moment().diff(moment(this.newDateTime)) >= 0) {
                this.newDateTime = moment().add(5, 'minute').toDate();
            }

            this._OrderDataService.reschedule(this.order.getId(), moment(this.newDateTime).valueOf(), this.selectedTimeWindow
                , this.commentControl.value)
                .then((rs) => {
                    if (rs) {
                        this.onCancel();
                    }
                });
        }
    }

    onTimeWindowSelectionChange($event: any) {
        this.selectedTimeWindow = $event['value'];
    }

}
