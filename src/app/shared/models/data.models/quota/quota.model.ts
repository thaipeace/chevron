import * as _ from 'lodash';
import { DefaultObject, TQLFormData } from '@shared/models/default/default-object.model';
import { StationModel } from '@shared/models/data.models/station/station.model';

export class QuotaModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData({
        'StationId': {
            type: 'string',
        },
        'ProductCode': {},
        'MonthlyQuota': {},
        'RemainingQuota': {},
        'userName': {}
    });

    stationId: string;
    productCode: string;
    stationName: string;
    monthlyQuota: number;
    lastUpdated: number;
    remainingQuota: number;
    station: StationModel;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.stationId = this.getValue('StationId');
        this.productCode = this.getValue('ProductCode');
        this.monthlyQuota = this.getValue('MonthlyQuota');
        this.remainingQuota = this.getValue('RemainingQuota');
        this.lastUpdated = this.getValue('lastUpdated');
    }

    setStation(station: StationModel) {
        if (station) {
            this.station = station;
            this.stationName = this.station.stationName;
            this._data['stationName'] = this.station.stationName;
        }
    }
}

