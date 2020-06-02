import {GeoPoint} from '@shared/models/geo-point.model';
import {TankModel} from '@shared/models/data.models/tank/tank.model';
import {UtilsService} from '@shared/services/utils.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class StationModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'stationName': {
        type: 'string',
        editable: true,
      },
      'shortName': {
        type: 'string',
        editable: true,
      },
      'streetAddress': {
        type: 'string',
        editable: true,
      },
      'stationType': {
        type: 'string',
        editable: true,
      },
      'contactNumber': {
        type: 'string',
        editable: true,
      },
      'distanceFromTerminal': {
        type: 'string',
        editable: true,
      },
      'estimatedHoursFromTerminal': {
        type: 'string',
        editable: true,
      },
      'customerId': {
        type: 'string',
        editable: true,
      },
      'shipTo': {
        type: 'string',
        editable: true,
      },
      'truckSize': {
        type: 'string',
        editable: true,
      },
      'associatedTerminalId': {
        type: 'string',
        editable: true,
      },
      'associatedRegionId': {
        type: 'string',
        editable: true,
      },
      'deliveryPointGroupId': {
        type: 'string',
        editable: true,
      }
    }
  );

  index: string;
  sysId: string;
  stationName: string;
  shortName: string;
  streetAddress: string;
  stationType: string;
  contactNumber: string;
  distanceFromTerminal: string;
  estimatedHoursFromTerminal: string;
  customerId: string;
  status: string;
  shipTo: string;
  truckSize: string;
  lastUpdated: string;
  userName: string;
  geoPoint: GeoPoint;
  tanks: TankModel[] = [];
  stationTanks: TankModel[] = [];
  marker;
  stationNameType;
  stationShipToLabel;
  inventoryLastUpdated;
  associatedTerminalId: string;
  associatedRegionId: string;
  deliveryPointGroupId: string;
  name: string;
  isPTO: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.sysId = this.getValue('sysId');
    this.stationName = this.getValue('stationName');
    this.name = this.stationName;
    this.shortName = this.getValue('shortName');
    this.stationType = this.getValue('stationType');
    this.status = this.getValue('status');
    this.streetAddress = this.getValue('streetAddress');
    this.customerId = this.getValue('customerId');
    this.contactNumber = this.getValue('contactNumber');
    this.distanceFromTerminal = this.getValue('distanceFromTerminal');
    this.estimatedHoursFromTerminal = this.getValue('estimatedHoursFromTerminal');
    this.shipTo = this.getValue('shipTo');
    this.truckSize = this.getValue('truckSize');
    this.lastUpdated = this.getValue('lastUpdated');
    this.stationNameType = this.stationType + ' - ' + this.stationName;
    this.stationShipToLabel = this.shipTo + ', ' + this.correctStationName(this.stationName);
    this.associatedTerminalId = this.getValue('associatedTerminalId') || '';
    this.associatedRegionId = this.getValue('associatedRegionId') || '';
    this.deliveryPointGroupId = this.getValue('deliveryPointGroupId') || '';
    this.isPTO = (this.getValue('isPtoReq') === 'true' ? 'Yes' : 'No') || '';
    const point = this.getValue('geoPoint');
    if (point) {
      this.geoPoint = new GeoPoint(point.lat, point.lng);
    }

    //TODO temporary fix, nam
    if (this.getValue('userName')) {
      this.userName = this.getValue('userName');
    } else {
      this.userName = this.getValue('UserName');
    }

    if (this.getValue('stationTank')) {
      let tanks = this.getValue('stationTank');
      tanks = !UtilsService.isArray(tanks) ? [tanks] : tanks;
      this.tanks = [];
      _.map(tanks, (el) => {
        el.stationName = this.stationName;
        this.tanks.push(new TankModel(el));
        this.stationTanks.push(new TankModel(el));
      });
    }
  }

  setInventoryLastUpdated(time) {
    this.inventoryLastUpdated = moment(parseInt(time));
  }

  correctStationName(stationName) {
    if (!stationName) {
      return;
    }
    const nameArr = stationName.split(' ');
    return nameArr[nameArr.length - 1] !== 'Station' ? `${stationName} Station` : stationName;
  }

  setDeliveryPointGroup() {

  }
}

