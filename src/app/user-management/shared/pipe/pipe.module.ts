import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MappingLabelPipe} from './mapping-label.pipe';
import {KeyValueOrderPipe} from './key-value-order.pipe';
import {OrderByPipe} from './order-by.pipe';
import {FilterByPipe} from './filter-by.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [MappingLabelPipe, KeyValueOrderPipe, OrderByPipe, FilterByPipe],
  declarations: [MappingLabelPipe, KeyValueOrderPipe, OrderByPipe, FilterByPipe]
})
export class PipeModule {
}
