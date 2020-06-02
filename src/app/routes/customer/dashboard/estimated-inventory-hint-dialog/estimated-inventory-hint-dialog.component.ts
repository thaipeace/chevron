import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {DefaultDialogComponent, IDialogComponent, staticImplements} from '@shared/models/default/default-component.model';

@Component({
    selector: 'app-estimated-inventory-hint-dialog',
    templateUrl: './estimated-inventory-hint-dialog.component.html',
    styleUrls: ['./estimated-inventory-hint-dialog.component.scss']
})
@staticImplements<IDialogComponent>()
export class EstimatedInventoryHintDialogComponent extends DefaultDialogComponent implements OnInit {
    static DEFAULT_WIDTH = 600;

    constructor(public dialogRef: MatDialogRef<EstimatedInventoryHintDialogComponent>,) {
        super(dialogRef);
    }

    ngOnInit() {
    }

}
