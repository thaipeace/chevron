export interface ICustomerModeModel {
    id: number;
    name: string;
    customers: ICustomerModel[];
}

export interface ICustomerModel {
    id: number;
    name: string;
}

export const CUSTOMER_DATA: ICustomerModel[] = [{
    id: 1,
    name: 'A Company'
}, {
    id: 2,
    name: 'B Company'
}, {
    id: 3,
    name: 'C Company'
}, {
    id: 4,
    name: 'D Company'
}, {
    id: 5,
    name: 'E Company'
}, {
    id: 6,
    name: 'F Company'
}, {
    id: 7,
    name: 'G Company'
}];
// regular, priceup, pricedown,sales
export const MODE_DATA: ICustomerModeModel[] = [{
    id: 1,
    name: 'Regular',
    customers: [CUSTOMER_DATA[0], CUSTOMER_DATA[1]]
}, {
    id: 2,
    name: 'Price Up',
    customers: [CUSTOMER_DATA[2], CUSTOMER_DATA[3], CUSTOMER_DATA[4]]
}, {
    id: 3,
    name: 'Price Down',
    customers: []
}, {
    id: 4,
    name: 'Sales Up',
    customers: []
}, {
    id: 5,
    name: 'Sales Down',
    customers: [CUSTOMER_DATA[6]]
}];

