import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from '@shared/services/api.service';
import {UtilsService} from '@shared/services/utils.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {DriverDataService} from '@shared/services/data/driver-data.service';
import {TankDataService} from '@shared/services/data/tank-data.service';
import {StationDataService} from '@shared/services/data/station-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {MicsDataService} from '@shared/services/others/mics-data.service';
import {OrderDataService} from '@shared/services/data/order-data.service';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {InventoryDataService} from '@shared/services/data/inventory-data.service';
import {DeliveryDataService} from './data/delivery-data.service';
import {MapService} from '@shared/services/map.service';
import {QuotaDataService} from '@shared/services/data/quota-data.service';
import {CustomerTreeviewLoadingService} from './customer-treeview-loading.service';
import {ToastService} from '@shared/services/others/toast.service';
import {ResizeService} from '@shared/services/resize.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {StorageService} from '@shared/services/storage.service';
import {TripDataService} from './data/trip-data.service';
import {ParamsService} from './params.service';
import {IntegrationServicesService} from './data/integration-services.service';
import {BaseProductDataService} from '@shared/services/data/settings/base-product-data.service';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';
import {RegionDataService} from '@shared/services/data/settings/region-data.service';
import {SupplyPointDataService} from '@shared/services/data/settings/supply-point-data.service';
import {FleetBaseDataService} from '@shared/services/data/settings/fleet-base-data.service';
import {ExceptionAreaDataService} from '@shared/services/data/settings/exception-area-data.service';
import {ProductDataService} from '@shared/services/data/product-data.service';
import {DeliveryPointGroupDataService} from '@shared/services/data/settings/delivery-point-group-data.service';
import {TripPreferenceService} from '@shared/services/data/settings/trip-preference.service';
import {ReportDataService} from '@shared/services/data/report-data.service';
import {InitService} from '@shared/services/init.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    UtilsService,
    ErrorHandlerService,
    TruckDataService,
    DriverDataService,
    TankDataService,
    StationDataService,
    DialogService,
    MicsDataService,
    OrderDataService,
    CustomRouterService,
    InventoryDataService,
    DeliveryDataService,
    MapService,
    QuotaDataService,
    ToastService,
    CustomerTreeviewLoadingService,
    ResizeService,
    SideBarService,
    StorageService,
    TripDataService,
    ParamsService,
    IntegrationServicesService,
    BaseProductDataService,
    TerminalDataService,
    RegionDataService,
    SupplyPointDataService,
    FleetBaseDataService,
    ExceptionAreaDataService,
    ProductDataService,
    DeliveryPointGroupDataService,
    TripPreferenceService,
    ReportDataService,
    InitService
  ]
})
export class ServicesModule {
}
