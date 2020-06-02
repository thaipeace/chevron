import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {PipeModule} from './pipe/pipe.module';
import {ServiceModule} from './services/service.module';
import {TqlInterceptor} from './interceptor/tql.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipeModule,
    ServiceModule
  ],
  exports: [
    PipeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TqlInterceptor,
      multi: true
    }
  ]
})
export class SharedModule {
}
