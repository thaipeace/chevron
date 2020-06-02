import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import * as _ from 'lodash';
import * as moment from 'moment';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {DataUtilService} from '@app/shared/services/data-util.service';
import {MatSnackBar} from '@angular/material';
import {TruckDataService} from '@app/shared/services/data/truck-data.service';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION,
  SCHEDULE_STATUS,
  TRIP_STATUS,
  ORDER_STATUS,
  ENUM_NP
} from '@app/shared/constants/value.constant';
import {SideBarService} from '@app/shared/services/side-bar.service';
import {Payload} from '@app/shared/models/payload';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {IQuestionDialogModel} from '@app/shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {SmAssignOrderDialogComponent} from '@management/schedule-management/sm-assign-order-dialog/sm-assign-order-dialog.component';
import {CmStationDetailsDialogComponent} from '@app/management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {OmOrderDetailsDialogComponent} from '@management/order-management/om-order-details-dialog/om-order-details-dialog.component';
import {TripErrorModel, TripDataService} from '@shared/services/data/trip-data.service';
import {UtilsService} from '@shared/services/utils.service';

@Component({
  selector: 'app-sm-truck-schedule-compact',
  templateUrl: './sm-truck-schedule-compact.component.html',
  styleUrls: ['./sm-truck-schedule-compact.component.scss']
})
export class SmTruckScheduleCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedTripId: string = null;
  selectedTrip: any = null;
  extra: any = {};
  freeTruckPlates: any[] = [];
  trucks: any[] = [];
  isTomorrow: boolean = false;
  tripIndex: number = null;
  collapseArray = [];
  isEditing: boolean[] = [];
  blockTitle: string = '';
  tripStatusList: any[] = [];
  orderStatusList: any[] = [];
  today: Date = new Date();
  tomorrow: Date = new Date();
  scheduleTime: number;
  errors: TripErrorModel;
  errorTypes = TripErrorModel.Type;

  constructor(
    private _snackBar: MatSnackBar,
    private _TruckDataService: TruckDataService,
    private _TripDataService: TripDataService,
    private _SideBarService: SideBarService,
    private _DialogService: DialogService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    super();

    this.addSubscribes(
      this._SideBarService.refreshObservableDestination.subscribe(() => {
        console.log('subscribe refresh');
        if (this.selectedTripId) {
          this.setSelectedTrip();
        }
      })
    );
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }
    this.tomorrow.setDate(this.today.getDate() + 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.extra = this.data.extra;
      this.isTomorrow = this.data.isTomorrow;
      this.selectedTripId = this.data.selectedTripId;
      this.freeTruckPlates = this.data.extra.freeTruckPlates;
      this.trucks = this.data.extra.trucks;
      this.tripIndex = this.data.extra.tripIndex;

      this.setSelectedTrip();

      if (this.data.extra.collapseArray && this.data.extra.collapseArray.length) {
        this.collapseArray = this.data.extra.collapseArray;
      } else {
        this.collapseArray[0] = true;
      }
    }
  }

  private validateTrip(trip) {
    this.errors = new TripErrorModel();
    if (!this.isApproved(trip)) {
      this.errors.hasError = true;
      this.errors.add(TripErrorModel.Type.AWAITING_APPROVAL, 'Awaiting Approval');
      if (this.inPast(trip)) {
        this.errors.add(TripErrorModel.Type.IN_PAST, 'Time Past');
      }
    }

    if (!this.in48Hour(trip) && !this.inPast(trip)) {
      this.errors.hasError = true;
      this.errors.add(TripErrorModel.Type.NOT_IN_48_HOURS, 'Actions only available before 48 hours since schedule time');
    }

    // check trip status
    // console.log(trip);
    if (ENUM_NP.indexOfValue(TRIP_STATUS, trip.TripStatus) >= ENUM_NP.indexOfValue(TRIP_STATUS, TRIP_STATUS.LOADING)) {
      this.errors.hasError = true;
      this.errors.add(TripErrorModel.Type.AFTER_LOADING, 'Actions only available before LOADING');
    } else if (ENUM_NP.indexOfValue(TRIP_STATUS, trip.TripStatus) < ENUM_NP.indexOfValue(TRIP_STATUS, TRIP_STATUS.LOADING)) {
      this.errors.hasError = true;
      this.errors.add(TripErrorModel.Type.BEFORE_LOADING, 'Actions only available after LOADING');
    }

    if (ENUM_NP.indexOfValue(TRIP_STATUS, trip.TripStatus) >= ENUM_NP.indexOfValue(TRIP_STATUS, TRIP_STATUS.UNLOADING)) {
      this.errors.hasError = true;
      this.errors.add(TripErrorModel.Type.AFTER_UNLOADING, 'Actions only available before UNLOADING');
    }
  }

  private validateOrder(order) {
    // console.log(order);
    order.errors = new TripErrorModel();
    if (ENUM_NP.indexOfValue(ORDER_STATUS, order.OrderStatus) >= ENUM_NP.indexOfValue(ORDER_STATUS, ORDER_STATUS.LOADING)) {
      order.errors.hasError = true;
      order.errors.add(TripErrorModel.Type.AFTER_LOADING, 'Actions only available before LOADING');
    }
    if (ENUM_NP.indexOfValue(ORDER_STATUS, order.OrderStatus) >= ENUM_NP.indexOfValue(ORDER_STATUS, ORDER_STATUS.UNLOADING)) {
      order.errors.hasError = true;
      order.errors.add(TripErrorModel.Type.AFTER_UNLOADING, 'Actions only available before UNLOADING');
    }
  }

  setSelectedTrip() {
    let getTripPayload = new Payload(PayloadsConstant.getTripDetailsById, [this.selectedTripId]);
    this.apiDataService.executeQuery(getTripPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);

      if (raw.APIResponse.Status === 'Success') {
        this.selectedTrip = raw.APIResponse.Message;

        this.blockTitle = this.selectedTrip.TruckPlate;

        if (!UtilsService.isArray(this.selectedTrip.Schedule)) {
          this.selectedTrip.Schedule = [this.selectedTrip.Schedule];
        }

        this.selectedTrip.Schedule.forEach(st => {
          st.ScheduleTime = st.ScheduleTime ? new Date(parseInt(st.ScheduleTime)) : new Date();
          st.OrderEstimatedTime = st.OrderEstimatedTime ? new Date(parseInt(st.OrderEstimatedTime)) : new Date();
          this.validateOrder(st);
        });

        this.selectedTrip.TerminalArrivalTime = this.selectedTrip.TerminalArrivalTime ? new Date(parseInt(this.selectedTrip.TerminalArrivalTime)) : null;
        this.selectedTrip.TerminalReturnTime = this.selectedTrip.TerminalReturnTime ? new Date(parseInt(this.selectedTrip.TerminalReturnTime)) : null;

        // if (this.isTomorrow) {
        this.buildTripNextStatus(this.selectedTrip.TripStatus);
        this.buildOrdersNextStatus(this.selectedTrip.Schedule);
        // }
        if (this.selectedTrip.TerminalArrivalTime) {
          this.scheduleTime = parseInt(this.selectedTrip.TerminalArrivalTime);
          this.validateTrip(this.selectedTrip);
        }
      } else {
        this._snackBar.open(raw.APIResponse.Message);
        this._SideBarService.close();
      }
    }, error => {
      console.log('Loading error');
    });
  }

  close() {
    this._SideBarService.close();
    this.control.fn_close();
  }

  onSaveSchedule(schedule, index) {
    let updateTripInfoPayload = new Payload(PayloadsConstant.updateScheduleInfo,
      [schedule.ScheduleId, schedule.OrderEstimatedTime ? schedule.OrderEstimatedTime.getTime() : '']
    );
    this.apiDataService.executeQuery(updateTripInfoPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      let updateOrderStatusPayload = new Payload(
        PayloadsConstant.updateOrderStatus, [schedule.OrderId, schedule.OrderStatus]
      );
      this.apiDataService.executeQuery(updateOrderStatusPayload).subscribe(res => {
        let raw = this.dataUtilService.convertXmlToJson(res);
        this._snackBar.open(raw.APIResponse.Message, X_BUTTON, {duration: 5000});
        this.onDataChange();
        this.onCancelEdit(index);
        this._SideBarService.refreshWithDestination({tripId: this.selectedTripId, collapseArray: this.collapseArray});
      }, error => {
        console.log('Loading error');
      });

    }, error => {
      console.log('Loading error');
    });
  }

  onSaveTrip(trip) {
    let terminalTimesQuery = this.buildTerminalTimesQuery(
      trip.TerminalArrivalTime ? trip.TerminalArrivalTime.getTime() : '',
      trip.TerminalReturnTime ? trip.TerminalReturnTime.getTime() : ''
    );

    const updateTripInfoPayload = new Payload(PayloadsConstant.updateTripInfo,
      [trip.TripId, terminalTimesQuery]
    );
    this.apiDataService.executeQuery(updateTripInfoPayload).subscribe(res => {
      let updateTripStatusPayload = new Payload(PayloadsConstant.updateTripStatus, [trip.TripId, trip.TripStatus]);
      if (this.selectedTrip.TripStatus.includes('InTransitOutbound') || this.selectedTrip.TripStatus.includes('Unloading')) {
        let tripStatusArr = this.selectedTrip.TripStatus.split('::');
        let selectedSchedule = this.selectedTrip.Schedule.find(s => s.StationName === tripStatusArr[1].trim());

        updateTripStatusPayload = new Payload(
          PayloadsConstant.updateTripStatusWithStation,
          [trip.TripId, tripStatusArr[0].trim(), selectedSchedule.ScheduleId]
        );
      }

      this.apiDataService.executeQuery(updateTripStatusPayload).subscribe(res => {
        let raw = this.dataUtilService.convertXmlToJson(res);

        this._snackBar.open(raw.APIResponse.Message || raw.Message, X_BUTTON, {duration: 5000});
        this.onDataChange();
        this.onCancelEdit(0);
        this._SideBarService.refreshWithDestination({tripId: this.selectedTripId, collapseArray: this.collapseArray});
      }, error => {
        console.log('Loading error');
      });
    }, error => {
      console.log('Loading error');
    })
  }

  buildTerminalTimesQuery(terminalArrivalTime, terminalReturnTime) {
    let result = terminalArrivalTime ? `<terminalArrivalTime>${terminalArrivalTime}</terminalArrivalTime>` : '';
    result += terminalReturnTime ? `<terminalReturnTime>${terminalReturnTime}</terminalReturnTime>` : '';
    return result;
  }

  in48Hour(element: any) {
    if (element && element['TerminalArrivalTime']) {
      const timestamp = moment(element['TerminalArrivalTime']).valueOf();
      return timestamp > moment().valueOf() && timestamp < moment().add(2, 'days').valueOf();
    }
    return false;
  }

  inPast(element: any) {
    if (element && element['TerminalArrivalTime']) {
      const timestamp = moment(element['TerminalArrivalTime']).valueOf();
      return timestamp < moment().valueOf();
    }
    return true;
  }

  isApproved(trip: any) {
    return trip.Schedule.every(el => el.ScheduleStatus === SCHEDULE_STATUS.PLANNER_APPROVED);
  }

  isAllOrderApproved(trip) {
    return trip.Schedule.every(s => s.OrderStatus === 'Approved');
  }

  approveSchedule(selectedSchedule) {
    this._TruckDataService.approveSchedule(selectedSchedule.systemScheduleId).then((res) => {
      if (res['data'] && res['data']['Status'] === 'Success') {
        const message = `Approve schedule successfully!`;
        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        selectedSchedule.scheduleStatus = 'Planner Approved';
      } else {
        if (res['data'] && res['data']['Message']) {
          const message = res['data']['Message'];
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        } else {
          const message = `There are some problems. Please try again!`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }
      }
    }).finally(() => {
      this.control.fn_close();
    });
  }

  onEdit(index) {
    this.isEditing[index] = true;
  }

  onCancelEdit(index) {
    this.isEditing[index] = false;
  }

  onDeleteTrip() {
    const dialogData: IQuestionDialogModel = {
      title: 'Delete Trip',
      question: `Do you want to delete this trip?`,
      onYes: () => {
        let deleteTripPayload = new Payload(PayloadsConstant.deleteTripById, [this.selectedTripId]);
        this.apiDataService.executeQuery(deleteTripPayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          if (raw.APIResponse.Status === 'Success') {
            this._snackBar.open(raw.APIResponse.Message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
            questionDialogRef.close();
            this._SideBarService.refresh();
          } else {
            this._snackBar.open(raw.APIResponse.Message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }

        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  onAssignOrder() {
    this._DialogService.open(SmAssignOrderDialogComponent, {
      truckPlate: this.selectedTrip.TruckPlate, tripId: this.selectedTripId,
      compartments: this.selectedTrip['CompartmentDetails']['Compartment'],
      validateFn: (...args) => {
        return this._TripDataService.validateAssociateOrder(args[0], args[1], args[2]);
      },
      updateFn: (...args) => {
        return this._TripDataService.associateOrder(args[0], args[1], args[2]);
      },
    });
  }

  onDisassociateOrder(item) {
    const dialogData: IQuestionDialogModel = {
      title: 'Disassociate Order',
      question: `Do you want to disassociate this order?`,
      onYes: () => {
        this._TripDataService.disAssociateOrder(this.selectedTrip.TripId, item.ScheduleId)
          .then((res) => {
            res = res.data;
            if (res.APIResponse.Status === 'Success') {
              this._snackBar.open(res.APIResponse.Message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
              questionDialogRef.close();
              this._SideBarService.refreshWithDestination();
              this.setSelectedTrip();
            } else {
              this._snackBar.open(res.APIResponse.Message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
            }
          });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  onDivertOrder(item) {

    this._TripDataService.getCompartmentByOrder(this.selectedTripId, item.OrderId)
      .then((rs) => {
        if (rs.length) {
          this._DialogService.open(SmAssignOrderDialogComponent, {
            truckPlate: this.selectedTrip.TruckPlate, tripId: this.selectedTripId,
            orderId: item.OrderId,
            compartments: this.selectedTrip['CompartmentDetails']['Compartment'],
            divertCompartments: rs,
            validateFn: (...args) => {
              return this._TripDataService.validateDivertOrder(args[0], args[1], args[2]);
            },
            updateFn: (...args) => {
              return this._TripDataService.divertOrder(args[0], args[1], args[2]);
            },
          });
        } else {
          console.error('no divert compartment');
        }
      });
  }

  buildTripNextStatus(currentTripStatus) {
    let statusList = [
      {value: 'Scheduled', label: 'Scheduled', disabled: true},
      {value: 'AwaitingLoading', label: 'AwaitingLoading', disabled: true},
      {value: 'Loading', label: 'Loading', disabled: true}
    ];

    this.selectedTrip.Schedule.forEach(schedule => {
      statusList = statusList.concat([
        {
          value: `InTransitOutbound :: ${schedule.StationName}`,
          label: `InTransitOutbound :: ${schedule.StationName}`,
          disabled: true
        },
        {
          value: `Unloading :: ${schedule.StationName}`,
          label: `Unloading :: ${schedule.StationName}`,
          disabled: true
        },
      ]);
    });

    statusList = statusList.concat([
      {value: 'InTransitReturning', label: 'InTransitReturning', disabled: true},
      {value: 'AtTerminalPostTrip', label: 'AtTerminalPostTrip', disabled: true},
      {value: 'Completed', label: 'Completed', disabled: true}
    ]);

    this.tripStatusList = statusList;
    statusList.forEach((status, index) => {
      if (status.value.includes(currentTripStatus)) {
        let scheduleUnloaded = this.selectedTrip.Schedule.filter(schedule => {
          return ['Unloading', 'Delivered'].includes(schedule.OrderStatus);
        });

        if (!status.value.includes('InTransitOutbound') && !status.value.includes('Unloading')) {
          this.selectedTrip.TripStatus = this.tripStatusList[index].value;
          this.tripStatusList[index].disabled = false;
          if (this.tripStatusList[index + 1]) {
            this.tripStatusList[index + 1].disabled = false;
          }
        } else if (status.value.includes('InTransitOutbound')) {
          this.tripStatusList[index].disabled = true;

          let flag = 0;
          for (let i = 0; i < statusList.length; i++) {
            if (statusList[i].value.includes('InTransitOutbound')) {
              if (flag === scheduleUnloaded.length) {
                if (status.value.includes('InTransitOutbound')) {
                  this.selectedTrip.TripStatus = this.tripStatusList[i].value;
                  this.tripStatusList[i].disabled = false;
                  if (this.tripStatusList[i + 1]) {
                    this.tripStatusList[i + 1].disabled = false;
                  }
                  break;
                }
              }
              flag++;
            }
          }
          // console.log('InTransitOutbound:', flag);
          if (flag === this.selectedTrip.Schedule.length) {
            this.tripStatusList[this.tripStatusList.length - 3].disabled = false;
          }
        } else if (status.value.includes('Unloading')) {
          this.tripStatusList[index].disabled = true;

          let flag = 0;
          statusList.forEach((s, i) => {
            if (s.value.includes('Unloading')) {
              flag++;
              if (flag === scheduleUnloaded.length) {
                if (status.value.includes('Unloading')) {
                  this.selectedTrip.TripStatus = this.tripStatusList[i].value;
                  this.tripStatusList[i].disabled = false;
                  if (this.tripStatusList[i + 1]) {
                    this.tripStatusList[i + 1].disabled = false;
                  }
                }
              }
            }
          });
          // console.log('Unloading:', flag);
          if (flag === this.selectedTrip.Schedule.length + 1) {
            this.tripStatusList[this.tripStatusList.length - 3].disabled = false;
          }
        }
      }
    });
  }

  buildOrdersNextStatus(schedules) {

    schedules.forEach((schedule, index) => {
      let statusList = [
        {value: 'Approved', label: 'Approved', disabled: true},
        {value: 'Loading', label: 'Loading', disabled: true},
        {value: 'OutForDelivery', label: 'OutForDelivery', disabled: true},
        {value: 'Unloading', label: 'Unloading', disabled: true},
        {value: 'Delivered', label: 'Delivered', disabled: true},
      ];

      this.orderStatusList[index] = statusList;

      statusList.forEach((status, i) => {
        if (status.value === schedule.OrderStatus) {
          this.orderStatusList[index][i].disabled = false;
        } else {
          this.orderStatusList[index][i].disabled = true;
        }
      });

      for (let i = 0; i < this.orderStatusList[index].length; i++) {
        if (!this.orderStatusList[index][i].disabled && this.orderStatusList[index][i + 1]) {
          this.orderStatusList[index][i + 1].disabled = false;
          break;
        }
      }
    });
  }

  onStationDetails(stationId: any) {
    this._DialogService.open(CmStationDetailsDialogComponent, {id: stationId});
  }

  onOrderDetails(orderId: any) {
    this._DialogService.open(OmOrderDetailsDialogComponent, {id: orderId});
  }

  enableEditOrderStatus(index, orderStatus) {
    return this.isEditing[index+1] &&
      ['Approved', 'Loading', 'OutForDelivery', 'Unloading', 'Delivered'].includes(orderStatus) &&
      ['InTransitReturning', 'AtTerminalPostTrip', 'Completed'].includes(this.selectedTrip.TripStatus)
  }

}


