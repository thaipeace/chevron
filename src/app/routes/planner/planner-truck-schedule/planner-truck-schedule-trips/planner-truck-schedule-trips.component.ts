import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { TruckScheduleModel } from '@app/shared/models/data.models/fleet/truck-schedule.model';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { TruckDataService } from '@app/shared/services/data/truck-data.service';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION, SCHEDULE_STATUS, NOTIFICATION_LONG_DURARION } from '@app/shared/constants/value.constant';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { DmScheduleDialogComponent } from '@app/management/delivery-management/dm-schedule-dialog/dm-schedule-dialog.component';
import { UtilsService } from '@shared/services/utils.service';
import { ListViewMode } from '@shared/models/interfaces/view-mode.interface';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { DynamicItem } from '@shared/models/dynamic-item.class';
import { FmDriverDetailsCompactComponent } from '@management/fleet-management/fm-driver/fm-driver-details-compact/fm-driver-details-compact.component';
import { SideBarService } from '@shared/services/side-bar.service';
import { SmTruckScheduleCompactComponent } from '@management/schedule-management/sm-truck-schedule-compact/sm-truck-schedule-compact.component';
import { DeliveryDataService } from '@shared/services/data/delivery-data.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { SmAssignOrderDialogComponent } from '@management/schedule-management/sm-assign-order-dialog/sm-assign-order-dialog.component';
import { MappingLabelPipe } from '@shared/pipe/mapping-label.pipe';
import { StorageService } from '@app/shared/services/storage.service';
import { TripErrorModel } from '@shared/services/data/trip-data.service';
import { IQuestionDialogModel } from '@shared/models/dialog/question.dialog.model';
import { MessageQuestionDialogComponent } from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { ActivityInfoComponent } from '../activity-info/activity-info.component';

@Component({
  selector: 'app-planner-truck-schedule-trips',
  templateUrl: './planner-truck-schedule-trips.component.html',
  styleUrls: ['./planner-truck-schedule-trips.component.scss']
})
export class PlannerTruckScheduleTripsComponent extends DefaultComponent implements OnInit {

  @ViewChild('matPaginator') tripPaginator: MatPaginator;
  @ViewChild('matSort') tripSort: MatSort;
  table: MatTableDataSource<TruckScheduleModel>;
  currentViewMode = ListViewMode.Grid;
  viewModeEnum = ListViewMode;

  // @ViewChild('freeTruckMatPaginator') freeTruckPaginator: MatPaginator;
  // @ViewChild('freeTruckMatSort') freeTruckSort: MatSort;
  // freeTruckTable: MatTableDataSource<any>;

  public useDefault: boolean = false;
  public userRoleName: string = '';
  public schedules: any[] = [];
  public trucks: any[] = [];
  public freeTrucks: any[] = [];
  public freeTruckPlates: any[] = [];

  moment = moment;
  today = moment().toDate();
  isTomorrow: boolean = false;
  selectedDate = moment().toDate();
  // dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
  start: any;
  end: any;
  isDataLoading: boolean = false;

  min: Date = new Date();
  max: Date = new Date();

  selectedItem: any;

  // public scheduleHeaders: string[] = [
  //   'PTO', 'Total Capacity', 'Index', 'Truck', 'Drop', 'Destination Name', 'Terminal Arr.Time', 'Dest Arr.Time',
  //   'Terminal Ret.Time', '97', '95', 'E5', 'D'
  // ];
  selectedRow: any;
  //displayedColumns: string[] = ['ptoX', 'truck', 'drop', 'destinationName', 'scheduledTimeFrom',  'estimatedTime', 'scheduledTimeTo', 'totalCapacity', 'ron97', 'ron95', 'ronD', 'ronE5',  'orderStatus', 'tripStatus', 'scheduleStatus'];


  public trips: any[] = [];
  public displayedColumns: string[] = ['tripIndex', 'ptoX', 'truck', 'tripStatus', 'totalDrop', 'dropIndex', 'orderStatus', 'destinationName', 'dropCat.', 'destinationETA', 'ScheduleTimeFrom', 'term.Ret.ETA', 'totalTruckCPTY', 'emptyCompartments', 'compartments', 'scheduleStatus'];
  // public displayedColumnsFreeTruck: string[] = ['#', 'truckPlate', 'totalCapacity', 'truckState', 'safeLoadingPassDate'];
  tableHeadGroupSelect: any;

  private STORAGE_TABLE_HEADER_KEY = 'planner-truck-schedule-selected-table-header';

  constructor(
    private _DialogService: DialogService,
    private _authenticationService: AuthenticationService,
    private _TruckDataService: TruckDataService,
    private _snackBar: MatSnackBar,
    private _DeliveryDataService: DeliveryDataService,
    private _MatSnackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _StorageService: StorageService
  ) {
    super();
    // this._DialogService.open(SmAssignOrderDialogComponent, {});
    this.addSubscribes(
      this._authenticationService.loginedUserObservable.subscribe(([user]) => {
        if (user) {
          this.userRoleName = user.roleName;
        }
      })
    );

    this.addSubscribes(
      this._SideBarService.statusObservable.subscribe((rs) => {
        if (rs.status === SideBarService.STATUSES.CLOSE) {
          this.selectedRow = null;
          // this.loadData(rs.destination);
        }
      })
    );

    this.addSubscribes(
      this._SideBarService.refreshObservableDestination.subscribe((rs) => {
        this.loadData(rs);
      })
    );

    this.addSubscribes(
      this._SideBarService.refreshObservable.subscribe((rs) => {
        this.loadData();
      })
    );

  }

  ngOnInit() {
    this._SideBarService.close();
    this.start = this.toStartOfDay(this.selectedDate).valueOf();
    this.end = moment(this.start).add('day', 1).subtract('second', 1).valueOf();

    if (this._StorageService.get(this.STORAGE_TABLE_HEADER_KEY)) {
      this.tableHeadGroupSelect = this._StorageService.get(this.STORAGE_TABLE_HEADER_KEY).split(',');
    } else {
      this.tableHeadGroupSelect = this.displayedColumns;
    }
    this.loadData();
  }

  loadData(destination?) {
    if (!destination) {
      this._SideBarService.close();
    }

    this.cancelUpdate();
    this.isDataLoading = true;

    if (!this.start || !this.end) {
      return;
    }
    let systemScheduletPayload = new Payload(PayloadsConstant.getSystemSchedule, [this.start, this.end]);
    this.apiDataService.executeQuery(systemScheduletPayload).subscribe(res => {
      this.trips = [];
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this.isDataLoading = false;
      if (raw.APIResponse.Status === 'Success') {
        this.trips = this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Message.Trip);

        this.trips.forEach(trip => {
          if (trip.CompartmentDetails) {
            trip.CompartmentDetails.Compartment = this.dataUtilService.wrapObjToOneElementArray(trip.CompartmentDetails.Compartment);
          } else {
            trip.CompartmentDetails = {Compartment: []};
          }

          if (trip.ScheduleDetails) {
            trip.ScheduleDetails.Schedule = this.dataUtilService.wrapObjToOneElementArray(trip.ScheduleDetails.Schedule);
          } else {
            trip.ScheduleDetails = {Schedule: []};
          }
        });
      } else {
        this.trips.length = 0;
      }

      // console.log(this.trips);
      _.map(this.trips, el => this.checkError(el));

      this.table = new MatTableDataSource(this.trips);
      this.table.sort = this.tripSort;
      this.table.paginator = this.tripPaginator;

      this.freeTruckPlates = [];
      this.freeTrucks = [];
      this._TruckDataService.findTruckByMappingDataAndTimeRange(this.start.valueOf(), this.end.valueOf()).then((rs) => {
        let truckDriverData = rs;
        this.trucks = rs.map(x => new TruckModel(x['Truck']));

        this.trucks.forEach(truck => {
          if (this.isFreeTruck(truck) &&
            this.freeTrucks.every(ft => ft.truckPlate !== truck.truckPlate)) {
            this.freeTrucks.push(truck);
          }
        });
        this.freeTruckPlates = this.freeTrucks.map(truck => truck.truckPlate);
      });

    }, error => {
      console.log('Loading error');
    });
  }

  isFreeTruck(truck) {
    let result = false;

    if (this.trips.every(trip => trip.TruckPlate !== truck.truckPlate)
      && this.freeTrucks.every(ft => ft.truckPlate !== truck.truckPlate)) {
      result = true;
    }

    return result
  }

  isHalfFreeTruck(truckDriverData) {
    let isFreeHalf = false;

    for (let i = 0; i < this.trucks.length; i++) {
      let morningTripCount = 0;
      let afternoonTripCount = 0;
      let selectedTrips = this.trips.filter(trip => trip.TruckPlate === this.trucks[i].truckPlate);
      selectedTrips.forEach(strip => {
        if ((new Date(parseInt(strip.ScheduleTimeFrom))).getHours() < 12) {
          morningTripCount = 1;
        } else {
          afternoonTripCount = 1;
        }
      });
      let dayTripsCount = morningTripCount + afternoonTripCount;

      let morningDriverCount = 0;
      let afternoonDriverCount = 0;
      let selectedDriverProfiles = truckDriverData.filter(data => data.Truck.truckPlate === this.trucks[i].truckPlate);
      selectedDriverProfiles.forEach(profile => {
        if (profile.driverDailyStatus === 'A') {
          morningDriverCount = 1;
        } else if (profile.driverDailyStatus === 'P') {
          afternoonDriverCount = 1;
        }
      });
      let dayDriverCount = morningDriverCount + afternoonDriverCount;

      if (dayTripsCount !== dayDriverCount) {
        isFreeHalf = dayTripsCount !== dayDriverCount;
        break;
      }
    }

    return isFreeHalf;
  }

  checkError(trip) {
    trip.errors = new TripErrorModel();
    if (this.isAllSchedulesApproved(trip)) {
      trip.errors.hasError = true;
      trip.errors.add(TripErrorModel.Type.PLANNER_APPROVED, SCHEDULE_STATUS.PLANNER_APPROVED);
      return;
    }
    if (this.inPast(trip)) {
      trip.errors.hasError = true;
      trip.errors.add(TripErrorModel.Type.IN_PAST, 'Time Past');
      return;
    }
    if (!this.in48Hour(trip)) {
      trip.errors.hasError = true;
      trip.errors.add(TripErrorModel.Type.NOT_IN_48_HOURS, 'Actions only available before 48 hours since schedule time');
      return;
    }
    if (!this.isAllOrderApproved(trip)) {
      trip.errors.hasError = true;
      trip.errors.add(TripErrorModel.Type.AWAITING_APPROVAL, SCHEDULE_STATUS.AWAITING_APPROVAL);
    }
  }

  ngDoCheck(): void {
  }

  toStartOfDay(date) {
    return moment(date).millisecond(0).second(0).minute(0).hour(0);
  }

  onRefresh() {
    this.loadData();
  }

  onTimeChange() {
    // console.log(moment(this.selectedDate).format());
    if (this.selectedDate.getDate() - this.today.getDate() == 1) {
      this.isTomorrow = true;
    } else {
      this.isTomorrow = false;
    }
    // this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
    this.setTime(this.selectedDate);
    this.cancelUpdate();
  }

  exportSchedule() {
    this._DeliveryDataService.exportTruckTrip(moment(this.selectedDate).startOf('day').valueOf(),
      moment(this.selectedDate).endOf('day').valueOf())
      .then((rs) => {
        if (rs !== null) {
          window.open(rs, '_blank');
        } else {
          this._MatSnackBar.open(`No data for ${moment(this.selectedDate).format('MMMM DD YYYY')}`
            , X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }
      });
  }

  onPendingUpdate(element: any) {
    if (element.scheduledTimeTo - element.fixedscheduledTimeTo != 0 ||
      element.estimatedTime - element.fixedestimatedTime != 0 ||
      element.scheduledTimeFrom - element.fixedscheduledTimeFrom != 0 ||
      element.truck.sysId != element.fixedtruck.sysId) {
      this.selectedItem = element;
      return;
    }
    this.selectedItem = null;
  }

  onUpdate() {
    let scheduledTimeFrom = this.selectedItem.scheduledTimeFrom ? this.selectedItem.scheduledTimeFrom.valueOf() : '';
    let scheduledTimeTo = this.selectedItem.scheduledTimeTo ? this.selectedItem.scheduledTimeTo.valueOf() : '';

    this._TruckDataService.updateTruckSchedule(this.selectedRow.TripId, scheduledTimeFrom, scheduledTimeTo).then(() => {
      this._snackBar.open(`Updated schedule successfully`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      this.loadData();
    }).catch(() => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }).finally(() => {
      this.selectedItem = null;
      this._SideBarService.close();
    });
  }

  updateTruckList(element: any, newTruck: any, oldTruck: any) {
    let trucks = element.trucks;
    let newTruckIndex = trucks.findIndex(x => x.sysId == newTruck.sysId);
    trucks.splice(newTruckIndex, 1);
    trucks.push(oldTruck);
    let selectedElementIndex = this.schedules.findIndex(x => x.sysId === element.sysId);
    this.schedules[selectedElementIndex].trucks = trucks;
  }

  cancelUpdate() {
    if (!this.selectedItem) {
      return;
    }
    let selectedElementIndex = this.schedules.findIndex(x => x.sysId === this.selectedItem.sysId);
    this.schedules[selectedElementIndex].scheduledTimeTo = this.schedules[selectedElementIndex].fixedscheduledTimeTo;
    this.schedules[selectedElementIndex].estimatedTime = this.schedules[selectedElementIndex].fixedestimatedTime;
    this.schedules[selectedElementIndex].scheduledTimeFrom = this.schedules[selectedElementIndex].fixedscheduledTimeFrom;
    this.schedules[selectedElementIndex].truck = this.schedules[selectedElementIndex].fixedtruck;
    this.schedules[selectedElementIndex].trucks = this.schedules[selectedElementIndex].fixedTrucks;
    this.selectedItem = null;
  }

  setTime(date) {
    // this.dateTime = moment(date).format('MM/DD/YYYY');
    this.start = this.toStartOfDay(date).valueOf();
    this.end = moment(this.start).add('day', 1).subtract('second', 1).valueOf();
    this.loadData();
  }

  public toggle(event: any) {
    this.cancelUpdate();
    if (event.checked) {
      let date = new Date();
      this.isTomorrow = true;
      date.setDate(this.today.getDate() + 1);
      this.selectedDate = date;
      // this.dateTime = moment(this.selectedDate).format('MM/DD/YYYY');
      this.start = this.toStartOfDay(new Date()).add('day', 1).valueOf();
      this.end = moment(this.start).add('day', 1).subtract('second', 1).valueOf();
      this.today = new Date();
      this.loadData();
      return;
    }
    this.isTomorrow = false;
    this.selectedDate = new Date(this.today.valueOf());
    this.today = new Date();
    this.setTime(new Date());
  }

  parseDate() {
    return moment(this.selectedDate).format('MM/DD/YYYY');
  }

  parseDateTiming(date) {
    return moment(date).format('YYYY-MM-DD (HH:mm)');//mm for minute, not MM
  }

  triggerSchedule() {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to create schedule?`,
      onYes: () => {
        questionDialogRef.close();

        const activityDialogRef = this._DialogService.open(
          ActivityInfoComponent, {}, { disableClose: true }
        );
        // activityDialogRef.afterClosed().subscribe((res) => {
        //   if (res === 'Scheduled') {
        //     this.loadData();
        //   }
        // });

        // this._TruckDataService.triggerSchedule().then(() => {
        //   // this.loadData();
        // }).catch(() => {
        //   this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        // }).finally(() => {
        //   // this.selectedItem = null;
        // });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  approveSchedule(trip) {
    this._TruckDataService.approveSchedule(trip.TripId).then((res) => {
      let message = res.data.APIResponse.Message;
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_LONG_DURARION });
    }).finally(() => {
      this.onRefresh();
    });
  }

  onManuallySchedule() {
    const dialogRef = this._DialogService.open(DmScheduleDialogComponent, { freeTruckPlates: this.freeTruckPlates });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Scheduled') {
        this.loadData();
      }
    });
  }

  changeViewMode(mode: ListViewMode) {
    this.currentViewMode = mode;
    this._SideBarService.close();
  }

  openCompact(row: any, collapsedArr?) {
    if (row.EmptyCompartments == row.CompartmentDetails.Compartment.length) {
      this._snackBar.open('Data is errored', X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      return;
    }
    this.selectedRow = row;
    // const schedule = _.filter(this.schedules, (el) => {
    //   return this.selectedRow.truck.truckPlate === el.truck.truckPlate;
    // });
    this._SideBarService.open(new DynamicItem(SmTruckScheduleCompactComponent,
      {
        extra: {
          date: this.start,
          totalDrop: this.selectedRow.DropCount,
          freeTruckPlates: this.freeTruckPlates,
          trucks: this.trucks,
          tripIndex: this.selectedRow.TripIndex,
          collapseArray: collapsedArr || [true]
        },
        selectedTripId: this.selectedRow.TripId,
        isTomorrow: this.isTomorrow
      }
    ));
  }

  isAllOrderApproved(trip) {
    return trip.ScheduleDetails.Schedule.every(s => s.OrderStatus === 'Approved');
  }

  isAllSchedulesApproved(trip) {
    return trip.ScheduleDetails.Schedule.every(s => s.ScheduleStatus === SCHEDULE_STATUS.PLANNER_APPROVED);
  }

  changeDisplayHeadColumnGroup($event: any) {
    this.tableHeadGroupSelect = $event;
    this._StorageService.set(this.STORAGE_TABLE_HEADER_KEY, this.tableHeadGroupSelect.join(','));
  }

  in48Hour(element: any) {
    if (element && element['ScheduleTimeFrom']) {
      const timestamp = moment(parseInt(element['ScheduleTimeFrom'])).valueOf();
      return timestamp > moment().valueOf() && timestamp < moment().add(2, 'days').valueOf();
    }
    return false;
  }

  inPast(element: any) {
    if (element && element['ScheduleTimeFrom']) {
      const timestamp = parseInt(element['ScheduleTimeFrom']);
      return timestamp < moment().valueOf();
    }
    return true;
  }

  scrollTo(idSelector): void {
    let element = document.getElementById(idSelector);
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  dayStep(type) {
    this.cancelUpdate();
    let tempDate = new Date(this.selectedDate);
    if (type === 'previous') {
      tempDate.setDate(tempDate.getDate() - 1);
    } else if (type === 'next') {
      tempDate.setDate(tempDate.getDate() + 1);
    }

    this.selectedDate = tempDate;
    this.onTimeChange()
    // this.setTime(this.selectedDate);
    // this.cancelUpdate();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
