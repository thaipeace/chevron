import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountRoutingModule} from '@app/routes/account/account-routing.module';
import {SharedModule} from '@shared/shared.module';
import {ProfileComponent} from '@app/routes/account/profile/profile.component';
import {ChangePasswordDialogComponent} from './change-password-dialog/change-password-dialog.component';
import {CoreModule} from '@app/core/core.module';
import {UpdateUserProfileDialogComponent} from './update-user-profile-dialog/update-user-profile-dialog.component';
import {UploadAvatarComponent} from './profile/upload-avatar/upload-avatar.component';
import {HelpComponent} from './help/help.component';

const dialogs = [
  ChangePasswordDialogComponent,
  UpdateUserProfileDialogComponent,
  UploadAvatarComponent
];

@NgModule({
  declarations: [...dialogs, ProfileComponent, UploadAvatarComponent, HelpComponent],
  entryComponents: [...dialogs],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AccountRoutingModule
  ],
  exports: [
    HelpComponent
  ]
})
export class AccountModule {
}
