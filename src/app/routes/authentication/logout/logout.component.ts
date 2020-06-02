import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/user-management/shared/services';
import { Router } from '@angular/router';
import { CustomRouterService } from '@shared/services/others/custom-router.service';
import { InitService } from '@app/shared/services/init.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private _AuthenticationService: AuthenticationService,
    private _Router: Router,
    private _CustomRouterService: CustomRouterService,
    private _InitService: InitService
  ) {

  }

  ngOnInit() {
    this._InitService.resetAll();
    const self = this;
    let timeout = setTimeout(() => {
      self.clearAndOut();
    }, 5000);
    this._AuthenticationService.logout().then(_ => {
      clearTimeout(timeout);
      self.clearAndOut();
    });
  }

  clearAndOut() {
    this._CustomRouterService.setCustomMenu(null);
    this._Router.navigate(['/', 'login']);
  }

}
