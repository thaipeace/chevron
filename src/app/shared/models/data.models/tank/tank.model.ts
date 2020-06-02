import * as _ from 'lodash';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class TankModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'tankNumber': {
        type: 'string',
        editable: true,
      },
      'archived': {
        type: 'boolean',
        editable: true,
      },
      'currentVolume': {
        type: 'string',
        editable: true,
      },
      'preferredMaxFill': {
        type: 'string',
        editable: true,
      },
      'deadStock': {
        type: 'string',
        editable: true,
      },
      'productCode': {
        type: 'string',
        editable: true,
      },
      'currentUllage': {
        type: 'string',
        editable: true,
      },
      'isPtoReq': {
        type: 'boolean',
        editable: true,
      },
      'maxFillCapacity': {
        type: 'string',
        editable: true,
      },
      'maxFillCapacityPercentage': {
        type: 'string',
        editable: true,
      },
      'stationId': {
        type: 'string',
        editable: true,
      },
      'tankCapacity': {
        type: 'string',
        editable: true,
      },
      'dischargePointName': {
        type: 'string',
        editable: true,
      },
      'dischargepointIndex': {
        type: 'string',
        editable: true,
      }
    }
  );

  sysId: string;
  tankNumber: string;
  archived: boolean;
  currentVolume: number;
  deadStock: number;
  productCode: string;
  lastUpdated: string;
  createDate: string;
  currentUllage: number;
  isPtoReq: boolean;
  maxFillCapacity: number;
  maxFillCapacityPercentage: number;
  stationId: string;
  tankCapacity: number;
  preferredMaxFill: number;
  thirdPartyTankId: string;
  userName: string;
  dischargePointName: string;
  dischargepointIndex: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.sysId = this.getId();
    this.tankNumber = this.getValue('tankNumber');
    this.archived = this.getValue('archived') === 'true' ? true : (this.getValue('archived') === 'false' ? false : null);
    this.setValue('archived', this.archived);
    this.currentVolume = parseFloat(this.getValue('currentVolume'));
    this.deadStock = parseFloat(this.getValue('deadStock'));
    this.productCode = this.getValue('productCode');
    this.lastUpdated = this.getValue('lastUpdated') || this.getValue('LastUpdated');
    this.createDate = this.getValue('createDate');
    this.currentUllage = parseFloat(this.getValue('currentUllage'));
    this.isPtoReq = this.getValue('isPtoReq') === 'true' ? true : false;
    this.setValue('isPtoReq', this.isPtoReq);
    this.maxFillCapacity = parseFloat(this.getValue('maxFillCapacity'));
    this.preferredMaxFill = parseFloat(this.getValue('PreferredMaxFill'));
    this.maxFillCapacityPercentage = parseFloat(this.getValue('maxFillCapacityPercentage'));
    this.stationId = this.getValue('stationId');
    this.tankCapacity = parseFloat(this.getValue('tankCapacity'));
    this.thirdPartyTankId = this.getValue('thirdPartyTankId');
    this.dischargePointName = this.getValue('dischargePointName');
    this.dischargepointIndex = this.getValue('dischargepointIndex');
    //TODO temporary fix, nam
    if (this.getValue('userName')) {
      this.userName = this.getValue('userName');
    } else {
      this.userName = this.getValue('UserName');
    }
  }
}

