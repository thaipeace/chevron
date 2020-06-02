import {UMDefaultObject, TQLFormData} from '../default/default-object.model';

export class UserModel extends UMDefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'firstName': {},
      'lastName': {},
      'emailId': {},
      'userName': {},
    }
  );

  token: string;
  username: string;
  expiry: number;
  email: string;
  firstName: string;
  lastName: string;
  route?: any;
  roleName: string;
  roleId: string;

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(_data = {}) {
    super(_data, 'SysId');
    if (this.getValue('token')) {
      this.token = this.getValue('token');
      this.username = this.getValue('userName');
      this.expiry = this.getValue('expiry');
      this.email = this.getValue('emailId');
      this.firstName = this.getValue('firstName');
      this.lastName = this.getValue('lastName');
      this.roleName = this.getValue('roleName');
      this.roleId = this.getValue('roleId');
    }
  }

  toEncryptString() {
    return btoa(JSON.stringify(this._raw));
  }

  decryptToObject(str: string) {
    const json = JSON.parse(atob(str));
    this.constructor(json);
  }

  isExpired() {
    return this.expiry < new Date().getTime();
  }

  isAdmin() {
    return this.getValue('roleId') == DEFAULT_ROLES.ADMIN;
  }

}

export function getRouteByRoleId(roleId: string) {
  switch (roleId) {
    case DEFAULT_ROLES.ADMIN:
      return DEFAULT_PARENT_ROUTES.MAIN;
    case DEFAULT_ROLES.PLANNER:
      return DEFAULT_PARENT_ROUTES.PLANNER;
    case DEFAULT_ROLES.OPERATOR:
      return DEFAULT_PARENT_ROUTES.OPERATOR;
    case DEFAULT_ROLES.CUSTOMER:
      return DEFAULT_PARENT_ROUTES.CUSTOMER;
    case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
      return DEFAULT_PARENT_ROUTES.TRUCK_COMPANY_OWNER;
    case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
      return DEFAULT_PARENT_ROUTES.TRUCK_COMPANY_OPERATOR;
    default:
      return null;
  }
}

export enum DEFAULT_ROLES {
  ANY = 'any',//any: any role is ok
  ADMIN = 'AdminRoleId',
  PLANNER = 'PlannerRoleId',
  CUSTOMER = 'CustomerRoleId',
  TRUCK_COMPANY_OWNER = 'TruckCompanyOwnerId',
  TRUCK_COMPANY_OPERATOR = 'TruckCompanyOperationsId',
  OPERATOR = 'OperatorRoleId'
}

export enum DEFAULT_PARENT_ROUTES {
  MAIN = 'main',
  ADMIN = 'admin',
  PLANNER = 'terminal-planner',
  OPERATOR = 'terminal-operator',
  CUSTOMER = 'customer',
  TRUCK_COMPANY_OWNER = 'truck-company-owner',
  TRUCK_COMPANY_OPERATOR = 'truck-company-operator',
  REMOTE = 'remote'
}
