import { Component, OnInit } from '@angular/core';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';
import { QuotaDataService } from '@app/shared/services/data/quota-data.service';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { QuotaModel } from '@app/shared/models/data.models/quota/quota.model';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { QmNewComponent } from '@app/management/quota-management/qm-new/qm-new.component';
import { QmDetailComponent } from '@app/management/quota-management/qm-detail/qm-detail.component';

@Component({
    selector: 'app-quota-page',
    templateUrl: './quota-page.component.html',
    styleUrls: ['./quota-page.component.scss']
})
export class QuotaPageComponent extends DefaultComponent implements OnInit {
    quotaList: QuotaModel[];
    stations: StationModel[];

    constructor(
        private _QuotaDataService: QuotaDataService,
        private _StationDataService: StationDataService,
        private _snackBar: MatSnackBar,
        private _DialogService: DialogService) {
        super();

        this.addSubscribes(this._StationDataService.stationAllObservable
            .subscribe((rs) => {
                this.stations = rs;
                const stationIds = _.map(this.stations, (el) => el.getId());
                this.onRefresh(stationIds);
            }));
    }

    ngOnInit() {
    }

    onRefresh(stationIds) {
        this._QuotaDataService.findAllByStationIds(stationIds)
            .then((rs) => {
                this.quotaList = rs;
            });
    }

    onViewDetail(quotaDetail) {
        const viewDialogRef = this._DialogService.open(QmDetailComponent, {
            quotaDetail,
            stations: this.stations,
            autofocus: false
        });

        viewDialogRef.afterClosed().subscribe(rs => {
            if (rs) {
                const stationIds = _.map(this.stations, (el) => el.getId());
                this.onRefresh(stationIds);
            }
        });
    }

    newQuotaClicked() {
        const newDialogRef = this._DialogService.open(QmNewComponent, {
            stations: this.stations,
            autofocus: false
        });

        newDialogRef.afterClosed().subscribe(rs => {
            if (rs) {
                const stationIds = _.map(this.stations, (el) => el.getId());
                this.onRefresh(stationIds);
            }
        });
    }

}
