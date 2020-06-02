import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, UtilsService, AuthenticationService, ErrorHandlerService, UserService, RoleService} from './';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    UtilsService,
    AuthenticationService,
    ErrorHandlerService,
    UserService,
    RoleService
  ],
})
export class ServiceModule {
}
