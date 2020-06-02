import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmPageComponent } from './am-page/am-page.component';
import { AmListComponent } from './am-list/am-list.component';
import { SharedModule } from '@shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
    declarations: [AmPageComponent, AmListComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot()
    ],
    exports: [
        AmListComponent
    ],
})
export class ActivityManagementModule {
}
