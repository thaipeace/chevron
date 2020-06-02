import {DefaultObject, TQLFormData} from '../default/default-object.model';

export class MenuRoleModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'menuTabName': {
        type: 'string',
      },
      'roleID': {
        type: 'string',
      }
    }
  );

  route: string;
  icon: string;

  constructor(_data = {}) {
    super(_data, 'sysId');
  }
}

export interface ISideBarMenuModel {
  name: string;
  route: string;
  icon: string;
  click?: () => void;
  none?: boolean;
}
