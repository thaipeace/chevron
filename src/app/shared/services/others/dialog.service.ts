import {Injectable, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BehaviorSubject} from 'rxjs';
import {DialogAlertComponent} from '@shared/components/dialog-template/dialog-alert/dialog-alert.component';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private resultSub$;
  public resultChanged;

  private isOpenSource = new BehaviorSubject<boolean>(false);
  isOpenObservable = this.isOpenSource.asObservable();

  constructor(private _MatDialog: MatDialog) {
  }

  open(classComp, data: object = {}, options: object = {}, onClose = (rs) => {
  }) {
    this.isOpenSource.next(true);
    this.resultSub$ = new BehaviorSubject<any>({});
    this.resultChanged = this.resultSub$.asObservable();

    options['maxWidth'] = '90vw';
    if (classComp.DEFAULT_WIDTH) {
      options['width'] = classComp.DEFAULT_WIDTH;
    }

    const dialog = this._MatDialog.open(classComp, {
      ...options,
      data: data,
      autoFocus: false
    });

    dialog.afterClosed()
      .subscribe(result => {
        this.isOpenSource.next(false);
        onClose(result);
      });

    return dialog;
  }

  openConfirm(message: string, onOk = () => {
  }, onCancel = () => {
  }) {
    let confirmValue = confirm(message);
    if (confirmValue == true) {
      onOk();
    } else {
      onCancel();
    }
  }

  alert(message: string, title: string = 'Alert', onOk = () => {
  }) {
    alert(message);
    // const dialogRef = this._MatDialog.open(DialogAlertComponent, {
    //   width: '250px',
    //   data: {title: title, message: message}
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   onOk();
    // });
  }

  emitOutput(data: any, dialogName: string) {
    if (!dialogName) {
      return;
    }
    this.resultSub$.next({data: data, dialogName: dialogName});
  }
}

export class IDialogModel {
  title: string;
  message: string;
}
