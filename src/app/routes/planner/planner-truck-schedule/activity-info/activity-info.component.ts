import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/user-management/shared/services';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { TruckDataService } from '@app/shared/services/data/truck-data.service';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { Payload } from '@app/shared/models/payload';
import { DefaultDialogComponent } from '@app/shared/models/default/default-component.model';

@Component({
  selector: 'app-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrls: ['./activity-info.component.scss']
})
export class ActivityInfoComponent implements OnInit {

  public today: Date = new Date();
  public user: any;
  public warningMessage: string;
  public isTriggering: boolean = false;
  public isTriggered: boolean = false;

  constructor(
    private _AuthenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    public dialogRef: MatDialogRef<ActivityInfoComponent>
  ) { }

  ngOnInit() {
    this._AuthenticationService.loginedUserObservable.subscribe(u => {
      this.user = u;
    })
  }

  onTrigger() {
    this.isTriggering = true;
    let triggerSchedulePayload = new Payload(PayloadsConstant.TRUCK.TRIGGER_SCHEDULE, []);
    this.apiDataService.executeQuery(triggerSchedulePayload).subscribe(res => {
      if (res) {
        let raw = this.dataUtilService.convertXmlToJson(`<result>${res}</result>`);
        if (raw.result.Response && raw.result.Response.Status === 'Success') {
          this._snackBar.open(raw.result.Response.Message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
          this.onCancel();
        } else if (raw.result.Status === 'Failed') {
          this.warningMessage = raw.result.Message;
          //this._snackBar.open(
            //`Trigger schedule successfully. It will take time to finish. Please come back after 30 minutes.`,
            //X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
          
        } else if (raw.result.APIResponse && raw.result.APIResponse.Status) {
          this.warningMessage = 'Another activity is currently being processed by the system. Activities are sequential. Only one activity can be processed at any given time. This system is a multi-user system, thus to avoid having multiple users scheduling the same activity, user must wait scheduling a given activity until the current activity has completed.';
        }
      } else {
        this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });  
      }

      this.isTriggering = false;
      this.isTriggered = true;
    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    })
  }

  onCancel() {
    this.dialogRef.close(true);
  }
}
