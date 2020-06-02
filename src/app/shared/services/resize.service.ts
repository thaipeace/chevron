import {HostListener, Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  static events: any[] = [];
  static resizeTimer;

  constructor() {
  }

  static init() {
    window.onresize = ResizeService.resize;
  }

  static addEvent(fn) {
    ResizeService.events.push(fn);
  }

  static resize() {
    const self = ResizeService;
    if (self.resizeTimer) {
      clearTimeout(self.resizeTimer);
    }

    self.resizeTimer = setTimeout(function () {
      _.map(self.events, (ev) => {
        ev();
      });
    }, 1000);
  }

}
