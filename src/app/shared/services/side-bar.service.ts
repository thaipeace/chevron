import {Injectable, Type} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import * as _ from 'lodash';
import {DefaultComponent} from '@shared/models/default/default-component.model';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  
  static STATUSES = {
    NEUTRAL: -1,
    OPEN: 1,
    CLOSE: 0
  };

  private caches: SideBarCache[] = [];

  private openSource = new BehaviorSubject(null);
  openObservable = this.openSource.asObservable();

  private statusSource = new BehaviorSubject(new SideBarStatus(SideBarService.STATUSES.NEUTRAL));
  statusObservable = this.statusSource.asObservable();

  private refreshSource = new BehaviorSubject(null);
  refreshObservable = this.refreshSource.asObservable();

  private refreshSourceDestination = new BehaviorSubject(null);
  refreshObservableDestination = this.refreshSourceDestination.asObservable();

  constructor() {
  }

  open(obj: DynamicItem) {
    this.openSource.next(obj);
    this.statusSource.next(new SideBarStatus(SideBarService.STATUSES.OPEN));
    if (!!obj.containerId) {
      this.caches.push(new SideBarCache(obj.containerId, obj.component));
    }
  }

  refresh(param?) {
    this.refreshSource.next(param ? param : new Date().getTime());
  }

  refreshWithDestination(dest: any = 'yes') {
    this.refreshSourceDestination.next(dest);
  }

  close(dest?) {
    this.openSource.next(null);
    if (typeof dest === 'object') {
      const found = _.find(this.caches, (el) => el.compareValue(dest.constructor));
      if (!!found) {
        this.statusSource.next(new SideBarStatus(SideBarService.STATUSES.CLOSE, found.key));
        _.remove(this.caches, found);
      }
    } else {
      this.statusSource.next(new SideBarStatus(SideBarService.STATUSES.CLOSE, dest));
    }
  }

  isClose(status: SideBarStatus) {
    return status && status.status === SideBarService.STATUSES.CLOSE;
  }
}


export class SideBarStatus {
  status;
  destination;

  constructor(status: number, destination: string = null) {
    this.status = status;
    this.destination = destination;
  }
}

class SideBarCache {
  key: string;
  value: Type<any>;

  constructor(key: string, value: Type<any>) {
    this.key = key;
    this.value = value;
  }

  compareValue(value: Type<any>) {
    return this.value.name === value.name;
  }
}
