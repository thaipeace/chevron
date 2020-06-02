import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserManagementModel } from '@shared/models/data.models/user-management.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { emailValidator } from '@app/shared/validators/email';
import { UserService } from '@app/user-management/shared/services';
import { MessageNotificationService } from '@app/shared/services/message-notification.service';
import { valueSafeValidator } from '@app/shared/validators/value-safe';

@Component({
  selector: 'app-role-planner-details-dialog',
  templateUrl: './role-planner-details-dialog.component.html',
  styleUrls: ['./role-planner-details-dialog.component.scss']
})
export class RolePlannerDetailsDialogComponent implements OnInit {
  user: UserManagementModel;
  edit = false;
  rfEdit: FormGroup;
  username;
  _lockUser;
  _unLockUser;
  _resetPasswordUser;

  constructor(
    private _userService: UserService,
    private _messageNotification: MessageNotificationService,
    public dialogRef: MatDialogRef<RolePlannerDetailsDialogComponent>,
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
