import {DefaultObject} from '@shared/models/default/default-object.model';


export class DriverFileUploadModel extends DefaultObject {
    response: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.response = this.getValue('Response');
    }
}
