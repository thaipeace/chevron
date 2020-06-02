import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
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
}
