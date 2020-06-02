import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CustomerPageComponent} from './customer-page/customer-page.component';
import {CustomerTreeviewComponent} from './customer-treeview/customer-treeview.component';
import {CustomerMapComponent} from './customer-map/customer-map.component';
import {CustomerManagementModule} from '@management/customer-management/customer-management.module';

@NgModule({
  declarations: [CustomerPageComponent, CustomerTreeviewComponent, CustomerMapComponent],
  imports: [
    CommonModule,
    SharedModule,
    RoutesRoutingModule,
    ReactiveFormsModule,
    CustomerManagementModule
  ]
})
export class CustomerModule {
}
