import {Component, OnInit} from '@angular/core';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';
import {TruckCompanyUserMappingModel} from '@shared/models/data.models/fleet/truck-company-user-mapping.model';

@Component({
  selector: 'app-fleet-management',
  templateUrl: './fleet-management.component.html',
  styleUrls: ['./fleet-management.component.scss']
})
export class FleetManagementComponent implements OnInit {
  private truckCompanies: TruckCompanyUserMappingModel[] = [];
  truckCompanySysIds: string[];

  constructor(
    private _truckCompanyDataService: TruckCompanyDataService,
  ) {
  }

  ngOnInit() {
    this._truckCompanyDataService.currentTruckCompanyUserMappingObservable
      .subscribe((rs) => {
        if (rs !== null) {
          this.truckCompanies = rs;
          this.truckCompanySysIds = rs.map(mapping => mapping.truckCompanyId);
        }
      });

  }

}
