import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '@shared/shared.module';
import {CoreModule} from '@app/core/core.module';
import {RoutesModule} from '@app/routes/routes.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CustomerModule} from '@app/routes/customer/customer.module';
import {UserManagementModule} from './user-management/user-management.module';
import {ManagementModule} from '@management/management.module';
import {WsService} from './shared/services/ws.service';
import {BsDatepickerConfig, BsDaterangepickerConfig} from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducers/image.reducer';

const chevronModules = [
    UserManagementModule,
    CustomerModule,
];

export function getDatePickerConfig(): BsDatepickerConfig {
    return Object.assign(new BsDatepickerConfig(), {
        customTodayClass: 'custom-today-class',
      containerClass: 'theme-chevron mt-150',
      dateInputFormat: 'MMMM Do YYYY',
      selectFromOtherMonth: true
    });
}

export function getDateRangePickerConfig(): BsDaterangepickerConfig {
    //TODO, nam, not working, 07/10/2019
    return Object.assign(new BsDaterangepickerConfig(), {
        customTodayClass: 'custom-today-class',
      containerClass: 'theme-chevron',
      rangeInputFormat: 'YYYY/MM/DD',
      selectFromOtherMonth: true
    });
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        // ...loadingBarModules,
        // HomePageModule,
        BrowserModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        ...chevronModules,
        RoutesModule,
        ManagementModule,
        AppRoutingModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        StoreModule.forRoot({
            image: reducer
        })
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: BsDatepickerConfig, useFactory: getDatePickerConfig},
        {provide: BsDaterangepickerConfig, useFactory: getDateRangePickerConfig},
        WsService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

}
