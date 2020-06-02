import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { DEFAULT_ENDPOINTS, DEFAULT_VALUES } from '@shared/constants/config.constant';
import { Payload } from '../models/payload';
import { catchError } from 'rxjs/operators';

const BE_URL: any = DEFAULT_ENDPOINTS.DEFAULT;

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(
    private httpClient: HttpClient
  ) { }

  executeQuery(payload: Payload, headers = {}): Observable<string> {
    headers[DEFAULT_VALUES.HEADER_APP_NAME] = DEFAULT_VALUES.APP_NAME;
    return this.httpClient.post(BE_URL, payload.buildPayload(),
      {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml', ...headers }),
        responseType: 'text'
      }
    );
  }

  executeStringQuery(payload: string, headers = {}): Observable<string> {
    headers[DEFAULT_VALUES.HEADER_APP_NAME] = DEFAULT_VALUES.APP_NAME;
    return this.httpClient.post(BE_URL, payload,
      {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml' }),
        responseType: 'text'
      }
    );
  }

  executeQueryWithSupperAdmin(payload: Payload): Observable<string> {
    return this.httpClient.post(BE_URL, payload.buildPayload(),
      {
        headers: new HttpHeaders({
          'Content-Type': 'text/xml',
          'Appname': 'ChevronBE',
          'userToken': 'SuperUser'
        }),
        responseType: 'text'
      }
    );
  }
}
