import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {EditSystemParametersComponent} from './edit-system-parameters/edit-system-parameters.component';
import {EditProductTypesComponent} from './edit-product-types/edit-product-types.component';
import {SmTruckStopModule} from '@management/settings-management/sm-truck-stop/sm-truck-stop.module';
import {SmFleetBaseModule} from '@management/settings-management/sm-fleet-base/sm-fleet-base.module';
import {SmClassificationExceptionAreaModule} from '@management/settings-management/sm-classification-exception-area/sm-classification-exception-area.module';
import {EditBaseProductTypesComponent} from './edit-base-product-types/edit-base-product-types.component';
import {EditTripReferenceComponent} from './edit-trip-reference/edit-trip-reference.component';
import {SharedModule} from '@app/shared/shared.module';
import {EditOrderImportProductMappingComponent} from './edit-order-import-product-mapping/edit-order-import-product-mapping.component';
import {SmDeliveryPointGroupModule} from '@management/settings-management/sm-delivery-point-group/sm-delivery-point-group.module';
import {SmHelpDocumentModule} from '@management/settings-management/sm-help-document/sm-help-document.module';
import {SmTripPreferenceModule} from '@management/settings-management/sm-trip-preference/sm-trip-preference.module';
import {SmHelpLinkModule} from '@management/settings-management/sm-help-link/sm-help-link.module';
import {SmRegionModule} from '@management/settings-management/sm-region/sm-region.module';
import {SmTerminalModule} from '@management/settings-management/sm-terminal/sm-terminal.module';
import {SmSupplyPointModule} from '@management/settings-management/sm-supply-point/sm-supply-point.module';

@NgModule({
  declarations: [EditSystemParametersComponent,
    EditProductTypesComponent,
    EditBaseProductTypesComponent, EditTripReferenceComponent, EditOrderImportProductMappingComponent],
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    Md2DatepickerModule,
    MdNativeDateModule,
    SmTruckStopModule,
    SmFleetBaseModule,
    SmClassificationExceptionAreaModule,
    SmDeliveryPointGroupModule
  ],
  exports: [
    EditSystemParametersComponent,
    EditProductTypesComponent,
    EditBaseProductTypesComponent,
    EditTripReferenceComponent,
    SmTruckStopModule,
    SmFleetBaseModule,
    SmClassificationExceptionAreaModule,
    SmDeliveryPointGroupModule,
    SmHelpDocumentModule,
    SmTripPreferenceModule,
    SmHelpLinkModule,
    SmRegionModule,
    SmTerminalModule,
    SmSupplyPointModule
  ],
  entryComponents: [
    EditSystemParametersComponent,
    EditProductTypesComponent,
    EditBaseProductTypesComponent,
    EditTripReferenceComponent,
    EditOrderImportProductMappingComponent
  ]
})
export class SettingsManagementModule {
}
