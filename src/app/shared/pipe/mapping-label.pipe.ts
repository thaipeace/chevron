import {Pipe, PipeTransform} from '@angular/core';
import {IHashObject} from '../models/interfaces/generic-types.interface';

@Pipe({
  name: 'mappingLabel'
})
export class MappingLabelPipe implements PipeTransform {

  transform(value: any, customValue?: IHashObject<string>): any {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }

    let result;
    if (!!customValue && !!customValue[value]) {
      result = customValue[value];
    } else {
      result = value;
    }
    result = this.capitalize(result);
    return result.replace(/([A-Z])/g, ' $1').trim();
  }

  capitalize = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

