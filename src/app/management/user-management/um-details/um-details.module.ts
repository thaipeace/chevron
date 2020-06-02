import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserStationMappingComponent} from '@management/user-management/um-details/user-station-mapping/user-station-mapping.component';
import {AssociatedList} from '@management/user-management/um-details/associated-list/associated-list.component';
import {RoleCustomerDetailsDialogComponent} from '@management/user-management/um-details/role-customer-details-dialog/role-customer-details-dialog.component';
import {RoleTruckCompanyDetailsDialogComponent} from '@management/user-management/um-details/role-truck-company-details-dialog/role-truck-company-details-dialog.component';
import {RolePlannerDetailsDialogComponent} from '@management/user-management/um-details/role-planner-details-dialog/role-planner-details-dialog.component';
import {SharedModule} from '@shared/shared.module';

@NgModule({
    declarations: [
        UserStationMappingComponent,
        AssociatedList,
        RoleCustomerDetailsDialogComponent,
        RoleTruckCompanyDetailsDialogComponent,
        RolePlannerDetailsDialogComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    entryComponents: [
        RoleCustomerDetailsDialogComponent,
        RoleTruckCompanyDetailsDialogComponent,
        RolePlannerDetailsDialogComponent,
    ],
})
export class UmDetailsModule {
}
