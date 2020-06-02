import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PipeModule} from '@shared/pipe/pipe.module';
import {MaterialModule} from '@shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivesModule} from './directives/directives.module';
import {ComponentsModule} from './components/components.module';
import {RoutesRoutingModule} from '@app/routes/routes-routing.module';
import {ServicesModule} from '@shared/services/services.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {Ng5SliderModule} from 'ng5-slider';
import { ApiDataService } from './services/api-data.service';
import { DataUtilService } from './services/data-util.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  suppressScrollY: false
};

@NgModule({
  declarations: [],
  imports: [
    ServicesModule,
    PerfectScrollbarModule,
    NgSelectModule,
    ColorPickerModule,
    FormsModule
  ],
  exports: [
    PipeModule,
    MaterialModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    ComponentsModule,
    RoutesRoutingModule,
    PerfectScrollbarModule,
    Ng5SliderModule,
    NgSelectModule,
    ColorPickerModule
  ],
  providers: [
    ApiDataService,
    DataUtilService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {
}
