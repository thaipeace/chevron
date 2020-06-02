import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return _.sortBy(value, (el) => {
      let keys = args.split('.');
      _.map(keys, (key) => {
        el = el[key];
      });
      return el;
    });
  }

}
