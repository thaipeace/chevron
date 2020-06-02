import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FmPageComponent} from './fm-page/fm-page.component';
import {FmTruckModule} from '@management/fleet-management/fm-truck/fm-truck.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {FmDriverModule} from '@management/fleet-management/fm-driver/fm-driver.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FmPageTreeviewComponent} from './fm-page-treeview/fm-page-treeview.component';
import {SharedModule} from '@shared/shared.module';
import {FmCompanyDetailsComponent} from './fm-company/fm-company-details/fm-company-details.component';
import {FmCompanyDeleteDialogComponent} from './fm-company/fm-company-delete-dialog/fm-company-delete-dialog.component';
import {FmCompanyEditableDialogComponent} from './fm-company/fm-company-editable-dialog/fm-company-editable-dialog.component';
import {FmPageReadonlyComponent} from './fm-page-readonly/fm-page-readonly.component';
import {FmPageEditableComponent} from './fm-page-editable/fm-page-editable.component';
import {FmPageSpecificComponent} from './fm-page-specific/fm-page-specific.component';

@NgModule({
    declarations: [FmPageComponent, FmPageTreeviewComponent, FmCompanyDetailsComponent,
        FmCompanyDeleteDialogComponent, FmCompanyEditableDialogComponent, FmPageReadonlyComponent,
        FmPageEditableComponent, FmPageSpecificComponent],
    imports: [
        CommonModule,
        RoutesRoutingModule,
        FmTruckModule,
        FmDriverModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    exports: [
        FmPageTreeviewComponent
    ],
    entryComponents: [
        FmCompanyEditableDialogComponent,
        FmCompanyDeleteDialogComponent,
    ],
})
export class FleetManagementModule {
}
