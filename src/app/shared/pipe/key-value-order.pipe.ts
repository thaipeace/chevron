import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'keyValueOrder'
})
export class KeyValueOrderPipe implements PipeTransform {

  transform(value: any, excludes: string[] = [], topProps: string[] = [], isOrderByValue = false): any {
    if (!value) {
      return;
    }

    let keys = [];
    let objectKeys = Object.keys(value);
    let referenceValue = this.createReferenceValue(value);

    excludes.map((el, index) => {
      excludes[index] = el.toLowerCase();
    });

    topProps.map((el, index) => {
      let lowerCaseElement = el.toLowerCase();
      topProps[index] = lowerCaseElement;
      if (referenceValue[lowerCaseElement]) {
        keys.push({key: referenceValue[lowerCaseElement], value: value[referenceValue[lowerCaseElement]]});
      }
    });

    objectKeys.sort().forEach(e => {
      if (topProps.indexOf(e.toLowerCase()) < 0) {
        if (!excludes.length || excludes.indexOf(e.toLowerCase()) < 0) {
          keys.push({key: e, value: value[e]});
        }
      }
    });
    if (isOrderByValue) {
      keys = _.orderBy(keys, (el) => el.value);
    }
    return keys;
  }

  createReferenceValue(obj) {
    let objects = Object.keys(obj).map(function (key) {
      return [key.toLowerCase(), key];
    });
    return objects.reduce((obj, item) => {
      obj[item[0]] = item[1];
      return obj;
    }, {});
  }
}
