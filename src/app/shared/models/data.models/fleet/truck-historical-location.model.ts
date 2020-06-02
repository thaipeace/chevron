import * as _ from 'lodash';
import * as moment from 'moment';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';

export class TruckHistoricalLocationModel extends DefaultObject {
    index: string;
    timeObject;
    timestamp: number;
    timeString: number;
    geoPoint: GeoPoint;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.geoPoint = this.getValue('geoPoint');
        this.timeObject = moment(parseInt(this.getRawValue('readingTime')));
        this.timeString = this.getValue('readingTime');
        this.timestamp = this.timeObject.valueOf();
    }
}

