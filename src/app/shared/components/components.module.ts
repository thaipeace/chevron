import { PipeModule } from '@shared/pipe/pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../directives/directives.module';
import { CustomMenuListComponent, SelectMenuComponent } from './select-menu/select-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import {
  EmptyTemplateDirective,
  SelectItemTemplateDirective
} from '@shared/components/select-menu/select-menu-template.directive';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { ChartsModule } from './charts/charts.module';
import { LastUpdatedInfoComponent } from './last-updated-info/last-updated-info.component';
import { EditableTextboxComponent } from './editable-textbox/editable-textbox.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChevronTreeviewComponent } from './chevron-treeview/chevron-treeview.component';
import { MaterialModule } from '../material/material.module';
import { MapModule } from '@shared/components/map/map.module';
import { TextFieldComponent } from './text-field/text-field.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { InfoDashboardComponent } from './info-dashboard/info-dashboard.component';
import { InfoItemComponent } from './info-item/info-item.component';
import { LocationComponent } from './location/location.component';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { InputPasswordToggleComponent } from '@shared/components/input-password-toggle/input-password-toggle.component';
import { DialogsModule } from '@shared/components/dialogs/dialogs.module';
import { InputFieldComponent } from './input-field/input-field.component';
import { ContactNumbersComponent } from './contact-numbers/contact-numbers.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ArrayInputComponent } from './array-input/array-input.component';
import { PaginatorCustomComponent } from './paginator-custom/paginator-custom.component';
import { DialogAlertComponent } from '@shared/components/dialog-template/dialog-alert/dialog-alert.component';
import { TableGeoSmallComponent } from './table-geo-small/table-geo-small.component';
import { SpinLoadingComponent } from './spin-loading/spin-loading.component';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { TableSelectComponent } from './table-select/table-select.component';
import { TableSelectAdvanceComponent } from './table-select-advance/table-select-advance.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableMiniActionsComponent } from './table-mini-actions/table-mini-actions.component';
import { HintMarkersComponent } from './hint-markers/hint-markers.component';
import { MarkerElementComponent } from './marker-element/marker-element.component';
import { UploadComponentsModule } from './upload-components/upload-components.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  suppressScrollY: false
};

@NgModule({
  declarations: [
    SelectMenuComponent,
    SelectItemTemplateDirective,
    EmptyTemplateDirective,
    LoadingIndicatorComponent,
    LastUpdatedInfoComponent,
    EditableTextboxComponent,
    ChevronTreeviewComponent,
    TextFieldComponent,
    SearchBoxComponent,
    CustomMenuListComponent,
    InfoDashboardComponent,
    InfoItemComponent,
    LocationComponent,
    InputPasswordToggleComponent,
    InputFieldComponent,
    ContactNumbersComponent,
    ArrayInputComponent,
    PaginatorCustomComponent,
    DialogAlertComponent,
    TableGeoSmallComponent,
    SpinLoadingComponent,
    TableSelectComponent,
    TableSelectAdvanceComponent,
    TableMiniActionsComponent,
    HintMarkersComponent,
    MarkerElementComponent,
  ],
  entryComponents: [DialogAlertComponent, SpinLoadingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    PipeModule,
    DirectivesModule,
    MatMenuModule,
    ReactiveFormsModule,
    MaterialModule,
    MapModule,
    PerfectScrollbarModule,
    DialogsModule,
    Md2DatepickerModule,
    MdNativeDateModule,
    NgSelectModule,
    UploadComponentsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [
    ChartsModule,
    SelectMenuComponent,
    LoadingIndicatorComponent,
    LastUpdatedInfoComponent,
    EditableTextboxComponent,
    ChevronTreeviewComponent,
    MapModule,
    TextFieldComponent,
    SearchBoxComponent,
    CustomMenuListComponent,
    InfoDashboardComponent,
    LocationComponent,
    InputPasswordToggleComponent,
    DialogsModule,
    InputFieldComponent,
    ContactNumbersComponent,
    ArrayInputComponent,
    PaginatorCustomComponent,
    TableGeoSmallComponent,
    TableSelectComponent,
    TableSelectAdvanceComponent,
    TableMiniActionsComponent,
    HintMarkersComponent,
    UploadComponentsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule { }
