import { DefaultObject, TQLFormData } from "../default/default-object.model";
import * as _ from 'lodash';

export class UserEditPasswordModel extends DefaultObject {
    private static _dataKeys: TQLFormData = new TQLFormData(
        {
            'userName': {
                type: 'string',
                editable: false,
                readonly: true,
                hidden: true
            },
            'oldPassword': {
                type: 'string',
                editable: true,
            },
            'password': {
                type: 'string',
                editable: true,
            },
            'rePassword': {
                type: 'string',
                editable: true,
            },
        }
    );

    constructor(_data = {}) {
        super(_data);
    }
}
