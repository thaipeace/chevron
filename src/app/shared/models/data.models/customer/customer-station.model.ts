import * as _ from 'lodash';
import {isArray} from 'util';
import {DefaultObject} from '@shared/models/default/default-object.model';
import * as moment from 'moment';

export class CustomerStationModel extends DefaultObject {
    sysId: string;
    shipTo: number;
    estimatedHoursFromTerminal: number;
    createDate: string;
    lastUpdated: string;
    stationName: string;
    stationType: string;
    emailAddress: string;
    distanceFromTerminal: number;
    streetAddress: string;
    terminalId: string;
    truckSize: number;
    contactNumber: string;
    shortName: string;
    customerId: string;
    stationTanks: IStationTankModel[];
    isAtgEnabled: boolean;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.customerId = this.getValue('customerId');
        this.contactNumber = this.getValue('contactNumber');
        this.truckSize = this.getValue('truckSize');
        this.streetAddress = this.getValue('streetAddress');
        this.distanceFromTerminal = this.getValue('distanceFromTerminal');
        this.stationType = this.getValue('stationType');
        this.stationName = this.getValue('stationName');
        this.lastUpdated = this.getValue('lastUpdated');
        this.createDate = this.getValue('createDate');
        this.estimatedHoursFromTerminal = this.getValue('estimatedHoursFromTerminal');
        this.terminalId = this.getValue('terminalId');
        const tanks = this.getValue('stationTank');
        this.stationTanks = isArray(tanks) ? tanks : [tanks];
        //TODO fix later
        _.map(this.stationTanks, (el) => {
            if (el.lastUpdated) {
                el.lastUpdated = moment(parseInt(el.lastUpdated)).format('YYYY-MM-DD (HH:mm)');
            }
            if (el.LastUpdated) {
                el.lastUpdated = moment(parseInt(el.LastUpdated)).format('YYYY-MM-DD (HH:mm)');
            }

        });
        this.shipTo = this.getValue('shipTo');
        this.isAtgEnabled = this.getValue('isAtgEnabled');
        this.shortName = this.getValue('shortName');
    }
}

export interface IStationTankModel {
    sysId: string;
    deadStock: number;
    maxFillCapacity: number;
    currentUllage: number;
    lastUpdated: string;
    lastUpdatedBy: string;
    currentVolume: number;
    stationId: string;
    maxFillCapacityPercentage: number;
    isPtoReq: boolean;
    tankNumber: number;
    productCode: string;
    createDate: string;
    UserName: string;
    tankCapacity: number;
}

export interface IGeoPointModel {
    latitude: number;
    longitude: number;
}

