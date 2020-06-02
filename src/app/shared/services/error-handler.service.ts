import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';
import {MatSnackBar} from '@angular/material';
import {ToastService} from '@shared/services/others/toast.service';

const isLogging: boolean = false;

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private _snackBar: MatSnackBar,
              private _ToastService: ToastService) {
  }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  static logResult(data) {
    if (isLogging) {
      console.log('data \n', data);
    }
  }

  static logError(error) {
    if (isLogging) {
      console.log('error \n', error);
    }
  }

  public handleSimpleResponse(rs) {
    let res = {
      status: false,
      message: 'Error'
    };
    if (rs['data']['Response']) {
      res['status'] = (rs['data']['Response']['Status'] == 'Success');
      res['message'] = rs['data']['Response']['Message'];
    }
    this._snackBar.open(res['message'], X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    return res['status'];
  }

  handleMessage(response) {
    if (response['data']['APIResponse']) {
      if (response['data']['APIResponse']['Message']) {
        this._ToastService.openSimple(response['data']['APIResponse']['Message'],
          response['data']['APIResponse']['Status'] === 'Failed' ? ToastService.LONG : ToastService.SHORT);
      }
      return response['data']['APIResponse']['Status'] === 'Success';
    }
    return false;
  }

  handleCreate(response) {
    if (response['data']['Create']) {
      return response['data']['Create']['Status'] === 'Success';
    }
    return false;
  }

  handleUpdate(response) {
    if (response['data']['Update']) {
      return response['data']['Update']['Status'] === 'Success';
    }
    return false;
  }
}
