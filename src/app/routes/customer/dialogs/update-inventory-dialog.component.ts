import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IHashObject } from '@app/shared/models/interfaces/generic-types.interface';
import { IStationTankModel, CustomerStationModel } from '@app/shared/models/data.models/customer/customer-station.model';
import { UtilsService } from '@app/shared/services/utils.service';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';
import * as moment from 'moment';
import { AuthenticationService } from '@app/user-management/shared/services';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-update-inventory-dialog',
  templateUrl: 'update-inventory-dialog.component.html'
})
export class UpdateInventoryDialogComponent implements OnInit {
  inventoryForm: FormGroup;
  commentControl: FormControl = new FormControl('', [Validators.required]);
  tanks: any[];
  openingDialog;
  station;
  userRoleName: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateInventoryDialogComponent>,
    private _authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: { station: CustomerStationModel }) {

    const { station } = this.data;
    this.station = station;
    const inventoryControls: IHashObject<FormControl> = {};
    this.tanks = this.station.stationTanks;
    this.station.stationTanks.sort((a, b) => UtilsService.sortByNameFn(a, b, 'productCode')).forEach((tank) => {
      inventoryControls[tank.sysId] = new FormControl(tank.currentVolume,
        [Validators.required, Validators.min(0), Validators.max(tank.tankCapacity)]);
    });
    this.inventoryForm = fb.group(inventoryControls);
  }

  ngOnInit() {
    combineLatest(
      this._authenticationService.loginedUserObservable,
    ).subscribe(([user]) => {
      if (user) {
        this.userRoleName = user.roleName;
      }
    });
  }

  onUpdateClick() {
    const rawValue = this.inventoryForm.getRawValue();
    const tanks = Object.keys(rawValue).map(key => {
      return {
        sysId: key,
        currentVolume: rawValue[key]
      };
    });
    this.dialogRef.close({
      comment: this.commentControl.value,
      tanks: tanks,
      rawValue: rawValue
    });
  }

  quickSetInventoryValue(tankId: string, newValue: number) {
    const control = this.getInventoryControl(tankId);
    control.setValue(newValue);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getInventoryControl(tankId: string): AbstractControl {
    return this.inventoryForm.controls[tankId];
  }

  getTankId(tank: TankModel): string {
    return tank.sysId;
  }

  parseTimeStampToString(date: number): string {
    return moment(+date).format('YYYY-MM-DD (HH:mm)');
  }
}
