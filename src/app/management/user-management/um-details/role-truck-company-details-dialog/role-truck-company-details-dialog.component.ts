import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserManagementModel } from '@shared/models/data.models/user-management.model';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { TruckCompanyUserMappingModel } from '@shared/models/data.models/fleet/truck-company-user-mapping.model';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { emailValidator } from '@app/shared/validators/email';
import { MessageNotificationService } from '@app/shared/services/message-notification.service';
import { UserService } from '@app/user-management/shared/services';
import { valueSafeValidator } from '@app/shared/validators/value-safe';

@Component({
  selector: 'app-role-truck-company-details-dialog',
  templateUrl: './role-truck-company-details-dialog.component.html',
  styleUrls: ['./role-truck-company-details-dialog.component.scss']
})
export class RoleTruckCompanyDetailsDialogComponent implements OnInit {
  user: UserManagementModel;
  truckCompaniesMapping: TruckCompanyUserMappingModel[] = [];
  truckCompanies: TruckCompanyModel[] = [];
  selectedTruckCompanies: TruckCompanyModel[] = [];
  aTSelectedTruckCompanies: any[] = [];
  aTTruckCompanies: any[] = [];
  edit = false;
  rfEdit: FormGroup;
  username;
  _lockUser;
  _unLockUser;
  _resetPasswordUser;

  constructor(
    private _userService: UserService,
    private _messageNotification: MessageNotificationService,
    public dialogRef: MatDialogRef<RoleTruckCompanyDetailsDialogComponent>,
    private _TruckCompanyDataService: TruckCompanyDataService,
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
    const self = this;

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

    self.loadTruckCompany().then(() => {
      self.loadTruckCompanyMapping();
    });
  }

  loadTruckCompanyMapping() {
    return this._TruckCompanyDataService
      .findUserTruckCompanyMappingByUsername(this.user.userName)
      .then(rs => {
        this.truckCompaniesMapping = rs;
        if (this.truckCompanies.length && this.truckCompaniesMapping.length) {
          this.selectedTruckCompanies = [];
          _.map(this.truckCompaniesMapping, el => {
            let found = _.find(this.truckCompanies, e => {
              return e.getId() === el.getValue('truckCompanyId');
            });
            if (found) {
              this.selectedTruckCompanies.push(found);
              this.truckCompanies.splice(this.truckCompanies.indexOf(found), 1);
            }
          });
        }

        this.updateATTruckList();
        this.updateSelectedATTruckList();
      });
  }

  loadTruckCompany() {
    return this._TruckCompanyDataService.findAll().then(rs => {
      this.truckCompanies = rs;
      this.updateATTruckList();
    });
  }

  changedData(key, newValue) {
    this.user[key] = newValue;
    this.user._data[key] = newValue;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  saveData() {
    Object.keys(this.rfEdit.controls).forEach(control => {
      this.changedData(control, this.rfEdit.get(control).value);
    });

    const formData = UserManagementModel.getFormData();
    formData.updateValues(this.user._data);

    this._userService.update(formData).then(rs => {
      this._messageNotification.notification(rs);
    });
  }

  selectTruckCompany(item: any) {
    this._TruckCompanyDataService
      .createUserTruckCompanyMapping(this.user.userName, item.id)
      .then(() => {
        let selectedItem = this.truckCompanies.find(e => {
          return e.getId() == item.id;
        });
        this.truckCompanies.splice(this.truckCompanies.indexOf(selectedItem), 1);
        this.selectedTruckCompanies.push(selectedItem);
        this.updateATTruckList();
        this.updateSelectedATTruckList();
      });
  }

  disassociate(item: any) {
    this._TruckCompanyDataService
      .deleteUserTruckCompanyMapping(this.user.userName, item.id)
      .then(() => {
        let selectedItem = this.selectedTruckCompanies.find(e => {
          return e.getId() == item.id;
        });
        this.selectedTruckCompanies.splice(this.selectedTruckCompanies.indexOf(selectedItem), 1);
        this.truckCompanies.push(selectedItem);
        this.updateATTruckList();
        this.updateSelectedATTruckList();
      });
  }

  updateATTruckList() {
    this.aTTruckCompanies = [];
    this.truckCompanies.map(el => {
      this.aTTruckCompanies.push({
        id: el.getId(),
        name: el.companyName
      });
    });
  }

  updateSelectedATTruckList() {
    this.aTSelectedTruckCompanies = [];
    this.selectedTruckCompanies.map(el => {
      this.aTSelectedTruckCompanies.push({
        id: el.getId(),
        name: el.companyName
      });
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
