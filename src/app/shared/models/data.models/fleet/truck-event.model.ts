import * as _ from 'lodash';
import * as moment from 'moment';
import {DefaultObject} from '@shared/models/default/default-object.model';
import {GeoPoint} from '@shared/models/geo-point.model';

export class TruckEventModel extends DefaultObject {

    index: string;
    timeObject;
    timestamp: number;
    geoPoint: GeoPoint;
    marker;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.timeObject = moment(parseInt(this.getRawValue('startTime')));
        this.timestamp = this.timeObject.valueOf();
        this.geoPoint = this.getValue('startGeoPoint');
    }

}

