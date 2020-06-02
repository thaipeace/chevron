import {DefaultObject, TQLFormData} from '../default/default-object.model';

export class RoleModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'sysId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'roleName': {
        type: 'string',
      },
      'description': {
        type: 'string',
      },
      'createDate': {
        type: 'date',
      },
    }
  );

  constructor(_data = {}) {
    super(_data, 'sysId');
  }
}
