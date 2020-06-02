import {Injectable, EventEmitter} from '@angular/core';
import {Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '@app/user-management/shared/services';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
    public user: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.protectByRole(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.protectByRole(route, state);
    }

    protectByRole(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authService.getLoginedUser();

        if (!(!!route.data.role) || (!!currentUser && route.data.role.indexOf(currentUser.roleId) !== -1)) {
            return true;
        }

        // navigate to not found page
        this.router.navigate(['/notfound'], {queryParams: {type: '403'}});
        return false;
    }
}
