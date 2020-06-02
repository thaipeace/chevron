import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainPageComponent} from '@app/routes/main/main-page/main-page.component';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {AuthGuard} from '@app/guard/auth.guard';
import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';

const resolveLabelFn = (model) => {
  return model;
};

const routes: Routes = [
  {
    path: DEFAULT_PARENT_ROUTES.MAIN,
    component: LayoutComponent,
    data: {
      breadcrumb: {
        model: '',
        resolveLabelFn: resolveLabelFn
      },
      role: [DEFAULT_ROLES.ADMIN]
    },
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'notification-management', redirectTo: '/admin/notification-management', pathMatch: 'full'},
      {
        path: 'dashboard',
        component: MainPageComponent,
        data: {
          breadcrumb: {
            model: 'Main Dashboard',
            resolveLabelFn: resolveLabelFn,
          },
        },
      }],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
