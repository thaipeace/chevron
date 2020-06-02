import * as _ from "lodash";
import { DefaultObject } from '@shared/models/default/default-object.model';

export class TruckScheduleModel extends DefaultObject {
  ptoX: string;
  truck: string;
  dropNumber: number;
  destinationName: string;
  scheduledTimeFrom: Date;
  estimatedTime: Date;
  scheduledTimeTo: Date;
  totalCapacity: number;
  ron97: string;
  ron95: string;
  ronD: string;
  ronE5: string;
  fixedtruck: string;
  fixedscheduledTimeFrom: Date;
  fixedestimatedTime: Date;
  fixedscheduledTimeTo: Date;
  sysId: string;
  orderStatus: string;
  tripStatus: string;
  scheduleStatus: string;
  systemScheduleId: string;
  trucks: string;
  fixedTrucks: string;
  index: number;

  constructor(_data = {}) {
    super(_data, "sysId");
    this.ptoX = this.getValue("ptoX");
    this.totalCapacity = parseInt(this.getValue("totalCapacity"));
    this.index = parseFloat(this.getValue("index"));
    this.truck = this.getValue("truck");
    this.fixedtruck = this.getValue("fixedtruck");
    this.tripStatus = this.getValue("tripStatus");
    this.dropNumber = parseInt(this.getValue("drop"));
    this.destinationName = this.getValue("destinationName");
    this.scheduledTimeFrom = this.getValue("scheduledTimeFrom");
    this.estimatedTime = this.getValue("estimatedTime");
    this.scheduledTimeTo = this.getValue("scheduledTimeTo");
    this.fixedscheduledTimeFrom = this.getValue("scheduledTimeFrom");
    this.fixedestimatedTime = this.getValue("estimatedTime");
    this.fixedscheduledTimeTo = this.getValue("scheduledTimeTo");
    this.ron97 = this.getValue("ron97");
    this.ron95 = this.getValue("ron95");
    this.ronE5 = this.getValue("ronE5");
    this.ronD = this.getValue("ronD");
    this.orderStatus = this.getValue("orderStatus");
    this.scheduleStatus = this.getValue("scheduleStatus");
    this.systemScheduleId = this.getValue("systemScheduleId");
    this.trucks = this.getValue("trucks");
    this.fixedTrucks = this.getValue("fixedTrucks");
    this.sysId = this.getValue("sysId");
  }
}
