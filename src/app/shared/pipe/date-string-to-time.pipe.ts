import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateStringToTime'
})
export class DateStringToTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let date = new Date(value);
    return date.getTime() || isNaN(date.getTime()) ? date.getTime() : value;
  }

}
