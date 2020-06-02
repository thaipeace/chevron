import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {UserService, AuthenticationService} from '@app/user-management/shared/services';
import {FormGroup, FormBuilder, FormControl, NgForm} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import {UserModel} from '@app/user-management/shared/models/data.models/user.model';

@Component({
  selector: 'app-update-user-profile-dialog',
  templateUrl: './update-user-profile-dialog.component.html',
  styleUrls: ['./update-user-profile-dialog.component.scss']
})
export class UpdateUserProfileDialogComponent implements OnInit {
  @ViewChild('f') public form: NgForm;
  keys: string[] = ['firstName', 'lastName', 'emailId'];
  formData: TQLFormData;

  constructor(
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateUserProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.formData = UserModel.getFormData();
    this.formData.updateValues(data.user._data);
  }

  ngOnInit() {
  }

  doUpdate() {
    this._userService.update(this.formData).then(rs => {
      if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
        const message = `Update successfully`;
        this._authenticationService.updateUserInfo(this.formData.getValue('firstName'), this.formData.getValue('lastName'), this.formData.getValue('emailId'));
        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        this.dialogRef.close();
      } else {
        if (rs && rs[1] && rs[1]['Save']['Message']) {
          const message = rs[1]['Save']['Message'];
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        } else {
          const message = `There are some problems. Please try again!`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
