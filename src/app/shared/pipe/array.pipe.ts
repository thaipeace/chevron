import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'array'
})
export class ArrayPipe implements PipeTransform {

  transform(value: string, separator: string = ','): Array<any> {
    console.log(value);
    return value ? value.split(separator).filter(d => d != '') : null;
  }

}
