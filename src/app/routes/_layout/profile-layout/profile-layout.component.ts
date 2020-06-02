import {Component, OnInit, OnDestroy} from '@angular/core';
import {ISideBarMenuModel} from '@app/shared/models/data.models/menu-role.model';
import {AuthenticationService} from '@app/user-management/shared/services';
import {UserManagementService} from '@app/shared/services/user-management.service';
import {combineLatest} from 'rxjs';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {AVAILABLE_ROUTES, CUSTOM_ROUTE_NAMES} from '@shared/constants/routes.constant';
import {Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-profile-layout',
    templateUrl: './profile-layout.component.html',
    styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent extends DefaultComponent implements OnInit, OnDestroy {

    constructor(
        private _AuthenticationService: AuthenticationService,
        private _UserManagementService: UserManagementService,
        private _CustomRouterService: CustomRouterService,
        private _Router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.addSubscribes(
            combineLatest(
                this._AuthenticationService.loginedUserObservable,
                this._UserManagementService.roleObservable,
                this._CustomRouterService.getCustomItem()
            ).subscribe(([user, role, customItem]) => {
                if (!!user && !!role && !!customItem) {
                    const profileMenu: ISideBarMenuModel[] = [];
                    switch (customItem) {
                        case CUSTOM_ROUTE_NAMES.PROFILE:
                        case CUSTOM_ROUTE_NAMES.HELP:
                            const menu = AVAILABLE_ROUTES.other.profile;
                            menu['route'] = _.replace(menu['route'], '{username}', user.username);
                            profileMenu.push(menu);
                            profileMenu.push(AVAILABLE_ROUTES.other.help);
                            break;
                        default:
                    }
                    const backMenu = AVAILABLE_ROUTES.other.back;
                    backMenu['click'] = () => {
                        this._Router.navigate([AVAILABLE_ROUTES[role.toLowerCase()][0]['route']]);
                    };
                    profileMenu.push(backMenu);
                    this._CustomRouterService.setCustomMenu(profileMenu);
                }
            })
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._CustomRouterService.setCustomMenu(null);
    }

}
