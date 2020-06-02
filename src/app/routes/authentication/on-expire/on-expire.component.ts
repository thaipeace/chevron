import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/user-management/shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomRouterService} from '@shared/services/others/custom-router.service';

@Component({
  selector: 'app-on-expire',
  templateUrl: './on-expire.component.html',
  styleUrls: ['./on-expire.component.scss']
})
export class OnExpireComponent implements OnInit {

  constructor(private _ActivatedRoute: ActivatedRoute,
              private _AuthenticationService: AuthenticationService,
              private _Router: Router,
              private _CustomRouterService: CustomRouterService) {
  }

  ngOnInit() {
    const self = this;
    this._ActivatedRoute.queryParams.subscribe((el) => {
      // if have reload param, reload the page
      if (el['reload'] === 'true') {
        // remove params
        this._Router.navigate(['/', 'expired'])
          .then(() => {
            window.location.reload();
          });
      } else {
        setTimeout(() => {
          self.clearAndOut();
        }, 1000);
      }
    });
  }

  clearAndOut() {
    this._CustomRouterService.setCustomMenu(null);
    this._Router.navigate(['/', 'auth', 'login']);
  }

}
