import * as _ from 'lodash';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';

export class CustomerModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'sysId': {
                type: 'string',
                editable: false,
                readonly: true,
                hidden: true
            },
            'userName': {
                type: 'string',
                editable: false,
            },
            'customerName': {
                type: 'string',
                editable: true,
            },
            'contactNumber': {
                type: 'string',
                editable: true,
            },
            'createDate': {
                type: 'string',
                editable: false,
            },
            'customerAddress': {
                type: 'string',
                editable: true,
            },
            'emailAddress': {
                type: 'string',
                editable: true,
            },
            'chevronCustomerId': {
                type: 'string',
                editable: true,
            },
            'soldTo': {
                type: 'string',
                editable: true,
            },
            'lastUpdated': {
                type: 'string',
                editable: true,
            },
        }
    );

    index: string;
    sysId: string;
    userName: string;
    customerId: string;
    stationId: string;
    createDate: string;
    lastUpdated: string;
    customerName: string;
    emailAddress: string;
    chevronCustomerId: string;
    soldTo: string;
    customerAddress: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.sysId = this.getValue('sysId');
        this.customerId = this.getValue('customerId');
        this.stationId = this.getValue('stationId');
        this.createDate = this.getValue('createDate');
        this.lastUpdated = this.getValue('lastUpdated');
        this.customerName = this.getValue('customerName');
        this.emailAddress = this.getValue('emailAddress');
        this.chevronCustomerId = this.getValue('chevronCustomerId');
        this.soldTo = this.getValue('soldTo');
        this.customerAddress = this.getValue('customerAddress');
        //TODO temporary fix, nam
        if (this.getValue('userName')) {
            this.userName = this.getValue('userName');
        } else {
            this.userName = this.getValue('UserName');
        }

    }
}
