import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainPageComponent} from './main-page/main-page.component';
import {MainRoutingModule} from '@app/routes/main/main-routing.module';
import {SharedModule} from '@shared/shared.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    MapManagementModule
  ]
})
export class MainModule {
}
