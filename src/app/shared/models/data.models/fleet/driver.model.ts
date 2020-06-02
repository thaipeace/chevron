import * as _ from 'lodash';
import {DefaultObject, TQLFormData} from '@shared/models/default/default-object.model';
import {TruckDriverMappingComponent} from '@app/routes/fleet/truck-driver-mapping/truck-driver-mapping.component';

export class DriverModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'sysId': {
                type: 'string',
                editable: false,
                readonly: true,
                hidden: true
            },
            'chevronDriverId': {
                type: 'string',
                editable: true,
            },
            'fullName': {
                type: 'string',
                editable: true,
            },
            'driverLicenceNumber': {
                type: 'string',
                editable: true,
            },
            'companyId': {
                type: 'string',
                editable: true,
            },
            'driverStatus': {
                type: 'string',
                editable: true,
            },
            'address': {
                type: 'string',
                editable: true,
            },
            'contactNumber': {
                type: 'string',
                editable: true,
            },
            'terminalPassExpiryDate': {
                type: 'string',
                editable: true,
            }
        }
    );

    index: string;
    chevronDriverId: string;
    fullName: string;
    truck: string = '';
    driverLicenceNumber: string;
    createDate: string;
    companyId: string;
    driverStatus: string;
    lastUpdated: string;
    address: string;
    contactNumber: string;
    terminalPassExpiryDate: string;
    userName: string;

    mappingObject: TruckDriverMappingComponent;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.chevronDriverId = this.getValue('chevronDriverId');
        this.truck = this.getValue('truck');
        this.driverLicenceNumber = this.getValue('driverLicenceNumber');
        this.createDate = this.getValue('createDate');
        this.companyId = this.getValue('companyId');
        this.driverStatus = this.getValue('driverStatus');
        this.lastUpdated = this.getValue('LastUpdated');
        this.address = this.getValue('address') || this.getValue('Address');
        this.contactNumber = this.getValue('contactNumber');
        this.terminalPassExpiryDate = this.getValue('terminalPassExpiryDate');
        this.userName = this.getValue('userName');

        //  TODO fix temporary, need BE to fix, nam, 07/03/2019
        if (this.getValue('fullName')) {
            this.fullName = this.getValue('fullName');
        } else {
            this.fullName = this.getValue('FullName');
        }
    }
}
