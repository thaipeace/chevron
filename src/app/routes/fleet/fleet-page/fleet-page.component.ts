import {Component, OnInit} from '@angular/core';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';
import {AuthenticationService} from '@app/user-management/shared/services';

@Component({
  selector: 'app-fleet-page',
  templateUrl: './fleet-page.component.html',
  styleUrls: ['./fleet-page.component.scss']
})
export class FleetPageComponent implements OnInit {

  constructor(
    private _truckCompanyDataService: TruckCompanyDataService,
    private _authenService: AuthenticationService,
  ) {
  }

  ngOnInit() {

  }

}
