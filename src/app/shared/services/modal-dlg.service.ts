import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalDlgService {

  constructor(private _modalService: BsModalService) {
  }

  open(
    content: any, config: ModalOptions, modalClass: string = 'modal-dialog-center', disableEsc?
  ): Observable<any> {
    const { initialState, ...rest } = config;

    return Observable.create(observer => {
      const modalRef = this._modalService.show(content, {
        ...rest,
        keyboard: disableEsc,
        class: modalClass,
        ignoreBackdropClick: true,
        initialState: {
          ...initialState,
          confirm: (result = null) => {
            modalRef.hide();
            observer.next(result);
            observer.complete();
          },
          dismiss: () => {
            modalRef.hide();
            observer.complete();
          },
        },
      });
    });
  }
}
