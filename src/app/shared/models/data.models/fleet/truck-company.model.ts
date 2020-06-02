import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class TruckCompanyModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'sysId': {
                type: 'string',
                editable: false,
                readonly: true,
                hidden: true
            },
            'companyName': {
                type: 'string',
                editable: true,
            },
            'companyCode': {
                type: 'string',
                editable: true,
            },
            'contactNumber': {
                type: 'string',
                editable: true,
            },
            'contactPerson': {
                type: 'string',
                editable: true,
            },
            'companyId': {
                type: 'string',
                editable: true,
            },
        }
    );

    companyName: string;
    lastUpdated: string;
    createDate: string;
    userName: string;
    companyCode: string;
    contactNumber: string;
    contactPerson: string;
    companyId: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.lastUpdated = this.getValue('lastUpdated');
        this.createDate = this.getValue('createDate');
        this.companyName = this.getValue('companyName');
        this.userName = this.getValue('userName') || this.getValue('UserName');
        this.companyCode = this.getValue('companyCode');
        this.contactNumber = this.getValue('contactNumber');
        this.contactPerson = this.getValue('contactPerson');
        this.companyId = this.getValue('companyId');
    }
}

