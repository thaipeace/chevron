import {DefaultObject, TQLFormData} from '../default/default-object.model';

export class UserManagementModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData({
    'firstName': {},
    'lastName': {},
    'userName': {},
    'emailId': {},
    'roleId': {},
    'isLocked': {},
  });

  sysId: string;
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailId: string;
  roleId: string;
  isLocked: boolean;
  lastLoggedIn: any;
  createDate: string;
  roleName: string;

  constructor(_data = {}) {
    super(_data, 'sysId');

    if (this.getValue('sysId')) {
      this.sysId = this.getValue('sysId');
      this.id = this.getValue('sysId');
      this.fullName = `${this.getValue('firstName')} ${this.getValue('lastName')}`;
      this.firstName = this.getValue('firstName');
      this.lastName = this.getValue('lastName');
      this.userName = this.getValue('userName');
      this.emailId = this.getValue('emailId');
      this.roleId = this.getValue('roleId');
      this.lastLoggedIn = this.getValue('lastLoggedIn') || '';
      this.isLocked = this.getValue('isLocked') === 'true';
      this.createDate = this.getValue('createDate');
    }
  }

}
