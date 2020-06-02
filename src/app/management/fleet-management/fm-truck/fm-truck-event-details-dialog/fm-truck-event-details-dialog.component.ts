import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';
import {IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';

@Component({
    selector: 'app-fm-truck-event-details-dialog',
    templateUrl: './fm-truck-event-details-dialog.component.html',
    styleUrls: ['./fm-truck-event-details-dialog.component.scss']
})
export class FmTruckEventDetailsDialogComponent implements OnInit {
    event: TruckEventModel = null;

    constructor(public dialogRef: MatDialogRef<FmTruckEventDetailsDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
        this.event = data.event || this.event;
    }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
