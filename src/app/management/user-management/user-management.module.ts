import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {UmListComponent} from './um-list/um-list.component';
import {UmNewComponent} from './um-new/um-new.component';
import {UmDetailsModule} from '@management/user-management/um-details/um-details.module';

@NgModule({
    declarations: [
        UmListComponent,
        UmNewComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        UmDetailsModule
    ],
    exports: [
        UmListComponent,
    ],
    entryComponents: [
        UmNewComponent,
    ],
})
export class UserManagementModule {
}
