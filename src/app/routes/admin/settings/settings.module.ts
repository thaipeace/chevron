import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {SharedModule} from '@app/shared/shared.module';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {SettingsComponent} from './settings.component';
import {OrganizationProfileComponent} from './organization-profile/organization-profile.component';
import {SystemParametersComponent} from './system-parameters/system-parameters.component';
import {TerminalComponent} from './terminal/terminal.component';
import {RegionComponent} from './region/region.component';
import {SupplyPointComponent} from './supply-point/supply-point.component';
import {FleetBaseComponent} from './fleet-base/fleet-base.component';
import {ExceptionAreaComponent} from './exception-area/exception-area.component';
import {TruckStopComponent} from './truck-stop/truck-stop.component';
import {HelpLinksComponent} from './help-links/help-links.component';
import {CreateBaseProductTypesComponent} from './base-product-types/create-base-product-types/create-base-product-types.component';
import {CreateProductTypesComponent} from './product-types/create-product-types/create-product-types.component';
import {HelpDocumentsComponent} from './help-documents/help-documents.component';
import {SettingsManagementModule} from '@management/settings-management/settings-management.module';
import {AccountModule} from '@app/routes/account/account.module';
import {BaseProductTypesComponent} from '@app/routes/admin/settings/base-product-types/base-product-types.component';
import {ProductTypesComponent} from '@app/routes/admin/settings/product-types/product-types.component';
import {TripPreferencesComponent} from './trip-preferences/trip-preferences.component';
import {OrderImportProductMappingComponent} from './order-import-product-mapping/order-import-product-mapping.component';
import {CreateOrderImportProductMappingComponent} from './order-import-product-mapping/create-order-import-product-mapping/create-order-import-product-mapping.component';
import {DeliveryPointGroupComponent} from './delivery-point-group/delivery-point-group.component';

@NgModule({
  declarations: [SettingsComponent, OrganizationProfileComponent, SystemParametersComponent, TerminalComponent,
    BaseProductTypesComponent, ProductTypesComponent, RegionComponent, SupplyPointComponent, FleetBaseComponent,
    ExceptionAreaComponent, TruckStopComponent, HelpLinksComponent, CreateBaseProductTypesComponent, CreateProductTypesComponent,
    HelpDocumentsComponent, TripPreferencesComponent, OrderImportProductMappingComponent, CreateOrderImportProductMappingComponent, DeliveryPointGroupComponent],
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    Md2DatepickerModule,
    MdNativeDateModule,
    AccountModule,
    SettingsManagementModule
  ],
  entryComponents: [
    CreateBaseProductTypesComponent,
    CreateProductTypesComponent,
    CreateOrderImportProductMappingComponent
  ]
})
export class SettingsModule {
}
