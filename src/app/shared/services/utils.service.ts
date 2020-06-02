import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as xml2js from 'xml2js';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '../constants/value.constant';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private _snackBar: MatSnackBar
  ) {
  }

  static replaceAll(str, find, replace) {
    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }

    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  static isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  static isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  static sortJson(json, keys) {
    var tmp1 = {};
    var tmp2 = _.cloneDeep(json);
    for (let i = 0; i < keys.length; i++) {
      if (tmp2.hasOwnProperty(keys[i])) {
        tmp1[keys[i]] = tmp2[keys[i]];
        delete tmp2[keys[i]];
      }
    }
    for (let attrname of Object.keys(tmp2)) {
      tmp1[attrname] = tmp2[attrname];
    }

    return tmp1;
  }

  static parseXml(xmlString, callback = (rs) => {
  }) {
    return xml2js.parseString(xmlString, { explicitArray: false, mergeAttrs: true }, (error, result) => {
      if (error) {
        throw new Error(error);
      } else {
        return callback(result);
      }
    });
  }

  static parseFloatFix(value: string, fixNum: number = 2): number {
    if (isNaN(+value)) {
      return null;
    }
    return parseFloat((+value).toFixed(fixNum));
  }

  static groupBy(array: any[], key: string) {
    return array.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  static getStartOfDayTime(date: Date): number {
    date.setHours(0, 0, 0, 0);

    return date.getTime();
  }

  static getEndOfDayTime(date: Date): number {
    date.setHours(23, 59, 59, 999);

    return date.getTime();
  }

  static sortByNameFn(a: any, b: any, key: string): number {
    const nameA = a[key].toUpperCase();
    const nameB = b[key].toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  }

  static isEmptyObj(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  static calcTotalValueByProperty(array: any[], key: string): number {
    let total = 0;
    array.forEach(item => {
      total += parseFloat(item[key]);
    });

    return total;
  }

  static getMonthName(date: Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()]; // getMonth method returns the month of the date (0-January :: 11-December)

    return month;
  }

  static getTotalValue(array: any[], key: string) {
    let total = 0;
    array.forEach(item => {
      total += parseFloat(item[key]);
    });

    return total;
  }

  static pushOrCreateIfNull(element: any, array: any) {
    if (!!array) {
      array.push(element);
    } else {
      array = [element];
    }
  }

  // Enum helpers
  static getNamesAndValues<T extends number>(e: any) {
    return UtilsService.getNames(e).map(n => ({ name: n, value: e[n] as T }));
  }

  static getNames(e: any) {
    return UtilsService.getObjValues(e).filter(v => typeof v === 'string') as string[];
  }

  static getValues<T extends number>(e: any) {
    return UtilsService.getObjValues(e).filter(v => typeof v === 'number') as T[];
  }

  static getSelectList<T extends number, U>(e: any, stringConverter: (arg: U) => string) {
    const selectList = new Map<T, string>();
    this.getValues(e).forEach(val => selectList.set(val as T, stringConverter(val as unknown as U)));
    return selectList;
  }

  static getSelectListAsArray<T extends number, U>(e: any, stringConverter: (arg: U) => string) {
    return Array.from(this.getSelectList(e, stringConverter), value => ({ value: value[0] as T, presentation: value[1] }));
  }

  static getObjValues(e: any): (number | string)[] {
    return Object.keys(e).map(k => e[k]);
  }

  static openNewWindow(url: string) {
    if (window) {
      window.open(url, '_blank');
    }
  }

  static filterPredicate(data: Element, filter: string) {
    if (!data || !data['_data']) {
      return false;
    }
    return _.some(data['_data'], (el) => {
      return el && typeof el === 'string' && el.toLowerCase().indexOf(filter) !== -1;
    });
  }

  static bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return 'n/a';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + '', 10);
    if (i === 0) {
      return `${bytes} ${sizes[i]})`;
    }
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }

  static copyStringToClipboard (str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
  }
}


