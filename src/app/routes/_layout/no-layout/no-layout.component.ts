import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomRouterService} from '@shared/services/others/custom-router.service';

@Component({
  selector: 'app-no-layout',
  templateUrl: './no-layout.component.html',
  styleUrls: ['./no-layout.component.scss']
})
export class NoLayoutComponent implements OnInit, OnDestroy {

  constructor(
    private _CustomRouterService: CustomRouterService,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    //  be careful here, it can break UI, nam, 07/30/2019
    this._CustomRouterService.setCustomMenu(null);
  }

}
