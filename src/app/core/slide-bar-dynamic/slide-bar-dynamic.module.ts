import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbdHostDirective} from './sbd-host.directive';
import {SbdMainComponent} from './sbd-main/sbd-main.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
    declarations: [SbdHostDirective, SbdMainComponent],
    imports: [
        CommonModule,
        PerfectScrollbarModule
    ],
    exports: [
        SbdMainComponent
    ]
})
export class SlideBarDynamicModule {
}
