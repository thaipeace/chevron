import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '@shared/services/others/dialog.service';

@Component({
  selector: 'app-spin-loading',
  templateUrl: './spin-loading.component.html',
  styleUrls: ['./spin-loading.component.scss']
})
export class SpinLoadingComponent implements OnInit {
  static CLASSES = {
    FIXED: 'fixed',
    ABSOLUTE: 'absolute',
    TOP: 'top',
  };

  showAnimation: boolean = true;
  class: string = '';
  isTop: boolean = false;

  constructor(private _DialogService: DialogService) {
    this._DialogService.isOpenObservable.subscribe((rs) => {
      this.isTop = rs;
    });
  }

  ngOnInit() {
  }

}
