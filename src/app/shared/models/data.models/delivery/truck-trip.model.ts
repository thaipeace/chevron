import * as _ from 'lodash';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class TruckTripModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'truckId': {},
            'scheduledTimeFrom': {},
            'scheduledTimeTo': {},
        }
    );
    from: string;
    to: string;
    fromTimeStamp: number;
    toTimeStamp: number;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.from = this.getValue('scheduledTimeFrom');
        this.to = this.getValue('scheduledTimeTo');
        this.fromTimeStamp = parseInt(this.getRawValue('scheduledTimeFrom'));
        this.toTimeStamp = parseInt(this.getRawValue('scheduledTimeTo'));
    }
}

