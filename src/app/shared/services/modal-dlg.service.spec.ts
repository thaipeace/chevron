/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalDlgService } from './modal-dlg.service';

describe('Service: ModalDlg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalDlgService]
    });
  });

  it('should ...', inject([ModalDlgService], (service: ModalDlgService) => {
    expect(service).toBeTruthy();
  }));
});
