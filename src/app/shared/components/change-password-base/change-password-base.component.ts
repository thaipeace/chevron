import { AuthenticationService } from '@app/user-management/shared/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { Router } from '@angular/router';

// @Component({
//   selector: 'app-change-password',
//   templateUrl: './change-password.component.html',
//   styleUrls: ['./change-password.component.scss'],
//   providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
// })
export class ChangePasswordBaseComponent {
  changePasswordModel;
  errorMessage: string;

  constructor(
    // private _location: Location,
    protected _router: Router,
    protected _authService: AuthenticationService,
    protected _snackBar: MatSnackBar,
  ) { }

//   ngOnInit() {
//     const user = this._authService.getLoginedUser();
//     const tempUser = this._authService.tempUser;
//     if (!!user) {
//       this.changePasswordModel = this._createChangePasswordModel(user.username, user.token);
//     } else if (!!tempUser) {
//       this.changePasswordModel = this._createChangePasswordModel(tempUser.username, tempUser.token);
//     } else {
//       this._goToLogin();
//     }
//   }

//   cancelClicked() {
//       this._goToLogin();
//     // if (window.history.length > 1) {
//     //   this._location.back();
//     // } else {
//     //   this._goToLogin();
//     // }
//   }

  changePassword() {
    if (this.changePasswordModel.newPassword !== this.changePasswordModel.reNewPassword) {
      const message = 'Confirm password and New password do not match';
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      this.errorMessage = message;
      return;
    }
    const updateObj = new TQLFormData();
    updateObj.setValue('userName', this.changePasswordModel.userName);
    updateObj.setValue('oldPassword', this.changePasswordModel.currentPassword);
    updateObj.setValue('password', this.changePasswordModel.newPassword);
    this._authService.changePassword(updateObj, this.changePasswordModel.token).then(rs => {
      if (rs && rs.length > 1 && rs[1]['Auth']['Status'] === 'Success') {
        const message = 'Your password has been changed successfully. Please login again.';
        this.errorMessage = '';
        this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        this._authService.clearOffline();
        this.goToLogin();
      } else {
        const message = rs && rs.length > 1 && rs[1]['Auth']['Message'] ? rs[1]['Auth']['Message'] : 'Some problems occur.';
        this.errorMessage = message;
        this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
    }).catch(error => {
      this._snackBar.open(error, X_BUTTON);
      this.errorMessage = error;
    });
  }

  protected goToLogin() {
    this._router.navigate(['/auth/login']);
  }

  protected createChangePasswordModel(userName: string, token: string) {
    return {
      userName,
      token,
      currentPassword: null,
      newPassword: null,
      reNewPassword: null,
    };
  }
}
