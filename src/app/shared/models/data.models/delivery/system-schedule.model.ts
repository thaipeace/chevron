import * as _ from 'lodash';
import {UtilsService} from '@shared/services/utils.service';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';
import {TruckTripModel} from '@shared/models/data.models/delivery/truck-trip.model';
import {OrderModel} from '@shared/models/data.models/order/order.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {StationModel} from '@shared/models/data.models/station/station.model';

export class SystemScheduleModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'stationId': {},
            'orderId': {},
            'tripId': {},
            'truckId': {},
            'dropNumber': {},
        }
    );
    stationId: string;
    lastUpdated: string;
    tripId: string;
    orderId: string;
    truckId: string;
    scheduleTime: string;
    dropNumber: number;

    truckTrip: TruckTripModel;
    order: OrderModel;
    truck: TruckModel;
    station: StationModel;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.stationId = this.getValue('stationId');
        this.truckId = this.getValue('truckId');
        this.orderId = this.getValue('orderId');
        this.scheduleTime = this.getValue('scheduleTime');
        this.tripId = this.getValue('tripId');
        this.dropNumber = this.getValue('dropNumber');
        this.lastUpdated = this.getValue('lastUpdated') || this.getValue('LastUpdated');

    }
}

