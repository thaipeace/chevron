import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TankDataService } from '@shared/services/data/tank-data.service';
import { TankModel } from '@shared/models/data.models/tank/tank.model';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { CustomerModel } from '@shared/models/data.models/customer/customer.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { CustomerService } from '@shared/services/customer.service';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { CmTankDetailsComponent } from '../cm-tank-details/cm-tank-details.component';
import { DialogService } from '@app/shared/services/others/dialog.service';

@Component({
    selector: 'app-cm-tank-details-dialog',
    templateUrl: './cm-tank-details-dialog.component.html',
    styleUrls: ['./cm-tank-details-dialog.component.scss']
})
export class CmTankDetailsDialogComponent implements OnInit {
    id;
    isArchivedTank: boolean = false;
    tank: TankModel;
    station: StationModel;
    customer: CustomerModel;
    readonly: boolean;
    popup: boolean = false;
    isEditable: boolean = true;
    @ViewChild(CmTankDetailsComponent) _CmTankDetailsComponent: CmTankDetailsComponent;

    static DEFAULT_WIDTH: number = 800;

    constructor(
        public dialogRef: MatDialogRef<CmTankDetailsDialogComponent>,
        private _AuthenticationService: AuthenticationService,
        private _dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.id = data.id;
        this.isArchivedTank = data.isArchivedTank;
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

        this.isEditable = !this.readonly && !this.isArchivedTank;
    }

    onEdit() {
        this._CmTankDetailsComponent.onEdit();
    }

    onSave() {
        this._CmTankDetailsComponent.onSave();
    }

    onCancelEdit() {
        this._CmTankDetailsComponent.onCancelEdit();
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    onDeleteArchivedTank() {
        this._CmTankDetailsComponent.onDeleteArchivedTank();
    }

    onCancelAndUpdate() {
        this.dialogRef.close(true);
    }
}
