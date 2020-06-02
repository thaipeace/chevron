import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterByArray'
})
export class FilterByArrayPipe implements PipeTransform {

  transform(items: any[], args?: any[]): any {
    return items.filter(item => {
      return args.indexOf(item) >= 0;
    });
  }

}
