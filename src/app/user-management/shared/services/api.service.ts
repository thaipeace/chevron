import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {DEFAULT_ENDPOINTS} from '../constant/constant';
import {Payload} from '../models/payload.model';
import {IUMTQLFormData} from '../models/default/default-object.model';
import {ErrorHandlerService} from './error-handler.service';
import {UtilsService} from './utils.service';


const BE_URL: any = DEFAULT_ENDPOINTS.DEFAULT;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private wsList = {};

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  private async executeWithKeys(payload: Payload, params: IUMTQLFormData, headers = {}, url: string = null) {
    return await this.httpClient
      .post(
        url || BE_URL, payload.buildPayloadWithKeys(params),
        {
          headers: new HttpHeaders({'Content-Type': 'text/xml', ...headers}),
          responseType: 'text'
        }
      )
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError) // then handle the error
      )
      .toPromise();
  }

  private async execute(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.httpClient
      .post(
        url || BE_URL, payload.buildPayload(params),
        {
          headers: new HttpHeaders({'Content-Type': 'text/xml', ...headers}),
          responseType: 'text'
        }
      )
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError) // then handle the error
      )
      .toPromise();
  }

  private async executeWithPayload(payload: string, headers = {}, url: string = null) {
    return await this.httpClient
      .post(
        url || BE_URL, payload,
        {
          headers: new HttpHeaders({'Content-Type': 'text/xml', ...headers}),
          responseType: 'text'
        }
      )
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError) // then handle the error
      )
      .toPromise();
  }

  private _onCreateResult(data: string) {
    let status;
    let raw = '<data>' + data + '</data>';
    UtilsService.parseXml(data, (rs) => {
      data = rs;
    });

    if (typeof data['Save'] !== 'undefined'
      && data['Save'].Status === 'Success') {
      status = true;
    } else {
      status = false;
    }

    UtilsService.parseXml(raw, (rs) => {
      raw = rs;
    });
    return [status, data, raw];
  }

  async findRaw(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.execute(payload, params, headers, url)
      .then((data: string) => {
        data = '<data>' + data + '</data>';
        UtilsService.parseXml(data, (rs) => {
          data = rs;
        });
        return data;
      });
  }

  async find(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.execute(payload, params, headers, url)
      .then((data: string) => {
        UtilsService.parseXml(data, (rs) => {
          data = rs;
        });

        let array = [];

        // no result
        if (typeof data['Find'] !== 'undefined'
          && typeof data['Find']['Result'] !== 'undefined'
          && data['Find'].Status !== 'NoResult') {
          array = data['Find']['Result'];
          if (!UtilsService.isArray(array)) {
            array = [array];
          }
        }

        return payload.parse(array);
      });
  }

  async create(payload: Payload, params: IUMTQLFormData, headers = {}, url: string = null) {
    return this.executeWithKeys(payload, params, headers, url)
      .then((data: string) => {
        return this._onCreateResult(data);
      });
  }

  async createWithPayload(payload: string, url: string = null) {
    return this.executeWithPayload(payload, url)
      .then((data: string) => {
        return this._onCreateResult(data);
      });
  }

  async update(payload: Payload, params: IUMTQLFormData, headers = {}, url: string = null) {
    return this.create(payload, params, headers, url);
  }

  async delete(payload: Payload, params: IUMTQLFormData, headers = {}, url: string = null) {
    return this.executeWithKeys(payload, params, headers, url)
      .then((data: string) => {
        let status;
        UtilsService.parseXml(data, (rs) => {
          data = rs;
        });

        if (typeof data['DeleteAll'] !== 'undefined'
          && data['DeleteAll'].Status === 'Success') {
          status = true;
        } else {
          status = false;
        }
        return [status, data];
      });
  }

}
