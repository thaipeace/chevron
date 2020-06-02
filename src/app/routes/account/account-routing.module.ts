import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from '@app/routes/account/profile/profile.component';
import {ProfileLayoutComponent} from '../_layout/profile-layout/profile-layout.component';
import {HelpComponent} from '@app/routes/account/help/help.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';
import {RemoteLayoutComponent} from '@app/routes/_layout/remote-layout/remote-layout.component';

const resolveLabelFn = (model) => {
  return model;
};

const ACCOUNT_ROUTES: Routes = [
  {
    path: 'account',
    component: ProfileLayoutComponent, data: {
      breadcrumb: {
        model: 'Account',
        resolveLabelFn: resolveLabelFn,
      },
      role: Object.keys(DEFAULT_ROLES).map(function (key) {
        return DEFAULT_ROLES[key];
      })
    },
    children: [
      {
        path: 'profile/:id', component: ProfileComponent, data: {
          breadcrumb: {
            model: 'Profile',
            resolveLabelFn: resolveLabelFn,
          }
        }
      },
      {
        path: 'help',
        component: HelpComponent, data: {
          breadcrumb: {
            model: 'Help',
            resolveLabelFn: resolveLabelFn,
          }
        },
      },
      {path: '', redirectTo: 'account', pathMatch: 'full'},
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
];

const routes: Routes = [
  ...ACCOUNT_ROUTES,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
