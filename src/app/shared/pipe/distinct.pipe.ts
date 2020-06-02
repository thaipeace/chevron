import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinct'
})

export class DistinctPipe implements PipeTransform {

  transform(array: any[], key: string): any {
    let result = [];
    if (array && array.length) {
      array.forEach(a => {
        if ((key && !result.some(r => r[key] === a[key])) || !key && !result.some(r => r === a)) {
          result.push(a);
        }
      })
    }
    
    return result;
  }
}
