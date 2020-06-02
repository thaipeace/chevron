import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';
import { TimeItemModel } from '@app/shared/models/time-item.model';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { DriverModel } from '@app/shared/models/data.models/fleet/driver.model';

@Component({
  selector: 'app-planner-truck-schedule-free-trucks',
  templateUrl: './planner-truck-schedule-free-trucks.component.html',
  styleUrls: ['./planner-truck-schedule-free-trucks.component.scss']
})
export class PlannerTruckScheduleFreeTrucksComponent extends DefaultComponent implements OnInit {

  @Input() freeTrucks: any[] = [];
  @Input() selectedDate: Date;
  @ViewChild('freeTruckMatPaginator') freeTruckPaginator: MatPaginator;
  @ViewChild('freeTruckMatSort') freeTruckSort: MatSort;
  public freeTruckTable: MatTableDataSource<any>;
  public displayedColumnsFreeTruck: string[] = ['#', 'truckPlate', 'totalCapacity', 'truckState', 'safeLoadingPassDate', 'drivers', 'timeLine'];
  driverProfiles: any[] = [];
  driverDailyProfiles: any[] = [];
  driverTruckMappings: any[] = [];
  timeRange: TimeItemModel[];

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    super();
   }

  ngOnInit() {
    this.timeRange = [];
    for (let i=1; i<25; i++) {
      this.timeRange.push(new TimeItemModel(i));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'freeTrucks': {
            this.getTruckDriver();
            this.renderFreeTruckTable();
          }
        }
      }
    }
  }

  renderFreeTruckTable() {
    this.freeTruckTable = new MatTableDataSource(this.freeTrucks);
    this.freeTruckTable.sort = this.freeTruckSort;
    this.freeTruckTable.paginator = this.freeTruckPaginator;
  }

  async getTruckDriver() {
    if (!this.freeTrucks.length) return;

    let driverTruckMapping = await this.getDriverTruckMapping();
    let rawdriverTruckMapping = this.dataUtilService.convertXmlToJsonParseAttributes(driverTruckMapping);
    this.driverTruckMappings = this.dataUtilService.wrapToArrayRemoveParent(rawdriverTruckMapping.Find.Result, 'TruckDriverMapping');

    let driverProfiles = await this.getDriverProfiles();
    let rawDriverProfiles = this.dataUtilService.convertXmlToJsonParseAttributes(driverProfiles);
    this.driverProfiles = rawDriverProfiles.Find.Result;

    let driverDailyProfiles = await this.getDriverDailyProfiles();
    let rawDriverDailyProfiles = this.dataUtilService.convertXmlToJsonParseAttributes(driverDailyProfiles);
    this.driverDailyProfiles = rawDriverDailyProfiles.Find.Result;

    this.buildFreeTruckTableData();
  }

  getDriverTruckMapping() {
    const from = this.toStartOfDay(this.selectedDate).valueOf();
    const to = this.toEndOfDay(this.selectedDate).valueOf();
    let exePayload = new Payload(PayloadsConstant.TRUCK_DRIVER_MAPPING.FIND_ALL_BY_DATE_RANGE, [from, to]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  getDriverProfiles() {
    const from = this.toStartOfDay(this.selectedDate).valueOf();
    const to = this.toEndOfDay(this.selectedDate).valueOf();
    let exePayload = new Payload(PayloadsConstant.DRIVER_PROFILE.FIND_DRIVER_CURRENT_STATUS, [from, to]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  getDriverDailyProfiles() {
    const from = this.toStartOfDay(this.selectedDate).valueOf();
    const to = this.toEndOfDay(this.selectedDate).valueOf();
    let exePayload = new Payload(PayloadsConstant.TRUCK.FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE, [from, to]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }
  

  buildFreeTruckTableData() {
    this.driverTruckMappings.forEach(mapping => {
      let freeTruckInd = this.freeTrucks.findIndex(ft => ft._data.sysId === mapping.truckId);

      if (freeTruckInd === -1) return;
      let selectedDriverDailyProfile = this.driverDailyProfiles.find(ddp => {
        return ddp.TruckDriverMapping.sysId === mapping.sysId && this.freeTrucks[freeTruckInd]._data.sysId === mapping.truckId;
      });

      if (selectedDriverDailyProfile) {
        let selectedDriverProfile = this.driverProfiles.find(dp => dp.Driver.sysId === selectedDriverDailyProfile.DriverProfile.driverId);
        let driver = new DriverModel(selectedDriverProfile.Driver);
        this.freeTrucks[freeTruckInd].addDriver(driver);
        this.freeTrucks[freeTruckInd].drivers.forEach(driver => {
          if (driver.driverDailyStatus) return;
          driver.driverDailyStatus = selectedDriverDailyProfile.DriverProfile.driverDailyStatus;
        });
      }
    });

    this.freeTrucks.forEach(ft => {
      ft.drivers.sort((a,b) => (a.driverDailyStatus > b.driverDailyStatus) ? 1 : ((b.driverDailyStatus > a.driverDailyStatus) ? -1 : 0));
    })
  }

  toStartOfDay(date) {
    return moment(date).startOf('day');
  }

  toEndOfDay(date) {
    return moment(date).endOf('day');
  }
}
