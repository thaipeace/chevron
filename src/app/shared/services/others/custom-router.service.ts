import {Injectable} from '@angular/core';
import {ActivatedRoute, PRIMARY_OUTLET, Router, Routes} from '@angular/router';
import {IBreadcrumb} from '@shared/models/interfaces/breadcrumb.interface';
import {IRoutingModel} from '@shared/models/interfaces/routing.interface';
import {DEFAULT_KEYS} from '@shared/constants/value.constant';
import {BehaviorSubject, Observable} from 'rxjs';
import {ISideBarMenuModel} from '@shared/models/data.models/menu-role.model';
import * as _ from 'lodash';
import {AVAILABLE_ROUTES} from '@shared/constants/routes.constant';

const ROUTE_DATA_BREADCRUMB: string = DEFAULT_KEYS.BREADCRUMB_KEY;

@Injectable({
  providedIn: 'root'
})
export class CustomRouterService {
  private _customMenu$: BehaviorSubject<ISideBarMenuModel[]> = new BehaviorSubject<ISideBarMenuModel[]>(null);
  private _customItem$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private _Router: Router,) {
  }

  getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/'),
        data = <IRoutingModel>child.snapshot.data[ROUTE_DATA_BREADCRUMB];
      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const resolveLabelFn = data[DEFAULT_KEYS.BREADCRUMB_RESOLVE_MODEL_FN];
      const model = data[DEFAULT_KEYS.BREADCRUMB_MODEL];
      const breadcrumb: IBreadcrumb = {
        label: resolveLabelFn ? resolveLabelFn(model) : '',
        url: url
      };

      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

  findCurrentRoute(breadcrumbs, menuRoles) {
    let currentRoute = null;
    if (breadcrumbs.length && menuRoles.length) {
      for (let i = 0; i < breadcrumbs.length; i++) {
        const route = breadcrumbs[i];
        currentRoute = _.find(menuRoles, (el) => {
          return route.url.indexOf('/' + el['route']) == 0;
        });
      }
    }
    return currentRoute;
  }

  setCustomMenu(customMenu: ISideBarMenuModel[]): void {
    this._customMenu$.next(customMenu);
  }

  getCustomMenu(): Observable<ISideBarMenuModel[]> {
    return this._customMenu$;
  }

  setCustomItem(item: string): void {
    this._customItem$.next(item);
  }

  getCustomItem(): Observable<string> {
    return this._customItem$;
  }

  generateRemoteMenu(breadcrumbs, menuRoles, role) {
    const self = this;
    const currentRoute = self.findCurrentRoute(breadcrumbs, menuRoles);
    const remoteMenus = _.cloneDeep(currentRoute['subRoute']) as ISideBarMenuModel[];
    if (currentRoute['route']) {
      _.map(remoteMenus, (el) => {
        el['route'] = 'remote/' + el['route'];
        _.map(el['menus'], (menu) => {
          menu['route'] = 'remote/' + menu['route'];
        });
        _.map(el['groups'], (group) => {
          _.map(group['menus'], (menu) => {
            menu['route'] = 'remote/' + menu['route'];
          });
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
      self.setCustomMenu(remoteMenus);
    }
  }
}
