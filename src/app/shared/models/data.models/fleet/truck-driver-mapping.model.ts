import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class TruckDriverMappingModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
      },
      'driverId': {
        type: 'string',
      },
      'truckId': {
        type: 'string',
      },
      'userName': {
        type: 'string',
      },
    }
  );

  driverId;
  truckId;
  userName;

  constructor(_data = {}) {
    super(_data, 'sysId');
    this.driverId = this.getValue('driverId');
    this.truckId = this.getValue('truckId');
    this.userName = this.getValue('userName') || this.getValue('UserName');
  }
}

