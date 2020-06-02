import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerTreeviewLoadingService {

  private subject = new BehaviorSubject(null);
  private openTree = new BehaviorSubject<boolean>(false);

  constructor() { }

  get loading() {
    return this.subject;
  }

  get refresh() {
    this.subject.next(null);
    return null;
  }

  get OpenTree() {
    return this.OpenTree;
  }

  set OpenTree(status) {
    this.openTree.next(status);
  }
}
