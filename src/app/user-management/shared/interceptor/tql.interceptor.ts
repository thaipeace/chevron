import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {AuthenticationService} from '../services/';
import {DEFAULT_ENDPOINTS, USER_MANAGEMENT_DEFAULT_VALUES} from '../constant/constant';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';

@Injectable()
export class TqlInterceptor implements HttpInterceptor {
  arrayOfRequests = [];

  constructor(private toasterService: MatSnackBar, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = AuthenticationService.loadToken();
    if (token) {
      const headers = {
        [USER_MANAGEMENT_DEFAULT_VALUES.HEADER_TOKEN]: token
      };
      if (!req.headers.has(USER_MANAGEMENT_DEFAULT_VALUES.HEADER_APP_NAME)) {
        headers[USER_MANAGEMENT_DEFAULT_VALUES.HEADER_APP_NAME] = USER_MANAGEMENT_DEFAULT_VALUES.APP_NAME;
      }

      switch (req.url) {
        case DEFAULT_ENDPOINTS.DEFAULT:
        case DEFAULT_ENDPOINTS.LOGOUT:
          req = req.clone({
            setHeaders: headers
          });
          break;
      }
    }
    // return EMPTY;

    if (this.handleDuplicate(req)) {
      return EMPTY;
    } else {
      return next.handle(req).pipe(tap(evt => {
          this.removeSavedRequest(req);

          if (req.method === 'POST' && evt instanceof HttpResponse) {
            if (typeof evt.body == 'string' && evt.body.toString().indexOf('Invalid Access') > -1) {
              this.toasterService.open('Your token has expired. Please login again!', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
              // this.router.navigate(['/', 'logout']);

              // clean offline to prevent loop
              window.localStorage.clear();

              // go to login with option reload, url must be full, short one not work with queryParams
              this.router.navigate(['/', 'auth', 'expired'], {queryParams: {reload: 'true'}});
            }
          }
          return evt;
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            try {
              if (err.error.message && err.error.title) {
                this.toasterService.open(err.error.message, err.error.title);
              } else {
                this.toasterService.open('An error occurred.', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
              }
            } catch (e) {
              this.toasterService.open('An error occurred', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
            }
          }
          return of(err);
        })
      );
    }

    // return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
    // 	if (event instanceof HttpResponse) {
    // 		if (typeof event.body == 'string' && event.body.toString().indexOf('Invalid Access') > -1) {
    // 			this.toasterService.open('Your token has expired. Please login again!', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    // 			this.router.navigate(['/', 'logout']);
    // 		}
    // 	}
    // 	return event;
    // }));


  }

  handleDuplicate(request) {
    const self = this;
    const code = this.makeRequestCode(request);
    let result = false;
    if (_.find(this.arrayOfRequests, (el) => el.code == code)) {
      console.log('INTERCEPTOR: there are running duplicate apis');
      result = true;
    } else {
      let obj = {
        request: request,
        timestamp: new Date().getTime(),
        code: code,
        destroy: () => {
          setTimeout(() => {
            self.removeSavedRequest(request);
          }, 10000);
        }
      };
      obj.destroy();
      this.arrayOfRequests.push(obj);
    }
    return result;
  }

  removeSavedRequest(request) {
    const code = this.makeRequestCode(request);
    setTimeout(() => {
      _.remove(this.arrayOfRequests, (el) => el.code == code);
    }, 1000);
  }

  makeRequestCode(request) {
    return btoa(request['url'] + request['body']);
  }

}
