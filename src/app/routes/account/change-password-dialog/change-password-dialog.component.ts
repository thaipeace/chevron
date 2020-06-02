import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {AuthenticationService} from '@app/user-management/shared/services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChangePasswordBaseComponent} from '@app/shared/components/change-password-base/change-password-base.component';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: [
    '../../authentication/change-password/change-password.component.scss',
    './change-password-dialog.component.scss'
  ]
})
export class ChangePasswordDialogComponent extends ChangePasswordBaseComponent implements OnInit {

  constructor(
    protected _router: Router,
    protected _authService: AuthenticationService,
    protected _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
  ) {
    super(
      _router,
      _authService,
      _snackBar
    );
  }

  ngOnInit() {
    this._router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.onCancel();
      }
    });
    const user = this._authService.getLoginedUser();
    if (!!user) {
      this.changePasswordModel = super.createChangePasswordModel(user.username, user.token);
    } else {
      super.goToLogin();
    }
  }

  cancelClicked() {
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
