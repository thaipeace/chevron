import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/user-management/shared/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ChangePasswordBaseComponent } from '@app/shared/components/change-password-base/change-password-base.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class ChangePasswordComponent extends ChangePasswordBaseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected _router: Router,
    protected _authService: AuthenticationService,
    protected _snackBar: MatSnackBar,
  ) {
    super(
      _router,
      _authService,
      _snackBar
    );
  }

  ngOnInit() {
    // const user = this._authService.getLoginedUser();
    const tempUser = this._authService.tempUser;
    if (!!tempUser) {
      this.changePasswordModel = super.createChangePasswordModel(tempUser.username, tempUser.token);
    } else {
      this.route.queryParams.subscribe(({username}) => {
        if (!!username) {
          this.changePasswordModel = super.createChangePasswordModel(username, 'SuperUser'); // TODO
        } else {
          super.goToLogin();
        }
      });
    }
  }

  cancelClicked() {
    super.goToLogin();
  }
}
