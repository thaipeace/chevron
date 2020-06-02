import { Component, Inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StationDataService } from '@shared/services/data/station-data.service';
import { UserManagementModel } from '@shared/models/data.models/user-management.model';
import { UserService } from '@app/user-management/shared/services';
import { StationModel } from '@shared/models/data.models/station/station.model';
import * as _ from 'lodash';
import { CustomerStationUserMappingModel } from '@shared/models/data.models/customer/customer-station-user-mapping.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { emailValidator } from '@app/shared/validators/email';
import { MessageNotificationService } from '@app/shared/services/message-notification.service';
import { valueSafeValidator } from '@app/shared/validators/value-safe';

@Component({
  selector: 'app-role-customer-details-dialog',
  templateUrl: './role-customer-details-dialog.component.html',
  styleUrls: ['./role-customer-details-dialog.component.scss']
})
export class RoleCustomerDetailsDialogComponent implements OnInit, OnChanges {
  user: UserManagementModel;
  stations: StationModel[];
  selectedAssociatedStations: StationModel[];
  stationLocations: any[] = [];
  edit = false;
  rfEdit: FormGroup;
  username;
  _lockUser;
  _unLockUser;
  _resetPasswordUser;

  constructor(
    private _userService: UserService,
    private _messageNotification: MessageNotificationService,
    public dialogRef: MatDialogRef<RoleCustomerDetailsDialogComponent>,
    private _StationDataService: StationDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.user.subscribe(user => {
      this.user = user;
    });
    this._lockUser = data.lockUser;
    this._unLockUser = data.unLockUser;
    this._resetPasswordUser = data.resetPasswordUser;
  }

  ngOnInit() {
    this.rfEdit = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        valueSafeValidator
      ]),
      lastName: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        valueSafeValidator
      ]),
      emailId: new FormControl('', [Validators.required, emailValidator, valueSafeValidator])
    });

    this.rfEdit.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      emailId: this.user.emailId
    });

    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs == null) {
        this._StationDataService.findAll();
      } else {
        _.map(rs, el => {
          el.name = el.stationName;
        });
        this.stations = rs;
        this.loadMappingStations();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  loadMappingStations() {
    this._StationDataService.findAllByUsername(this.user.userName).then(rs => {
      _.map(rs, el => {
        el.name = el.stationName;
      });
      this.selectedAssociatedStations = rs;
      this.loadStationLocations();
    });
  }

  loadStationLocations() {
    _.map(this.selectedAssociatedStations, el => {
      if (el.geoPoint && el.geoPoint.hasPosition()) {
        this.stationLocations.push([el.geoPoint.getLat(), el.geoPoint.getLng()]);
      }
    });
  }

  changedData(key, newValue) {
    this.user[key] = newValue;
    this.user._data[key] = newValue;
  }

  saveData() {
    Object.keys(this.rfEdit.controls).forEach(control => {
      this.changedData(control, this.rfEdit.get(control).value);
    });

    const formData = UserManagementModel.getFormData();
    formData.updateValues(this.user._data);

    this._userService.update(formData).then(
      rs => {
        this._messageNotification.notification(rs);
      },
      error => console.log(error)
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  associate(item: any) {
    let array: CustomerStationUserMappingModel[] = [
      new CustomerStationUserMappingModel({
        customerId: item.customerId,
        stationId: item.getId(),
        userName: this.user.userName
      })
    ];
    this._StationDataService.associateStationUserMulti(array).then(() => {
      this.loadMappingStations();
    });
  }

  disassociate(item: any) {
    this._StationDataService.disassociateStationUser(item.getId(), this.user.userName).then(rs => {
      this.loadMappingStations();
    });
  }

  lockUser() {
    this._lockUser(this.user);
  }

  unLockUser() {
    this._unLockUser(this.user);
  }

  resetPasswordUser() {
    this._resetPasswordUser(this.user);
  }

  onEdit() {
    this.edit = true;
  }

  onCancelEdit() {
    Object.keys(this.rfEdit.controls).forEach(key =>
      this.rfEdit.get(key).setValue(this.user._data[key])
    );
    this.edit = false;
  }

  onSave() {
    if (this.rfEdit.valid) {
      this.saveData();
      this.edit = false;
    }
  }
}
