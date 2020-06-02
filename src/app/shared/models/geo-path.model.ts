import {GeoPoint} from '@shared/models/geo-point.model';

export class GeoPath {
  array: GeoPoint[] = [];

  constructor(array: GeoPoint[] = []) {
    this.array = array;
  }

  addPoint(p: GeoPoint) {
    this.array.push(p);
  }

  getPath() {
    return this.array;
  }

  toString() {
    let str = '';
    for (let point of this.array) {
      str += `[${point.toString()}], `;
    }
    str = str.slice(0, -2);
    return str;
  }

  toQueryString() {
    let str = '';
    for (let point of this.array) {
      str += point.toQueryString();
    }
    return str;
  }

}
