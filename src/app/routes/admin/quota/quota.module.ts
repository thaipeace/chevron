import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuotaPageComponent} from './quota-page/quota-page.component';
import {SharedModule} from '@shared/shared.module';
import {QuotaManagementModule} from '@app/management/quota-management/quota-management.module';

@NgModule({
    declarations: [QuotaPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        QuotaManagementModule
    ]
})
export class QuotaModule {
}
