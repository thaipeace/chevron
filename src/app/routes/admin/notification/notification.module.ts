import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';
import {NotificationManagementModule} from '@management/notification-management/notification-management.module';

@NgModule({
    declarations: [NmPageComponent],
    imports: [
        CommonModule,
        NotificationManagementModule
    ]
})
export class NotificationModule {
}
