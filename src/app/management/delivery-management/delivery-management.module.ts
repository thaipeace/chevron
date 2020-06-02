import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmPageComponent } from './dm-page/dm-page.component';
import { DmLoadingComponent } from './dm-loading/dm-loading.component';
import { DmUnloadingComponent } from './dm-unloading/dm-unloading.component';
import { SharedModule } from '@shared/shared.module';
import { DmOnTransitComponent } from './dm-on-transit/dm-on-transit.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DmHintDialogComponent } from './dm-hint-dialog/dm-hint-dialog.component';
import { DmScheduleDialogComponent } from './dm-schedule-dialog/dm-schedule-dialog.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import { DmWindowsComponent } from './dm-windows/dm-windows.component';
import {SlideBarDynamicModule} from '@app/core/slide-bar-dynamic/slide-bar-dynamic.module';
import { DmWindowsDetailsCompactComponent } from './dm-windows-details-compact/dm-windows-details-compact.component';
import { DmWindowsNewDialogComponent } from './dm-windows-new-dialog/dm-windows-new-dialog.component';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';

@NgModule({
    declarations: [DmPageComponent, DmLoadingComponent, DmUnloadingComponent,
        DmOnTransitComponent,
        DmHintDialogComponent,
        DmScheduleDialogComponent,
        DmWindowsComponent,
        DmWindowsDetailsCompactComponent,
        DmWindowsNewDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
        Md2DatepickerModule,
        MdNativeDateModule,
      SlideBarDynamicModule,
      TimepickerModule.forRoot()
    ],
    entryComponents: [
        DmHintDialogComponent,
        DmScheduleDialogComponent,
      DmWindowsDetailsCompactComponent,
      DmWindowsNewDialogComponent
    ],
    exports: [
        DmPageComponent,
      DmWindowsComponent
    ]
})
export class DeliveryManagementModule {
}
