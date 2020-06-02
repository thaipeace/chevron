import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from '@app/routes/authentication/login/login.component';
import {LogoutComponent} from '@app/routes/authentication/logout/logout.component';
import {AuthenticationPageComponent} from '@app/routes/authentication/authentication-page/authentication-page.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {OnExpireComponent} from '@app/routes/authentication/on-expire/on-expire.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticationPageComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'logout', component: LogoutComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  },
  {path: 'auth/expired', component: OnExpireComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
