import { CoreModule } from '@app/core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import {FormsModule} from '@angular/forms';
import {AuthenticationRoutingModule} from '@app/routes/authentication/authentication-routing.module';
import { AuthenticationPageComponent } from './authentication-page/authentication-page.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OnExpireComponent } from './on-expire/on-expire.component';

@NgModule({
  declarations: [LoginComponent, LogoutComponent, AuthenticationPageComponent, ChangePasswordComponent, OnExpireComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot([]),
    SharedModule,
    CoreModule,
    AuthenticationRoutingModule,
  ]
})
export class AuthenticationModule { }
