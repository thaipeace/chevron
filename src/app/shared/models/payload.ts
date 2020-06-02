import { DataUtilService } from "../services/data-util.service";

export class Payload {
  query: string;
  params: any[];

  constructor(
    query: string,
    params: any[],
  ) {
    this.query = query;
    this.params = params;
  }

  buildPayload(): string {
    let dataUtilService = new DataUtilService;
    return dataUtilService.replaceParams(this.query, this.params);
  }

  buildPayLoadByOject(obj, excepts): string {
    if (typeof obj !== 'object') return;

    let result = '';
    let keys = Object.keys(obj);
    for(let i=0; i<keys.length; i++) {
      if (!excepts.includes(keys[i])) {
        result += `<${keys[i]}>${obj[keys[i]]}</${keys[i]}>`;
      }
    }

    return result;
  }
}
