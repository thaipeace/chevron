import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersPageComponent} from './users-page/users-page.component';
import {UserManagementModule} from '@management/user-management/user-management.module';

@NgModule({
  declarations: [UsersPageComponent],
  imports: [
    CommonModule,
    UserManagementModule
  ]
})
export class UsersModule {
}
