import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from './../../../shared/constants/value.constant';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@app/user-management/shared/services';
import {UserManagementService} from '@app/shared/services/user-management.service';
import {MatSnackBar} from '@angular/material';
import {UserModel, getRouteByRoleId, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {CustomerService} from '@app/shared/services/customer.service';
import {AVAILABLE_ROUTES} from '@shared/constants/routes.constant';
import {DEFAULT_VALUES} from '@shared/constants/config.constant';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';
import {ParamsService} from '@app/shared/services/params.service';
import {InitService} from '@shared/services/init.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  role = '';
  username: string;
  password: string;
  isChangePassword = false;
  changePasswordModel;
  user;
  errorMessage: string;
  version: string = '';
  phone: any = null;
  email: any = null;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private router: Router,
    private _UserManagementService: UserManagementService,
    private _customerService: CustomerService,
    private _snackBar: MatSnackBar,
    private _AuthenticationService: AuthenticationService,
    private _TerminalDataService: TerminalDataService,
    private paramsService: ParamsService,
    private _InitService: InitService
  ) {
    this.paramsService.params.subscribe(result => {
      if (!result.params) {
        this.paramsService.getAllParams(true);
      } else {
        this.phone = result.params.find(p => p.VarName === 'Support Phone Number');
        this.email = result.params.find(p => p.VarName === 'Support Email');
      }
    });

  }

  ngOnInit() {
    this._InitService.resetAll();
    this._AuthenticationService.clearOffline();
    this.version = DEFAULT_VALUES.VERSION;
    this.paramsService.broadcastParams();
  }

  login() {
    this._InitService.resetAll();
    if (this.username && this.password) {
      this._AuthenticationService.login(this.username, this.password)
        .toPromise()
        .then((rs) => {
          if (rs['isSuccess']) {
            const data = rs['data']['Find']['Result']['User'] as UserModel;
            const role = data['roleId'];
            // Login Success
            const routeByRole = getRouteByRoleId(role);
            this._UserManagementService.setRole(routeByRole);
            // load all terminal
            // this._TerminalDataService.findAll();
            switch (role) {
              case DEFAULT_ROLES.CUSTOMER:
                this._customerService.findCustomersByUsername(this.username).then(customers => {
                  const customer = customers.find(c => c.userName === this.username);
                  if (!customer) {
                    const message = 'Cannot find customer.';
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                  } else {
                    const message = 'Welcome to ATMOS!';
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    this._customerService.setCustomer(customer);
                    // this.authService.fetchDP();
                  }
                  this.router.navigate(['/' + AVAILABLE_ROUTES[routeByRole][0]['route']]);
                });
                break;
              default:
                const message = 'Welcome to ATMOS!';
                this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                this.router.navigate(['/' + AVAILABLE_ROUTES[routeByRole][0]['route']]);
            }
          } else {
            if (rs['data'] && rs['data']['Find']['Result']['User']) {
              const data = rs['data']['Find']['Result']['User'];
              // Login Success But Need To Reset Password
              if (data['status'] === 'Reset') {
                const message = 'Welcome to ATMOS! Please change your temporary login credentials';
                this._snackBar.open(message, X_BUTTON, {duration: 4000});
                this._AuthenticationService.tempUser = {username: this.username, token: data['token']};
                this.router.navigate(['/auth/change-password']);
              } else {
                // Login fail
                const message = rs['message'] ? rs['message'] : 'Invalid login.';
                this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                this.errorMessage = message;
              }
            } else {
              // Login fail
              const message = rs['message'] ? rs['message'] : 'Invalid login.';
              this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
              this.errorMessage = message;
            }
          }
        })
        .catch(error => {
          this._snackBar.open(error, X_BUTTON);
          this.errorMessage = error;
        });
    }
  }
}
