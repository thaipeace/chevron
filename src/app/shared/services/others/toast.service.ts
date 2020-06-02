import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  static SHORT: number = NOTIFICATION_DEFAULT_DURARION;
  static LONG: number = 20000;

  constructor(
    private _snackBar: MatSnackBar,
  ) {
  }

  openSimple(message, duration = ToastService.SHORT) {
    this._snackBar.open(message, X_BUTTON, {duration: duration});
  }
}
