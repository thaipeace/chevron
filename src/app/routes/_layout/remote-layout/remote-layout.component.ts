import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/user-management/shared/services';
import {UserManagementService} from '@shared/services/user-management.service';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {combineLatest} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {IBreadcrumb} from '@shared/models/interfaces/breadcrumb.interface';
import {ISideBarMenuModel} from '@shared/models/data.models/menu-role.model';
import * as _ from 'lodash';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {AVAILABLE_ROUTES} from '@shared/constants/routes.constant';

@Component({
    selector: 'app-remote-layout',
    templateUrl: './remote-layout.component.html',
    styleUrls: ['./remote-layout.component.scss']
})
export class RemoteLayoutComponent extends DefaultComponent implements OnInit, OnDestroy {
    breadcrumbs: IBreadcrumb[] = [];
    menuRoles = [];

    constructor(
        private _AuthenticationService: AuthenticationService,
        private _UserManagementService: UserManagementService,
        private _CustomRouterService: CustomRouterService,
        private _ActivatedRoute: ActivatedRoute,
        private _Router: Router,
    ) {
        super();
    }

    ngOnInit() {
        const self = this;
        self.addSubscribes(
            combineLatest(
                self._AuthenticationService.loginedUserObservable,
                self._UserManagementService.roleObservable,
            ).subscribe(([user, role]) => {
                if (!!user && !!role) {
                    const root: ActivatedRoute = self._ActivatedRoute.root;
                    self.breadcrumbs = self._CustomRouterService.getBreadcrumbs(root);
                    self.menuRoles = AVAILABLE_ROUTES[role.toLowerCase()];

                    //generate remote menus
                  this._CustomRouterService.generateRemoteMenu(self.breadcrumbs, self.menuRoles,role);
                    /*const currentRoute = self._CustomRouterService.findCurrentRoute(self.breadcrumbs, self.menuRoles);
                    console.log(currentRoute);
                    const remoteMenus = _.cloneDeep(currentRoute['subRoute']) as ISideBarMenuModel[];
                    if (currentRoute['route']) {
                        _.map(remoteMenus, (el) => {
                            el['route'] = 'remote/' + el['route'];
                            _.map(el['menus'], (menu) => {
                                menu['route'] = 'remote/' + menu['route'];
                            });
                        });
                    }

                    if (Array.isArray(remoteMenus)) {
                        remoteMenus.push({
                            name: 'Back',
                            icon: 'fal fa-long-arrow-left',
                            route: '',
                            click: () => {
                                self._Router.navigate([AVAILABLE_ROUTES[role.toLowerCase()][0]['route']]);
                            },
                            none: true
                        });
                        self._CustomRouterService.setCustomMenu(remoteMenus);
                    }*/
                }
            }));
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._CustomRouterService.setCustomMenu(null);
        console.log('check');
    }

}
