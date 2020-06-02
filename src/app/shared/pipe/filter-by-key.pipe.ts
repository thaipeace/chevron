import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterByKey'
})
export class FilterByKeyPipe implements PipeTransform {

  transform(items: any[], args?: string[]): any {
    let obj = {};

    return items;
 
  }

}
