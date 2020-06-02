import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArray'
})
export class SortArrayPipe implements PipeTransform {

  transform(array: any[], key: string, direction: string = 'asc'): any {
    return direction === 'asc' ? array.sort((a, b) => a[key] < b[key] ? -1 : 1) : array.sort((a, b) => b[key] < a[key] ? -1 : 1);
  }

}
