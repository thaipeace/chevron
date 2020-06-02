import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingLabelPipe } from '@shared/pipe/mapping-label.pipe';
import { KeyValueOrderPipe } from '@shared/pipe/key-value-order.pipe';
import { OrderByPipe } from '@shared/pipe/order-by.pipe';
import { FilterByPipe } from '@shared/pipe/filter-by.pipe';
import { FilterByKeyPipe } from './filter-by-key.pipe';
import { FilterByArrayPipe } from './filter-by-array.pipe';
import { SearchByPipe } from './search-by.pipe';
import { ArrayPipe } from './array.pipe';
import { SortArrayPipe } from './sort-array.pipe';
import { VarianceCheckingPipe } from './variance-checking.pipe';
import { SumPipe } from './sum.pipe';
import { CheckInArrayPipe } from './check-in-array.pipe';
import { TruncatePipe } from './truncate.pipe';
import { DistinctPipe } from './distinct.pipe';
import { ArrangeKeyValuePipe } from './arrange-key-value.pipe';
import { DateStringToTimePipe } from './date-string-to-time.pipe';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { XmlToJsonPipe } from './xml-to-json.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [
    MappingLabelPipe,
    KeyValueOrderPipe,
    OrderByPipe,
    FilterByPipe,
    FilterByKeyPipe,
    FilterByArrayPipe,
    SearchByPipe,
    ArrayPipe,
    SortArrayPipe,
    VarianceCheckingPipe,
    SumPipe,
    CheckInArrayPipe,
    TruncatePipe,
    DistinctPipe,
    ArrangeKeyValuePipe,
    DateStringToTimePipe,
    ObjectToArrayPipe,
    XmlToJsonPipe
  ],
  declarations: [
    MappingLabelPipe,
    KeyValueOrderPipe,
    OrderByPipe,
    FilterByPipe,
    FilterByKeyPipe,
    FilterByArrayPipe,
    SearchByPipe,
    ArrayPipe,
    SortArrayPipe,
    VarianceCheckingPipe,
    SumPipe,
    CheckInArrayPipe,
    TruncatePipe,
    DistinctPipe,
    ArrangeKeyValuePipe,
    DateStringToTimePipe,
    ObjectToArrayPipe,
    XmlToJsonPipe
  ]
})
export class PipeModule {}
