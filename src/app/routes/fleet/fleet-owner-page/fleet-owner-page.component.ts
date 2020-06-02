import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/user-management/shared/services';
import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';

@Component({
  selector: 'app-fleet-owner-page',
  templateUrl: './fleet-owner-page.component.html',
  styleUrls: ['./fleet-owner-page.component.scss']
})
export class FleetOwnerPageComponent implements OnInit {

  constructor(private _truckCompanyDataService: TruckCompanyDataService,
              private _AuthenticationService: AuthenticationService) {
  }

  ngOnInit() {
    switch (this._AuthenticationService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
        this.loadAll();
        break;
      default:
        this.loadByCompany();
    }
  }

  loadAll() {
    this._truckCompanyDataService.currentTruckCompanyUserMappingSource.next(null);
  }

  loadByCompany() {
    this._truckCompanyDataService.findUserTruckCompanyMappingByUsername(this._AuthenticationService.getUsername())
      .then((rs) => {
        this._truckCompanyDataService.currentTruckCompanyUserMappingSource.next(rs);
      });
  }

}
