import {Component, OnInit} from '@angular/core';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {AuthenticationService} from '@app/user-management/shared/services';
import {UserManagementService} from '@shared/services/user-management.service';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {ParamsService} from '@shared/services/params.service';
import {combineLatest} from 'rxjs';
import {ISideBarMenuModel} from '@shared/models/data.models/menu-role.model';
import {AVAILABLE_ROUTES} from '@shared/constants/routes.constant';
import {AboutDialogComponent} from '@app/core/about-dialog/about-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent extends DefaultComponent implements OnInit {
  menuRoles: any[] = [];
  back = null;
  role;
  companyLogoUrl: any = {};
  settingsLogo: string = null;
  enableFunctionality: any;
  isRemote: boolean;

  constructor(
    private _DialogService: DialogService,
    private _AuthenticationService: AuthenticationService,
    private _UserManagementService: UserManagementService,
    private _CustomRouterService: CustomRouterService,
    private _ParamsService: ParamsService,
    private _Router: Router
  ) {
    super();

    this.addSubscribes(combineLatest(
      this._AuthenticationService.loginedUserObservable,
      this._UserManagementService.roleObservable,
      this._CustomRouterService.getCustomMenu()
    ).subscribe(([user, role, customMenu]) => {
      // console.log(this._ParamsService.getMenuParams());
      // console.log(this._ParamsService.getRemoteParams());
      // console.log(customMenu);
      // console.log(role);
      this.role = role;
      if (!!customMenu && customMenu.length > 0) {
        this.menuRoles = customMenu as ISideBarMenuModel[];
        this.isRemote = true;
      } else {
        if (!!user && !!role) {
          this.menuRoles = AVAILABLE_ROUTES[role.toLowerCase()];
          this.isRemote = false;
        }
      }
      this.back = this.menuRoles.filter(item => item.none)[0];
      this.menuRoles = this.menuRoles.filter(item => !item.none);
      // console.log(role);
      // console.log(this.menuRoles);
    }));
  }

  ngOnInit() {
    this._ParamsService.params.subscribe(result => {
      if (!result.params) {
        return;
      }

      this.companyLogoUrl = result.params.find(p => p.VarName === 'Company Logo URL');
      this.enableFunctionality = result.params.find(p => p.VarName === 'Enable Experimental Functionality');
    });
    this._ParamsService.broadcastParams();

    this._ParamsService.icons.subscribe(result => {
      if (!result.icons.length) {
        return;
      }

      let logo = result.icons.find(i => i.type === 'logo');
      if (logo) {
        this.settingsLogo = logo.value;
      }
    });
    this._ParamsService.broadcastIcons();
  }

  onAbout() {
    this._DialogService.open(AboutDialogComponent, {}, {'width': '50vw'});
  }

}
