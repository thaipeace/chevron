import {Component, OnInit} from '@angular/core';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {StationDataService} from '@shared/services/data/station-data.service';
import {AuthenticationService} from '@app/user-management/shared/services';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {takeUntil} from 'rxjs/operators';
import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';

@Component({
    selector: 'app-history-inventory',
    templateUrl: './history-inventory.component.html',
    styleUrls: ['./history-inventory.component.scss']
})
export class HistoryInventoryComponent extends DefaultComponent implements OnInit {
    stations: StationModel[] = [];

    constructor(private _StationDataService: StationDataService,
                private _AuthenticationService: AuthenticationService) {
        super();
    }

    ngOnInit() {
        this.addSubscribes(
            this._AuthenticationService.loginedUserObservable
                .subscribe((el) => {
                    if (!!el) {
                        let $promise;
                        switch (this._AuthenticationService.getRole()) {
                            case DEFAULT_ROLES.ADMIN:
                                $promise = this._StationDataService.stationAllObservable;
                                break;
                            default:
                                $promise = this._StationDataService.stationAllByUsernameObservable;
                        }
                        this.addSubscribes(
                            $promise.subscribe(rs => {
                                this.stations = rs;
                            })
                        );
                    }
                })
        );

    }

}
