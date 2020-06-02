import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {ApiService} from '@shared/services/api.service';
import {Payload} from '@shared/models/payload.model';
import * as _ from 'lodash';
import {UtilsService} from '@shared/services/utils.service';
import {CompartmentModel} from '@shared/models/data.models/fleet/compartment.model';

const payloadTrip = PayloadsConstant.TRIP;
const PAYLOAD_KEYS = {
  ASSOCIATE_ORDER: 'associate_order',
  VALIDATE_ASSOCIATE_ORDER: 'validate_associate_order',
  DISASSOCIATE_ORDER: 'disassociate_order',
  DIVERT_ORDER: 'divert_order',
  GET_TRIP_DETAILS_BY_ID: 'get_trip_details_by_id',
  GET_COMPARTMENT_BY_ORDER: 'get_compartment_by_order',
};

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  payloads = {};

  constructor(private apiService: ApiService) {
    this.payloads = {
      [PAYLOAD_KEYS.ASSOCIATE_ORDER]: new Payload(payloadTrip.ASSOCIATE_ORDER),
      [PAYLOAD_KEYS.DISASSOCIATE_ORDER]: new Payload(payloadTrip.DISASSOCIATE_ORDER),
      [PAYLOAD_KEYS.VALIDATE_ASSOCIATE_ORDER]: new Payload(payloadTrip.ASSOCIATE_ORDER),
      [PAYLOAD_KEYS.DIVERT_ORDER]: new Payload(payloadTrip.DIVERT_ORDER),
      [PAYLOAD_KEYS.GET_TRIP_DETAILS_BY_ID]: new Payload(payloadTrip.GET_TRIP_DETAILS_BY_ID),
      [PAYLOAD_KEYS.GET_COMPARTMENT_BY_ORDER]: new Payload(payloadTrip.GET_COMPARTMENT_BY_ORDER),
    };
  }

  getTripById(tripId: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.GET_TRIP_DETAILS_BY_ID], [tripId]);
  }

  validateAssociateOrder(tripId: string, orderId: string, compartments: any, isUpdate: boolean = false) {
    const compartNos = [];
    const itemIds = [];
    _.map(compartments, (el) => {
      if (el.orderItem) {
        compartNos.push(el._data.compartmentNumber);
        itemIds.push(el.orderItem.getId());
      }
    });
    const compartmentQuery = this.createCompartmentQuery(compartNos, itemIds);
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.VALIDATE_ASSOCIATE_ORDER], [tripId, compartmentQuery, isUpdate]);
  }

  associateOrder(tripId: string, orderId: string, compartments: any) {
    return this.validateAssociateOrder(tripId, orderId, compartments, true);
  }

  disAssociateOrder(tripId: string, scheduleId: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DISASSOCIATE_ORDER], [tripId, scheduleId]);
  }

  getCompartmentByOrder(tripId: string, orderId: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.GET_COMPARTMENT_BY_ORDER], [tripId, orderId])
      .then((rs) => {
        const array = [];
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          let data = rs['data']['APIResponse']['Message']['CompartmentDetails']['Compartment'];
          data = !UtilsService.isArray(data) ? [data] : data;
          _.map(data, (el) => {
            array.push(new CompartmentModel(el));
          });
        }
        return array;
      });
  }

  divertOrder(tripId: string, orderId: string, compartments: any) {
    return this.validateDivertOrder(tripId, orderId, compartments, true);
  }

  validateDivertOrder(tripId: string, orderId: string, compartments: any, isUpdate: boolean = false) {

    const compartNos = [];
    const itemIds = [];

    _.map(compartments, (el, index) => {
      if (el.orderItem) {
        compartNos.push(el._data['compartmentNumber']);
        itemIds.push(el.orderItem.getId());
      }
    });
    const query = this.createCompartmentQuery(compartNos, itemIds);
    console.log(compartments);
    console.log(query);
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.DIVERT_ORDER], [tripId, orderId, query, isUpdate]);
  }

  /*
  <Compartments>
			<Compartment>
				<compartmentNumber>4</compartmentNumber>
				<orderItemId>NYQX74KRAAAKYGYBSPUCIFUM</orderItemId>
			</Compartment>
		</Compartments>
  * */

  private createCompartmentQuery(compartNos: string[], itemIds: string[]) {
    const template = `
          <Compartment>
            <compartmentNumber>{0}</compartmentNumber>
            <orderItemId>{1}</orderItemId>
          </Compartment>
    `;
    let query = '';
    _.map(compartNos, (el, index) => {
      query += new Payload(template).buildPayload([el, itemIds[index]]);
    });
    return query;
  }
}

export class TripErrorModel {
  hasError: boolean;
  messages: Map<TripErrorModel.Type, string>;

  constructor() {
    this.hasError = false;
    this.messages = new Map<TripErrorModel.Type, string>();
  }

  add(key: TripErrorModel.Type, value: string) {
    this.messages.set(key, value);
  }

  toArray(): string[] {
    const array = [];
    const values = this.messages.values();
    let value = values.next();
    while (!value.done) {
      array.push(value.value);
      value = values.next();
    }
    return array;
  }

  has(key: TripErrorModel.Type) {
    return this.messages.has(key);
  }

  get(key: TripErrorModel.Type) {
    return this.messages.get(key);
  }
}

export namespace TripErrorModel {
  export enum Type {
    AWAITING_APPROVAL,
    IN_PAST,
    NOT_IN_48_HOURS,
    AFTER_LOADING,
    BEFORE_LOADING,
    AFTER_UNLOADING,
    PLANNER_APPROVED
  }
}
