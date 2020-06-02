import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'mappingLabel'
})
export class MappingLabelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let result;
    switch (value) {
      case 'compressionStationName':
        result = 'Station Name';
        break;
      case 'geoPoint':
        result = 'Geo Location';
        break;
      case 'stationOperator':
        result = 'Operator';
        break;
      case 'readingTime':
        result = 'Timestamp';
        break;
      case 'imagePath':
        result = 'Image URL';
        break;
      case 'macAddress':
        result = 'MAC Address';
        break;
      case 'midNumber':
        result = 'MID Number';
        break;
      case 'MACAddress':
        result = 'MAC Address';
        break;
      case 'HomeURL':
        result = 'Home URL';
        break;
      case 'DefaultHomeURL':
        result = 'DefaultHome URL';
        break;
      case 'WorkURL':
        result = 'Work URL';
        break;
      default:
        result = this.capitalizeFirstLetter(value.split(/(?=[A-Z])/).join(' '));
    }
    return result;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
