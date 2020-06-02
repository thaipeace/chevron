import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '@app/core/core.module';
import {LayoutComponent} from './_layout/layout/layout.component';
import {NoLayoutComponent} from './_layout/no-layout/no-layout.component';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {LoadingBarHttpModule} from '@ngx-loading-bar/http';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AuthenticationModule} from '@app/routes/authentication/authentication.module';
import {AdminModule} from '@app/routes/admin/admin.module';
import {AccountModule} from '@app/routes/account/account.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {ProfileLayoutComponent} from './_layout/profile-layout/profile-layout.component';
import {RemoteLayoutComponent} from './_layout/remote-layout/remote-layout.component';
import {FleetModule} from '@app/routes/fleet/fleet.module';
import {SharedModule} from '@shared/shared.module';
import {PlannerModule} from '@app/routes/planner/planner.module';
import {MainModule} from '@app/routes/main/main.module';

const routeModules = [
  MainModule,
  PlannerModule,
  AdminModule,
  AccountModule,
  AuthenticationModule,
  FleetModule,
];

@NgModule({
  entryComponents: [
  ],
  declarations: [
    LayoutComponent, NoLayoutComponent,
    ProfileLayoutComponent,
    RemoteLayoutComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    LoadingBarHttpClientModule,
    LoadingBarHttpModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    SharedModule,
    ...routeModules,
    RoutesRoutingModule,
  ],
  providers: [
  ]
})
export class RoutesModule {
}
