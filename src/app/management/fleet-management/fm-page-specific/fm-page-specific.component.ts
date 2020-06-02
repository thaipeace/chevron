import { Component, OnInit } from '@angular/core';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { TruckCompanyUserMappingModel } from '@shared/models/data.models/fleet/truck-company-user-mapping.model';

@Component({
  selector: 'app-fm-page-specific',
  templateUrl: './fm-page-specific.component.html',
  styleUrls: ['./fm-page-specific.component.scss']
})
export class FmPageSpecificComponent implements OnInit {
  private truckCompanies: TruckCompanyUserMappingModel[] = [];
  truckCompanySysIds: string[];

  constructor(
    private _truckCompanyDataService: TruckCompanyDataService,
    private _authenService: AuthenticationService,
  ) { }

  ngOnInit() {
    this._truckCompanyDataService.findUserTruckCompanyMappingByUsername(this._authenService.getUsername())
      .then((rs) => {
        this.truckCompanies = rs;
        this.truckCompanySysIds = rs.map(mapping => mapping.truckCompanyId);
      });
  }

}
