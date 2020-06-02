import { Injectable } from '@angular/core';
import { PayloadsConstant } from '@shared/constants/payloads.constant';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@shared/services/api.service';
import { Payload } from '@shared/models/payload.model';
import { CustomerModel } from '@shared/models/data.models/customer/customer.model';
import { IUMTQLFormData } from '@app/user-management/shared/models/default/default-object.model';

const payloadCustomer = PayloadsConstant.CUSTOMER;
const PAYLOAD_KEYS = {
    FIND_ALL: 'find_all',
    FIND_BY_ID: 'find_by_id',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    FIND_BY_NAME: 'find_by_name'
};

@Injectable({
    providedIn: 'root'
})
export class CustomerDataService {
    payloads = {};

    private customerAllSource = new BehaviorSubject<CustomerModel[]>(null);
    customerAllObservable = this.customerAllSource.asObservable();

    constructor(private apiService: ApiService) {
        this.payloads = {
            [PAYLOAD_KEYS.FIND_ALL]: new Payload(payloadCustomer.FIND_ALL, payloadCustomer.OBJECT_FIND, CustomerModel),
            [PAYLOAD_KEYS.FIND_BY_ID]: new Payload(
                payloadCustomer.FIND_BY_ID,
                payloadCustomer.OBJECT_FIND,
                CustomerModel
            ),
            [PAYLOAD_KEYS.FIND_BY_NAME]: new Payload(
                payloadCustomer.FIND_BY_NAME,
                payloadCustomer.OBJECT_FIND,
                CustomerModel
            ),
            [PAYLOAD_KEYS.CREATE]: new Payload(
                payloadCustomer.CREATE_CUSTOMER,
                payloadCustomer.OBJECT_FIND,
                CustomerModel
            ),
            [PAYLOAD_KEYS.UPDATE]: new Payload(
                payloadCustomer.UPDATE_CUSTOMER,
                payloadCustomer.OBJECT_FIND,
                CustomerModel
            ),
            [PAYLOAD_KEYS.DELETE]: new Payload(payloadCustomer.DELETE, payloadCustomer.OBJECT_FIND, CustomerModel)
        };
    }

    findAll(): Promise<any> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_ALL], null).then(rs => {
            this.customerAllSource.next(rs);
            return rs;
        });
    }

    findById(id): Promise<CustomerModel> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_ID], [id]).then(rs => {
            return rs.length ? rs[0] : null;
        });
    }

    isNoExistName(name): Promise<boolean> {
        return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_BY_NAME], [name]).then(rs => {
            console.log(rs);
            return rs.length > 0 ? false : true;
        });
    }

    create(object: IUMTQLFormData, username: string) {
        object.setValue('userName', username);
        return this.apiService.create(this.payloads[PAYLOAD_KEYS.CREATE], object);
    }

    update(object: IUMTQLFormData, username: string) {
        object.setValue('userName', username);
        return this.apiService.update(this.payloads[PAYLOAD_KEYS.UPDATE], object);
    }

    delete(object: IUMTQLFormData, username: string) {
        object.setValue('userName', username);
        return this.apiService.delete(this.payloads[PAYLOAD_KEYS.DELETE], object);
    }
}
