import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FmTreeviewLoadingService {

  private subject = new BehaviorSubject(null);

  constructor() { }

  get loading() {
    return this.subject;
  }

  get refresh() {
    return this.subject.next(null);
  }
}
