import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

const isLogging: boolean = false;

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {
  }

  static handleError(error: HttpErrorResponse) {
    if (error instanceof TypeError) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(
        `Backend returned code ${error.status} \n ` +
        `body was: ${error.message} \n`,
        `stack was: ${error['stack']}`);
    } else if (error.error instanceof ErrorEvent) {
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
}
