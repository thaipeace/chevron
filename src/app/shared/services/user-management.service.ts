import {Injectable} from '@angular/core';
import {AuthenticationService} from '@app/user-management/shared/services';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';

const APP_STORAGE_KEY = {
  USER_ROLE: 'USER_ROLE'
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  roleObservable = new BehaviorSubject(null);
  userObservable;

  constructor(private router: Router,
              private authService: AuthenticationService) {
    this.getRole();
    this.userObservable = this.authService.loginedUserObservable;

  }

  setRole(role) {
    localStorage.setItem(APP_STORAGE_KEY.USER_ROLE, role);
    this.getRole();
  }

  getRole() {
    const role = localStorage.getItem(APP_STORAGE_KEY.USER_ROLE);
    if (role) {
      this.roleObservable.next(role);
    } else {
      this.goToLogin();
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }

  getRoleIcon(role) {
    let icon = '';
    switch (role) {
      case DEFAULT_ROLES.ADMIN:
        icon = '';
        break;
      case DEFAULT_ROLES.CUSTOMER:
        icon = '';
        break;
      case DEFAULT_ROLES.PLANNER:
        icon = '';
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        icon = '';
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
        icon = '';
        break;
    }
    return icon;
  }

  getLoginUserDetails() {
    const username = this.authService.getUsername();
    const token = this.authService.getToken();

    if (username && token) {
      return this.authService.getUserDetails(username, token);
    }
    return Promise.resolve().then(_ => null);
  }
}
