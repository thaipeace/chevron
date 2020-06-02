import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DefaultDialogComponent, IDialogComponent, staticImplements } from '@shared/models/default/default-component.model';
import { OrderModel } from '@shared/models/data.models/order/order.model';
import { OrderDataService } from '@shared/services/data/order-data.service';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';

@Component({
    selector: 'app-om-prepare-cancellation-dialog',
    templateUrl: './om-prepare-cancellation-dialog.component.html',
    styleUrls: ['./om-prepare-cancellation-dialog.component.scss']
})
@staticImplements<IDialogComponent>()
export class OmPrepareCancellationDialogComponent extends DefaultDialogComponent implements OnInit {
    static DEFAULT_WIDTH = 400;
    commentControl: FormControl;
    order: OrderModel;

    constructor(
        private _OrderDataService: OrderDataService,
        public dialogRef: MatDialogRef<OmPrepareCancellationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        super(dialogRef);
        this.order = data.order;
    }

    ngOnInit() {
        this.commentControl = new FormControl('', [
            Validators.required,
            noWhitespaceValidator
        ]);
    }

    onSubmit() {
        console.log(this.commentControl);
        if (this.commentControl.valid) {
            this._OrderDataService.requestCancel(this.order.stationId, this.order.getId(), this.commentControl.value)
                .then((rs) => {
                    if (rs) {
                        this.onCancel();
                    }
                });
        } else {
            // alert('no message');
        }

    }

}
