import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import {HomePageComponent} from '@app/routes/terminal/home-page/home-page.component';
// import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';

const routes: Routes = [
  // {
  //   path: 'terminal',
  //   component: LayoutComponent,
  //   children: [
  //     {path: 'home', component: HomePageComponent},
  //   ]
  // },
  {path: 'login', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: 'expired', redirectTo: '/auth/expired', pathMatch: 'full'},
  {path: 'logout', redirectTo: '/auth/logout', pathMatch: 'full'},
  {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  // {path: '**', redirectTo: '/auth/login'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule {
}
