import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrangeKeyValue'
})
export class ArrangeKeyValuePipe implements PipeTransform {

  transform(array: any[], arrangeList: string[], key?: string): any {
    let result = [];

    if (Array.isArray(array)) {
      arrangeList.forEach(a => {
        const items = key ? array.filter(arr => arr[key] === a) : array.filter(arr => arr === a);
        if (items.length) {
          result = result.concat(items);
        }
      });
    }

    return result;
  }

}
