import {IDefaultObjectConstructor, ITQLFormData, TQLFormData} from '@shared/models/default/default-object.model';
import {UtilsService} from '@shared/services/utils.service';

export class Payload {
  query: string;
  objectString: string;
  objectClass: IDefaultObjectConstructor;

  constructor(
    query: string,
    objectString: string = null,
    objectClass: IDefaultObjectConstructor = null
  ) {
    this.query = query;
    this.objectString = objectString;
    this.objectClass = objectClass;
  }

  buildPayload(params = []): string {
    let data = this.query.toString();

    if (!params || !params.length) {
      return data;
    }

    for (let i = 0; i < params.length; i++) {
      data = UtilsService.replaceAll(data, '{' + i + '}', params[i]);
    }
    return data;
  }

  buildPayloadWithKeys(params: ITQLFormData = new TQLFormData()): string {
    let data = this.query.toString();

    if (!Object.keys(params).length) {
      return data;
    }

    for (let i = 0; i < Object.keys(params).length; i++) {
      data = UtilsService.replaceAll(data, '{' + Object.keys(params)[i] + '}'
        , params[Object.keys(params)[i]].value);
    }
    return data;
  }

  parse(array = []) {
    if (!this.objectClass) {
      return array;
    }
    let data = [];
    try {
      for (let i = 0; i < array.length; i++) {
        data.push(new this.objectClass(array[i][this.objectString]));
      }
    } catch (e) {
      console.error(e);
    }
    return data;
  }
}
