import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { CmStationDetailsComponent } from '../cm-station-details/cm-station-details.component';

@Component({
    selector: 'app-cm-station-details-dialog',
    templateUrl: './cm-station-details-dialog.component.html',
    styleUrls: ['./cm-station-details-dialog.component.scss']
})
export class CmStationDetailsDialogComponent implements OnInit {
    id;
    readonly: boolean = true;
    showEdit: boolean = true;
    @ViewChild(CmStationDetailsComponent) _CmStationDetailsComponent: CmStationDetailsComponent;

    constructor(
        public dialogRef: MatDialogRef<CmStationDetailsDialogComponent>,
        private _AuthenticationService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.id = data.id;
        this.readonly = data.readonly;
    }

    ngOnInit() {
        switch (this._AuthenticationService.getRole()) {
            case DEFAULT_ROLES.ADMIN:
            case DEFAULT_ROLES.PLANNER:
                this.readonly = false;
                break;
            default:
                this.readonly = true;
        }
    }

    onEdit() {
        this._CmStationDetailsComponent.onEdit();
    }

    onSave() {
        this._CmStationDetailsComponent.onSave();
    }

    onCancelEdit() {
        this._CmStationDetailsComponent.onCancelEdit();
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
