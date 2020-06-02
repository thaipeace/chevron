import {UMDefaultObject, TQLFormData} from '../default/default-object.model';

export class RoleModel extends UMDefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {}
  );

  name: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
    switch (this.getValue('roleName')) {
      case 'Customer':
        this.name = 'Customer Admin';
        break;
      case 'TruckCompanyOwner':
        this.name = 'Hauler Admin';
        break;
      case 'Planner':
        this.name = 'Terminal Planner';
        break;
      case 'Admin':
        this.name = 'Terminal Admin';
        break;
      case 'TruckCompanyOperations':
        this.name = 'Hauler Operations';
        break;
    }
  }
}
