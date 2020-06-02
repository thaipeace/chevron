import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IBreadcrumb} from '@app/shared/models/interfaces/breadcrumb.interface';
import {ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router} from '@angular/router';
import {AuthenticationService} from '@app/user-management/shared/services/authentication.service';
import {UserManagementService} from '@shared/services/user-management.service';
import {combineLatest, from} from 'rxjs';
import {ISideBarMenuModel} from '@shared/models/data.models/menu-role.model';
import * as _ from 'lodash';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {AVAILABLE_ROUTES} from '@shared/constants/routes.constant';
import {NotificationDataService} from '@shared/services/data/notification-data.service';
import {StationDataService} from '@shared/services/data/station-data.service';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES, UserModel} from '@app/user-management/shared/models/data.models/user.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {NotificationModel} from '@shared/models/data.models/notification/notification.model';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';
import {TruckCompanyModel} from '@shared/models/data.models/fleet/truck-company.model';
import {IntegrationServicesService} from '@app/shared/services/data/integration-services.service';

@Component({
  selector: 'tql-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends DefaultComponent implements OnInit {
  @ViewChild('dropdownToggleElement') dropdownToggleElement: ElementRef<HTMLElement>;
  breadcrumbs: IBreadcrumb[] = [];
  currentRouteParent;
  menuRoles = [];
  notifications: NotificationModel[] = [];
  optionalIds: string[] = [];
  stations: StationModel[] = [];
  truckCompanies: TruckCompanyModel[] = [];
  user: UserModel;
  companyLogoUrl: any = {};
  serviceSummary: any = {};
  role: string = null;
  currentRoute: any;

  currentSubmenuIndex = 0;
  currentMenu: any;
  showMenuDropdown: boolean = false;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _AuthenticationService: AuthenticationService,
    private _UserManagementService: UserManagementService,
    private _CustomRouterService: CustomRouterService,
    private _NotificationDataService: NotificationDataService,
    private _TruckCompanyDataService: TruckCompanyDataService,
    private _StationDataService: StationDataService,
    private _DialogService: DialogService,
    private integrationServicesService: IntegrationServicesService
  ) {
    super();
    // subscribe to the NavigationEnd event
    this.addSubscribes(
      this._Router.events
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            const root: ActivatedRoute = this._ActivatedRoute.root;
            this.breadcrumbs = this._CustomRouterService.getBreadcrumbs(root);
            this.generateSubMenus();
          }
        })
    );


    this.integrationServicesService.integrationServices.subscribe(result => {
      if (result.integrationServices === undefined) {
        this.integrationServicesService.getIntegrationServices([
          (new Date()).setHours(0, 0, 0, 0), (new Date()).setHours(23, 59, 59, 999)
        ]);
      } else {
        this.serviceSummary = this.integrationServicesService.summary;
      }
    });

  }

  generateSubMenus() {
    //check submenu
    this.currentRouteParent = this._CustomRouterService.findCurrentRoute(this.breadcrumbs, this.menuRoles);
    if (this.currentRouteParent && this.currentRouteParent['menus']) {
      this.currentSubmenuIndex = _.findIndex(this.currentRouteParent['menus'], (el) => {
        return '/' + el.route === this._Router.url;
      });
    }

    //  check group menu
    if (this.currentRouteParent && this.currentRouteParent.groups) {
      let array = [];
      _.map(this.currentRouteParent.groups, (el) => {
        array = array.concat(el.menus);
      });
      this.currentMenu = _.find(array, (el) => {
        return '/' + el.route === this._Router.url;
      });

    }
  }

  ngOnInit() {
    this.addSubscribes(
      this._NotificationDataService.findByRoleObservable
        .subscribe((rs) => {
          this.notifications = rs;
          _.map(this.notifications, (el: NotificationModel) => {
            el.station = _.find(this.stations, (station) => {
              return el.getValue('stationId') === station.getId();
            });
          });
        }));

    this.addSubscribes(
      combineLatest(
        this._AuthenticationService.loginedUserObservable,
        this._UserManagementService.roleObservable,
        this._CustomRouterService.getCustomMenu()
      ).subscribe(([user, role, customMenu]) => {
        this.role = role;
        //submenu
        if (!!customMenu && customMenu.length > 0) {
          this.menuRoles = customMenu as ISideBarMenuModel[];
        } else {
          if (!!role) {
            this.menuRoles = AVAILABLE_ROUTES[role.toLowerCase()];
          }
        }

        this.currentRoute = this._CustomRouterService.findCurrentRoute(this.breadcrumbs, this.menuRoles);

        this.generateSubMenus();

        if (!!user) {
          //notifications start
          this.user = user;
          if (!this.notifications.length) {
            this.loadStations();
          }
        }

      }));

    this.integrationServicesService.broadcastIntegrationServices();
  }

  loadStations() {
    this.stations = [];
    this.optionalIds = [];
    this.truckCompanies = [];
    switch (this.user.roleId) {
      case DEFAULT_ROLES.CUSTOMER:
        this.addSubscribes(
          this._StationDataService.stationAllByUsernameObservable
            .subscribe((rs) => {
              if (rs === null) {
                this._StationDataService.findAllByUsername(this.user.username);
              } else {
                this.loadNotifications(rs);
              }
            }));
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
      case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        this.addSubscribes(
          this._TruckCompanyDataService.truckCompanyAllObservable
            .subscribe((rs) => {
              if (rs === null) {
              } else {
                this.addSubscribes(this._TruckCompanyDataService.currentTruckCompanyUserMappingSource
                  .subscribe((mappings) => {
                    this.loadNotifications(null, _.filter(rs, (company) => {
                      return _.find(mappings, {'truckCompanyId': company.getId()});
                    }));
                  }));
              }
            }));
        break;
      default:
        this.addSubscribes(
          this._StationDataService.stationAllObservable
            .subscribe((rs) => {
              if (rs === null) {
                this._StationDataService.findAll();
              }
            }));
        this.loadNotifications();
    }
  }

  loadNotifications(stations: StationModel[] = null, truckCompanies: TruckCompanyModel[] = null) {
    if (stations) {
      this.stations = stations;
      this.optionalIds = _.map(this.stations, (el: StationModel) => {
        return el.getId();
      });
    }

    if (truckCompanies) {
      this.truckCompanies = truckCompanies;
      this.optionalIds = _.map(this.truckCompanies, (el) => {
        return el.getId();
      });
    }

    switch (this.user.roleId) {
      case DEFAULT_ROLES.ADMIN:
        this._NotificationDataService.findForAdmin();
        break;
      case DEFAULT_ROLES.PLANNER:
        this._NotificationDataService.findForPlanner();
        break;
      case DEFAULT_ROLES.CUSTOMER:
        this._NotificationDataService.findForCustomer(this.optionalIds);
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
      case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        this._NotificationDataService.findForTruckOwnerOperator(this.optionalIds);
        break;
    }
  }

  reloadNotification() {
    this.notifications = [];
    this.loadNotifications();
  }

  onViewAllNotification() {
    // this._DialogService.open(NmListDialogComponent, {
    //     otherOptions: this.optionalIds.length ? this.optionalIds.join(',') : ''
    // });
    // console.log(this.menuRoles);
    // const notificationRoute = _.find(this.menuRoles, (el) => el.route.indexOf('notification-management') !== -1);
    // if (!!notificationRoute) {
    //   this._Router.navigate([notificationRoute.route, {otherOptions: this.optionalIds.length ? this.optionalIds.join(',') : ''}]);
    // }
    let route = '';
    switch (this.user.roleId) {
      case DEFAULT_ROLES.ADMIN:
        route = `${DEFAULT_PARENT_ROUTES.ADMIN}/notification-management`;
        break;
      case DEFAULT_ROLES.PLANNER:
        route = `${DEFAULT_PARENT_ROUTES.PLANNER}/notification-management`;
        break;
      case DEFAULT_ROLES.CUSTOMER:
        route = `${DEFAULT_PARENT_ROUTES.CUSTOMER}/notification-management`;
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
        route = `fleet/owner/notification-management`;
        break;
      case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        route = `fleet/operator/notification-management`;
        break;
    }

    this._Router.navigate([route, {otherOptions: this.optionalIds.length ? this.optionalIds.join(',') : ''}]);
  }

  goToUrl(index: any) {
    // console.log(this.currentRouteParent['menus'][index].route);
    this._Router.navigate(['/' + this.currentRouteParent['menus'][index].route]);
  }

  toggleMenuDropdown() {
    this.showMenuDropdown = !this.showMenuDropdown;
    // console.log(this.showMenuDropdown);
  }

  hideMenuDropdown() {
    this.showMenuDropdown = false;
    // console.log(this.showMenuDropdown);
  }
}
