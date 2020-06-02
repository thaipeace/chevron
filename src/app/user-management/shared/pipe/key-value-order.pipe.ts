import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'keyValueOrder'
})
export class KeyValueOrderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let keys = [];
    let objectKeys = Object.keys(value);
    for (let key of objectKeys) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }

}
