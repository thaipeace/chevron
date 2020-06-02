import { Injectable } from '@angular/core';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '../constants/value.constant';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MessageNotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  notification(rs) {
    if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
      const message = `Update successfully`;
      this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    } else {
        if (rs && rs[1] && rs[1]['Save']['Message']) {
            const message = rs[1]['Save']['Message'];
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }
    }
  }
}
