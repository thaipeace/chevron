import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DriverDataService} from '@shared/services/data/driver-data.service';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import * as moment from 'moment';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@app/shared/constants/value.constant';
import {DriverSleepingTimeMappingModel} from '@app/shared/models/data.models/fleet/driver-sleeping-time-mapping.model';
import {DriverWorkingTimeMappingModel} from '@app/shared/models/data.models/fleet/driver-working-time-mapping.model';

@Component({
  selector: 'app-fm-driver-performance-daily-details-dialog',
  templateUrl: './fm-driver-performance-daily-details-dialog.component.html',
  styleUrls: ['./fm-driver-performance-daily-details-dialog.component.scss']
})
export class FmDriverPerformanceDailyDetailsDialogComponent implements OnInit {
  formData: TQLFormData;
  driverSysId: string;
  profileDate;

  error: string = '';
  isModified: boolean = false;

  newSleepingTimeInput: any[] = [];
  newWorkingTimeInput: any[] = [];

  sleepingTimeForDelete: any[] = [];
  workingTimeForDelete: any[] = [];

  driverSleepingHours: any[] = [];
  driverWorkingHours: any[] = [];

  hasChanged = false;

  private deleteSleepingTimeItems: any[] = [];
  private approvedSleepingTimeInputData: any[] = [];
  private deleteWorkingTimeItems: any[] = [];
  private approvedWorkingTimeInputData: any[] = [];

  private predictedSleepingTime: any[] = [];
  private predictedWorkingTime: any[] = [];

  driverProfile: any = {
    day: moment(),
    date: new Date(),
    sleepStartTime: new Date(),
    wakingUpTime: new Date(),
    workingStartTime: new Date(),
    workingEndTime: new Date(),
    driverStatus: String,
    isShow: true
  };

  pickerTime: string = 'time';

  isDisableInput: boolean = false;

  isStatusPopulated: boolean = false;

  status: any = {
    A: 'AM Shift',
    EL: 'Emergency Leave',
    L: 'Leave',
    MC: 'Medical Certificate',
    P: 'PM Shift',
    RD: 'RestDay',
    T: 'Training'
  };

  statusList: any[];

  inProgress: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _DriverDataService: DriverDataService,
    public dialogRef: MatDialogRef<FmDriverPerformanceDailyDetailsDialogComponent>,
    private _snackBar: MatSnackBar
  ) {
    this.driverProfile = data.driverProfile;
    data.driverProfile.sleepingTimeInRange.map(el => {
      this.newSleepingTimeInput.push({
        oldSleepStartTime: el.sleepStartTime,
        oldWakingUpTime: el.wakingUpTime,
        sleepStartTime: new Date(parseInt(el.sleepStartTime)),
        wakingUpTime: new Date(parseInt(el.wakingUpTime)),
        sysId: el.sysId,
        isDelete: false,
        driverId: data.driverSysId
      });
    });
    data.driverProfile.workingTimeInRange.map(el => {
      this.newWorkingTimeInput.push({
        oldWorkingStartTime: el.workingStartTime,
        oldWorkingEndTime: el.workingEndTime,
        workingStartTime: new Date(parseInt(el.workingStartTime)),
        workingEndTime: new Date(parseInt(el.workingEndTime)),
        sysId: el.sysId,
        isDelete: false,
        driverId: data.driverSysId
      });
    });
    this.profileDate = data.profileDate;
    this.isStatusPopulated = data.driverProfile.status == '' ? false : true;
    this.driverSysId = data.driverSysId;
    this.pasteDriverValues(data.driverProfile);
    this.statusList = Object.keys(this.status);
    this.driverSleepingHours = data.driverSleepingHours;
    this.driverWorkingHours = data.driverWorkingHours;
    this.updateStatus(data.driverProfile.status);
  }

  ngOnInit() {
  }

  async update() {
    this.hasChanged = true;
    this.inProgress = true;
    if (!(await this.validateTime())) {
      this.inProgress = false;
      return;
    }

    this.calculateTimeData();

    const payloadData = new TQLFormData();

    payloadData.setValue('driverId', this.driverSysId);
    payloadData.setValue('status', this.driverProfile.status);
    payloadData.setValue('profileDate', this.driverProfile.day.valueOf());

    let sleepingTimePayloadsForCreate: DriverSleepingTimeMappingModel[] = [];
    let sleepingTimePayloadsForDelete: DriverSleepingTimeMappingModel[] = [];
    this.deleteSleepingTimeItems.forEach(el => {
      if (el.sysId) {
        let model = new DriverSleepingTimeMappingModel({
          sysId: el.sysId
        });
        sleepingTimePayloadsForDelete.push(model);
      }
    });

    this.approvedSleepingTimeInputData.forEach(el => {
      let model = new DriverSleepingTimeMappingModel({
        driverId: el.driverId,
        sleepStartTime: el.sleepStartTime.valueOf(),
        wakingUpTime: el.wakingUpTime.valueOf()
      });
      sleepingTimePayloadsForCreate.push(model);
    });
    let workingTimePayloadsForCreate: DriverWorkingTimeMappingModel[] = [];
    let workingTimePayloadsForDelete: DriverWorkingTimeMappingModel[] = [];
    this.deleteWorkingTimeItems.forEach(el => {
      if (el.sysId) {
        let model = new DriverWorkingTimeMappingModel({
          sysId: el.sysId
        });
        workingTimePayloadsForDelete.push(model);
      }
    });

    this.newWorkingTimeInput.forEach(el => {
      let model = new DriverWorkingTimeMappingModel({
        driverId: el.driverId,
        workingStartTime: el.workingStartTime.valueOf(),
        workingEndTime: el.workingEndTime.valueOf()
      });
      workingTimePayloadsForCreate.push(model);
    });

    if (sleepingTimePayloadsForDelete.length) {
      await this._DriverDataService.deleteMultiSleepingTime(
        sleepingTimePayloadsForDelete
      );
    }

    if (workingTimePayloadsForDelete.length) {
      await this._DriverDataService.deleteMultiWorkingTime(
        workingTimePayloadsForDelete
      );
    }

    if (sleepingTimePayloadsForCreate.length) {
      await this._DriverDataService.createSleepingTime(
        sleepingTimePayloadsForCreate
      );
    }

    if (workingTimePayloadsForCreate.length) {
      await this._DriverDataService.createWorkingTime(
        workingTimePayloadsForCreate
      );
    }

    if (this.driverProfile.status.length) {
      payloadData.setValue('profileDate', this.profileDate ? this.profileDate.valueOf()
        : moment(this.driverProfile.day).startOf('day').valueOf());
      if (this.isStatusPopulated) {
        await this._DriverDataService.updateDriverStatus(payloadData);
      } else {
        await this._DriverDataService.createDriverStatus(payloadData);
      }
    }

    this._snackBar.open('Updated successfully', X_BUTTON, {
      duration: NOTIFICATION_DEFAULT_DURARION
    });
    this.inProgress = false;
    this.dialogRef.close(this.hasChanged);
  }

  setModified() {
    this.isModified = true;
  }

  onAddNewSleepingTime() {
    this.newSleepingTimeInput.push({
      sleepStartTime: new Date(
        parseInt(this.driverProfile.day.valueOf())
      ),
      wakingUpTime: new Date(parseInt(this.driverProfile.day.valueOf())),
      driverId: this.driverSysId,
      sysId: '',
      isDelete: false
    });
    this.error = '';
  }

  onAddNewWorkingTime() {
    this.newWorkingTimeInput.push({
      workingStartTime: new Date(
        parseInt(this.driverProfile.day.valueOf())
      ),
      workingEndTime: new Date(
        parseInt(this.driverProfile.day.valueOf())
      ),
      driverId: this.driverSysId,
      sysId: '',
      isDelete: false
    });
    this.error = '';
  }

  async onRemoveSleepingTime(item) {
    this.newSleepingTimeInput.splice(
      this.newSleepingTimeInput.indexOf(item),
      1
    );
    this.isModified = true;
    if (item.sysId) {
      this.deleteSleepingTimeItems.push(item);
    }

    this.error = '';
  }

  async onRemoveWorkingTime(item) {
    this.newWorkingTimeInput.splice(
      this.newWorkingTimeInput.indexOf(item),
      1
    );
    this.isModified = true;
    if (item.sysId) {
      this.deleteWorkingTimeItems.push(item);
    }
    this.error = '';
  }

  onTimeChange(e) {
    this.isModified = true;
    this.error = '';
  }

  updateStatus(i: any) {
    this.driverProfile.status = i;
    this.isDisableInput = false;
    if ('U, RD, EL , MC , L '.indexOf(i) > 1) {
      this.error = '';
      this.isDisableInput = true;
    }
  }

  getSleepingHoursRange(sleepingTimes: any[] = []) {
    if (!sleepingTimes.length) {
      return [];
    }
    let min = sleepingTimes[0].sleepStartTime;
    let max = sleepingTimes[0].wakingUpTime;

    for (let i = 1, len = sleepingTimes.length; i < len; i++) {
      let v = sleepingTimes[i];
      min = v.workingStartTime < min ? v.workingStartTime : min;
      max = v.wakingUpTime > max ? v.wakingUpTime : max;
    }

    return [min, max];
  }

  getWorkingHoursRange(workingTimes: any[] = []) {
    if (!workingTimes.length) {
      return [];
    }
    let min = workingTimes[0].workingStartTime;
    let max = workingTimes[0].workingEndTime;

    for (let i = 1, len = workingTimes.length; i < len; i++) {
      let v = workingTimes[i];
      min = v.workingStartTime < min ? v.workingStartTime : min;
      max = v.workingEndTime > max ? v.workingEndTime : max;
    }

    return [min, max];
  }

  onDateChange(date: Date) {
    this.driverProfile.sleepStartTime = this.driverProfile.wakingUpTime = this.driverProfile.workStartTime = this.driverProfile.workEndTime = date;
    this.driverProfile.day = moment(date);
  }

  async validateTime() {
    if (
      !this.newSleepingTimeInput.length &&
      !this.newWorkingTimeInput.length
    ) {
      return true;
    }
    let timeRange = [];
    let slpTimeRange = this.getSleepingHoursRange(
      this.newSleepingTimeInput
    );
    let wrkTimeRange = this.getWorkingHoursRange(this.newWorkingTimeInput);
    timeRange = [...slpTimeRange, ...wrkTimeRange];

    let min = timeRange[0],
      max = timeRange[0];

    for (let i = 1, len = timeRange.length; i < len; i++) {
      let v = timeRange[i];
      min = v < min ? v : min;
      max = v > max ? v : max;
    }

    let predictedSleepingTimeTmp = [];
    let predictedWorkingTimeTmp = [];

    await this._DriverDataService
      .findDriverAlternativeSleepingTimeByTimeRange(
        this.driverSysId,
        min.valueOf(),
        max.valueOf()
      )
      .then(sleepingHours => {
        sleepingHours = sleepingHours.map(el => {
          el.DriverSleepingHours.sleepStartTime = new Date(
            parseInt(el.DriverSleepingHours.sleepStartTime)
          );
          el.DriverSleepingHours.wakingUpTime = new Date(
            parseInt(el.DriverSleepingHours.wakingUpTime)
          );
          return el.DriverSleepingHours;
        });
        sleepingHours.map((el) => {
          let foundItem = this.newSleepingTimeInput.find(x => x.sysId == el.sysId);
          if (foundItem) {
            el.sleepStartTime = foundItem.sleepStartTime;
            el.wakingUpTime = foundItem.wakingUpTime;
          }
        });
        this.predictedSleepingTime = [...sleepingHours];
        predictedSleepingTimeTmp = [
          ...sleepingHours,
          ...this.newSleepingTimeInput
        ];
      });

    await this._DriverDataService
      .findDriverAlternativeWorkingTimeByTimeRange(
        this.driverSysId,
        min.valueOf(),
        max.valueOf()
      )
      .then(workingHours => {
        workingHours = workingHours.map(el => {
          el.DriverWorkingHours.workingStartTime = new Date(
            parseInt(el.DriverWorkingHours.workingStartTime)
          );
          el.DriverWorkingHours.workingEndTime = new Date(
            parseInt(el.DriverWorkingHours.workingEndTime)
          );
          return el.DriverWorkingHours;
        });
        workingHours.map((el) => {
          let foundItem = this.newWorkingTimeInput.find(x => x.sysId == el.sysId);
          if (foundItem) {
            el.workingStartTime = foundItem.workingStartTime;
            el.workingEndTime = foundItem.workingEndTime;
          }
        });
        this.predictedWorkingTime = [...workingHours];
        predictedWorkingTimeTmp = [
          ...workingHours,
          ...this.newWorkingTimeInput
        ];
      });

    let isValid = true;

    this.newSleepingTimeInput.map(slp => {
      let mix = predictedWorkingTimeTmp.find(
        x =>
          (x.workingStartTime <= slp.sleepStartTime &&
            x.workingEndTime > slp.sleepStartTime) ||
          (x.workingStartTime < slp.wakingUpTime &&
            x.workingEndTime >= slp.wakingUpTime) ||
          (slp.sleepStartTime <= x.workingStartTime &&
            slp.wakingUpTime > x.workingStartTime) ||
          (slp.sleepStartTime < x.workingEndTime &&
            slp.wakingUpTime >= x.workingEndTime)
      );
      if (mix) {
        this.error =
          'Sleeping time and Working time cannot be overlapped each other';
        isValid = false;
      }

      if (slp.wakingUpTime < slp.sleepStartTime) {
        this.error =
          'Walking up time cannot be earlier than Sleep Start Time';
        isValid = false;
      }

      if (slp.wakingUpTime.valueOf() == slp.sleepStartTime.valueOf()) {
        this.error = 'Walking Time cannot be equal to Sleep Start Time';
        isValid = false;
      }
    });

    this.newWorkingTimeInput.map(wrk => {
      let mix = predictedSleepingTimeTmp.find(
        x =>
          (x.sleepStartTime <= wrk.workingStartTime &&
            x.wakingUpTime > wrk.workingStartTime) ||
          (x.sleepStartTime < wrk.workingEndTime &&
            x.wakingUpTime >= wrk.workingEndTime) ||
          (wrk.workingStartTime <= x.sleepStartTime &&
            wrk.workingEndTime > x.sleepStartTime) ||
          (wrk.workingStartTime < x.wakingUpTime &&
            wrk.workingEndTime >= x.wakingUpTime)
      );
      if (mix) {
        this.error =
          'Sleeping time and Working time cannot be overlapped each other';
        isValid = false;
      }

      if (wrk.workingEndTime < wrk.workingStartTime) {
        this.error =
          'Working end time cannot be earlier than Working start time';
        isValid = false;
      }

      if (
        wrk.workingEndTime.valueOf() == wrk.workingStartTime.valueOf()
      ) {
        this.error =
          'Working End Time cannot be equal to Working Start Time';
        isValid = false;
      }
    });
    return isValid;
  }

  onCancel() {
    this.dialogRef.close(this.hasChanged);
  }

  pasteDriverValues(driverProfileData) {
    this.driverProfile.sleepStartTime =
      isFinite(driverProfileData.sleepStartTime) &&
      driverProfileData.sleepStartTime
        ? driverProfileData.sleepStartTime
        : new Date(parseInt(driverProfileData.day.valueOf()));
    this.driverProfile.wakingUpTime =
      isFinite(driverProfileData.wakingUpTime) &&
      driverProfileData.wakingUpTime
        ? driverProfileData.wakingUpTime
        : new Date(parseInt(driverProfileData.day.valueOf()));
    this.driverProfile.workStartTime =
      isFinite(driverProfileData.workStartTime) &&
      driverProfileData.workStartTime
        ? driverProfileData.workStartTime
        : new Date(parseInt(driverProfileData.day.valueOf()));
    this.driverProfile.workEndTime =
      isFinite(driverProfileData.workEndTime) &&
      driverProfileData.workEndTime
        ? driverProfileData.workEndTime
        : new Date(parseInt(driverProfileData.day.valueOf()));

    this.driverProfile.date = new Date(
      parseInt(driverProfileData.day.valueOf())
    );
  }

  calculateTimeData() {
    this.approvedSleepingTimeInputData = [];
    this.approvedWorkingTimeInputData = [];
    let chosenSleepingTime = this.newSleepingTimeInput[0];
    let sleepingTimeLen = this.newSleepingTimeInput.length;
    let chosenWorkingTime = this.newWorkingTimeInput[0];
    let workingTimeLen = this.newWorkingTimeInput.length;

    //////Sleeping Time calculator
    this.newSleepingTimeInput.map(input => {
      this.predictedSleepingTime.map(predictedItem => {
        if (
          this.deleteSleepingTimeItems.find(
            x => x.sysId == predictedItem.sysId
          )
        ) {
          return;
        }

        if (input.sleepStartTime >= predictedItem.sleepStartTime
          && input.wakingUpTime <= predictedItem.wakingUpTime) {
          this.deleteSleepingTimeItems.push(predictedItem);
          return;
        }

        if (
          input.wakingUpTime < predictedItem.sleepStartTime ||
          predictedItem.wakingUpTime < input.sleepStartTime
        ) {
          return;
        }

        if (
          input.sleepStartTime > predictedItem.sleepStartTime ||
          predictedItem.wakingUpTime == input.sleepStartTime
        ) {
          input.sleepStartTime = predictedItem.sleepStartTime;
        }

        if (
          input.wakingUpTime < predictedItem.wakingUpTime ||
          input.wakingUpTime == predictedItem.sleepStartTime
        ) {
          input.wakingUpTime = predictedItem.wakingUpTime;
        }

        this.deleteSleepingTimeItems.push(predictedItem);
      });
    });

    this.newSleepingTimeInput.map((el, i) => {
      if (
        chosenSleepingTime.wakingUpTime < el.sleepStartTime ||
        el.wakingUpTime < chosenSleepingTime.sleepStartTime
      ) {
        this.approvedSleepingTimeInputData.push(chosenSleepingTime);
        chosenSleepingTime = el;
      }

      if (chosenSleepingTime.sleepStartTime >= el.sleepStartTime
        && chosenSleepingTime.wakingUpTime <= el.wakingUpTime) {
        if (sleepingTimeLen === i + 1) {
          this.approvedSleepingTimeInputData.push(chosenSleepingTime);
        }
        return;
      }

      if (
        chosenSleepingTime.sleepStartTime > el.sleepStartTime ||
        el.wakingUpTime == chosenSleepingTime.sleepStartTime
      ) {
        chosenSleepingTime.sleepStartTime = el.sleepStartTime;
      }

      if (
        chosenSleepingTime.wakingUpTime < el.wakingUpTime ||
        chosenSleepingTime.wakingUpTime == el.sleepStartTime
      ) {
        chosenSleepingTime.wakingUpTime = el.wakingUpTime;
      }

      if (sleepingTimeLen === i + 1) {
        this.approvedSleepingTimeInputData.push(chosenSleepingTime);
      }

      return;
    });

    //////Working Time calculator
    this.newWorkingTimeInput.map(input => {
      this.predictedWorkingTime.map(predictedItem => {
        if (
          this.deleteWorkingTimeItems.find(
            x => x.sysId == predictedItem.sysId
          )
        ) {
          return;
        }

        if (input.workingStartTime >= predictedItem.workingStartTime
          && input.workingEndTime <= predictedItem.workingEndTime) {
          this.deleteWorkingTimeItems.push(predictedItem);
          return;
        }

        if (
          input.workingEndTime < predictedItem.workingStartTime ||
          predictedItem.workingEndTime < input.workingStartTime
        ) {
          return;
        }

        if (
          input.workingStartTime > predictedItem.workingStartTime ||
          predictedItem.workingEndTime == input.workingStartTime
        ) {
          input.workingStartTime = predictedItem.workingStartTime;
        }

        if (
          input.workingEndTime < predictedItem.workingEndTime ||
          input.workingEndTime == predictedItem.workingStartTime
        ) {
          input.workingEndTime = predictedItem.workingEndTime;
        }

        this.deleteWorkingTimeItems.push(predictedItem);
      });
    });

    this.newWorkingTimeInput.map((el, i) => {
      if (
        chosenWorkingTime.workingEndTime < el.workingStartTime ||
        el.workingEndTime < chosenWorkingTime.workingStartTime
      ) {
        this.approvedWorkingTimeInputData.push(chosenWorkingTime);
        chosenWorkingTime = el;
      }

      if (chosenWorkingTime.workingStartTime >= el.workingStartTime
        && chosenWorkingTime.workingEndTime <= el.workingEndTime) {
        if (workingTimeLen === i + 1) {
          this.approvedWorkingTimeInputData.push(chosenWorkingTime);
        }
        return;
      }

      if (
        chosenWorkingTime.workingStartTime > el.workingStartTime ||
        el.workingEndTime == chosenWorkingTime.workingStartTime
      ) {
        chosenWorkingTime.workingStartTime = el.workingStartTime;
      }

      if (
        chosenWorkingTime.workingEndTime < el.workingEndTime ||
        chosenWorkingTime.workingEndTime == el.workingStartTime
      ) {
        chosenWorkingTime.workingEndTime = el.workingEndTime;
      }

      if (workingTimeLen === i + 1) {
        this.approvedWorkingTimeInputData.push(chosenWorkingTime);
      }

      return;
    });
  }
}
