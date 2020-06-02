import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Payload } from '@shared/models/payload.model';
import { ITQLFormData } from '@shared/models/default/default-object.model';
import { UtilsService } from '@shared/services/utils.service';

import { $WebSocket, WebSocketConfig } from 'angular2-websocket/angular2-websocket';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DEFAULT_ENDPOINTS, DEFAULT_VALUES } from '@shared/constants/config.constant';
import { Router } from '@angular/router';

const BE_URL = DEFAULT_ENDPOINTS.DEFAULT;
declare const BE_URL_WS: any;
declare const BE_URL_DEVICE_WS: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private wsList = {};

  constructor(
    private httpClient: HttpClient,
    private _AuthenticationService: AuthenticationService,
    private _Router: Router
  ) {
  }

  private async executeWithKeys(payload: Payload, params: ITQLFormData, url: string = null, headers = {}) {
    headers[DEFAULT_VALUES.HEADER_APP_NAME] = DEFAULT_VALUES.APP_NAME;
    // console.log(headers);
    return await this.httpClient
      .post(url || BE_URL, payload.buildPayloadWithKeys(params), {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml', ...headers }),
        responseType: 'text'
      })
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError), // then handle the error
        tap((data: string) => {
          this.checkExpired(data);
        })
      )
      .toPromise();
  }

  private async execute(payload: Payload, params = [], headers = {}, url: string = null) {
    switch (headers[DEFAULT_VALUES.HEADER_APP_NAME]) {
      case 'unset': 
        headers = {};
        break;
      
      default:
        if (!headers[DEFAULT_VALUES.HEADER_APP_NAME]) {
          headers[DEFAULT_VALUES.HEADER_APP_NAME] = DEFAULT_VALUES.APP_NAME;
        }
    }

    return await this.httpClient
      .post(url || BE_URL, payload.buildPayload(params), {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml', ...headers }),
        responseType: 'text'
      })
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError), // then handle the error
        tap((data: string) => {
          this.checkExpired(data);
        })
      )
      .toPromise();
  }

  private async executeWithPayload(payload: string, headers = {}, url: string = null) {
    headers[DEFAULT_VALUES.HEADER_APP_NAME] = DEFAULT_VALUES.APP_NAME;
    // console.log(headers);
    return await this.httpClient
      .post(url || BE_URL, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'text/xml', ...headers }),
        responseType: 'text'
      })
      .pipe(
        tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
        catchError(ErrorHandlerService.handleError), // then handle the error
        tap((data: string) => {
          this.checkExpired(data);
        })
      )
      .toPromise();
  }

  private checkExpired(data: string) {
    if (
      !!data &&
      data.includes('<Status>Error</Status>') &&
      data.includes('<Message>Invalid Access</Message>')
    ) {
      const user = this._AuthenticationService.getLoginedUser();
      if (!!user && user.isExpired()) {
        this.logout();
      }
    }
  }

  private _onCreateResult(data: string, payload: Payload = null) {
    let result;
    let status;
    UtilsService.parseXml(data, rs => {
      data = rs;
    });

    if (
      (typeof data['Save'] !== 'undefined' && data['Save'].Status === 'Success') ||
      (typeof data['Create'] !== 'undefined' && data['Create'].Status === 'Success')
    ) {
      status = true;
    } else {
      status = false;
    }
    result = [status, data];
    return result;
  }

  startWSMeterReading(callback = rs => {
  }) {
    if (this.wsList['startWSMeterReading']) {
      this.wsList['startWSMeterReading'].close(true);
    }
    const webSocketConfig = { reconnectIfNotNormalClose: true } as WebSocketConfig;
    let ws = new $WebSocket(BE_URL_WS, null, webSocketConfig);
    this.wsList['startWSMeterReading'] = ws;

    // set received message stream
    ws.getDataStream().subscribe(
      msg => {
        try {
          const result = JSON.parse(msg.data);
          callback(result);
        } catch (e) {
          throwError(e);
        }
      },
      msg => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
      }
    );

    ws.send(
      `{"Query": {
      "Storage": "TqlSubscription",
      "Save": {
        "TqlSubscription": {
          "Label": "MeterSubscription",
          "sid": "22",
          "Notify.As": ":$event:Model:Attribute",
          "Notify.Format": "all",
          "Topic": "SmartMeter.Monitor.MeterReadings.stationId", "MessageType":"json:compact"
        }
      }
    }
  }`
    ).subscribe();
  }

  startWSDevice(callback = rs => {
  }) {
    if (this.wsList['startWSDevice']) {
      this.wsList['startWSDevice'].close(true);
    }
    const webSocketConfig = { reconnectIfNotNormalClose: true } as WebSocketConfig;
    let ws = new $WebSocket(BE_URL_DEVICE_WS, null, webSocketConfig);
    this.wsList['startWSDevice'] = ws;

    // set received message stream
    ws.getDataStream().subscribe(
      msg => {
        try {
          let result = msg.data;
          UtilsService.parseXml(result, rs => {
            result = rs;
          });
          console.log('onMessageDevice ', result);
          callback(result);
        } catch (e) {
          console.error(e);
          throwError(e);
        }
      },
      msg => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
      }
    );

    ws.send(
      `<Query Storage='TqlSubscription'>
    <Save>
    <TqlSubscription Label='DMSub' sid='20' Notify.As= ':$event:Model' Notify.Format='$sid'>
    <Topic>Atomiton.Sensors.Alert.RaisedDate</Topic>
    <Topic>Atomiton.Sensors.Device.LastSeen</Topic>
    </TqlSubscription>
    </Save>
    </Query>`
    ).subscribe();
  }

  async findRaw(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.execute(payload, params, headers, url)
      .then((data: any) => {
        data = '<data>' + data + '</data>';
        UtilsService.parseXml(data, rs => {
          data = rs;
        });

        return data;
      });
  }

  async findCount(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.findRaw(payload, params, headers, url)
      .then((data: any) => {
        if (data && data['data'] && data['data']['Count']) {
          return parseInt(data['data']['Count']);
        }
        return 0;
      });
  }

  async find(payload: Payload, params = [], headers = {}, url: string = null) {
    return await this.execute(payload, params, headers, url)
      .then((data: any) => {
        UtilsService.parseXml(data, rs => {
          data = rs;
        });

        let array = [];

        //no result
        if (
          typeof data['Find'] !== 'undefined' &&
          typeof data['Find']['Result'] !== 'undefined' &&
          data['Find'].Status !== 'NoResult'
        ) {
          array = data['Find']['Result'];
          if (!UtilsService.isArray(array)) {
            array = [array];
          }
        } else if (!!data[payload.objectString]) {
          array = data[payload.objectString];
          if (!UtilsService.isArray(array)) {
            array = [
              {
                [payload.objectString]: array
              }
            ];
          }
        }

        return payload.parse(array);
      })
      .catch(error => {
        // console.warn('ERROR FIND: ' + error);
        return [];
      });
  }

  async create(payload: Payload, params: ITQLFormData, url: string = null, headers = {}) {
    return this.executeWithKeys(payload, params, url, headers).then((data: string) => {
      return this._onCreateResult(data, payload);
    });
  }

  async createWithPayload(payload: string, url: string = null) {
    return this.executeWithPayload(payload, {}, url).then((data: string) => {
      return this._onCreateResult(data);
    });
  }

  async update(payload: Payload, params: ITQLFormData, url: string = null, headers = {}) {
    return this.create(payload, params, url, headers);
  }

  async delete(payload: Payload, params: ITQLFormData, url: string = null) {
    return this.executeWithKeys(payload, params, url).then((data: string) => {
      let status;
      UtilsService.parseXml(data, rs => {
        data = rs;
        console.log(data);
      });

      if (typeof data['DeleteAll'] !== 'undefined' && data['DeleteAll'].Status === 'Success') {
        status = true;
      } else {
        status = false;
      }
      return [status, data];
    });
  }

  logout() {
    this._Router.navigate(['/', 'logout']);
  }
}
