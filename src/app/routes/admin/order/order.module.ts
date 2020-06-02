import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderPageComponent} from './order-page/order-page.component';
import {OrderManagementModule} from '@management/order-management/order-management.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';

@NgModule({
  declarations: [OrderPageComponent],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    OrderManagementModule
  ]
})
export class OrderModule {
}
