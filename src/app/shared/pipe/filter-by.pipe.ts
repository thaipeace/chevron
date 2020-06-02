import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], args?: string): any {
    const props = args.split('.');
    return items.filter(item => {
      const result = props.reduce((value, prop) => {
        if (value == undefined) {
          return value;
        }
        if (value[prop] != undefined) {
          return value[prop];
        }
      }, item);
      return result != undefined;
    });
  }
}
