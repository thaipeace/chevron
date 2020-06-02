import { Pipe, PipeTransform } from '@angular/core';
import { DataUtilService } from '../services/data-util.service';

@Pipe({
  name: 'xmlToJson'
})
export class XmlToJsonPipe implements PipeTransform {

  constructor(
    private dataUtilService: DataUtilService
  ) {}

  transform(value: any, args?: any): any {
    let result = '';
    console.log(value);
    try {
      result = this.dataUtilService.convertXmlToJsonParseAttributes(value);
    }
    catch(error) {
      console.error(error);
    }

    return result;
  }

}
