import {DefaultObject} from '@shared/models/default/default-object.model';

export class DriverStatus extends DefaultObject {
    Key: string;
    Value: string;

    constructor(_data = {}) {
        super(_data, 'sysId');
        this.Key = this.getValue('key') || this.getValue('Key');
        this.Value = this.getValue('value') || this.getValue('Value');
    }
}
