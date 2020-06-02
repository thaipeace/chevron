import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {combineLatest} from 'rxjs';
import {TruckScheduleModel} from '@app/shared/models/data.models/fleet/truck-schedule.model';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {AuthenticationService} from '@app/user-management/shared/services';
import {TruckDataService} from '@app/shared/services/data/truck-data.service';
import {StationDataService} from '@app/shared/services/data/station-data.service';
import {MatSnackBar} from '@angular/material';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION, SCHEDULE_STATUS} from '@app/shared/constants/value.constant';
import {MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {DmScheduleDialogComponent} from '@app/management/delivery-management/dm-schedule-dialog/dm-schedule-dialog.component';
import {UtilsService} from '@shared/services/utils.service';
import {ListViewMode} from '@shared/models/interfaces/view-mode.interface';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {FmDriverDetailsCompactComponent} from '@management/fleet-management/fm-driver/fm-driver-details-compact/fm-driver-details-compact.component';
import {SideBarService} from '@shared/services/side-bar.service';
import {SmTruckScheduleCompactComponent} from '@management/schedule-management/sm-truck-schedule-compact/sm-truck-schedule-compact.component';
import {DeliveryDataService} from '@shared/services/data/delivery-data.service';
import {Payload} from '@app/shared/models/payload';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {DataUtilService} from '@app/shared/services/data-util.service';
import {SmAssignOrderDialogComponent} from '@management/schedule-management/sm-assign-order-dialog/sm-assign-order-dialog.component';
import {MappingLabelPipe} from '@shared/pipe/mapping-label.pipe';
import {StorageService} from '@app/shared/services/storage.service';
import {TripErrorModel} from '@shared/services/data/trip-data.service';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';

@Component({
  selector: 'app-planner-truck-schedule',
  templateUrl: './planner-truck-schedule.component.html',
  styleUrls: ['./planner-truck-schedule.component.scss']
})
export class PlannerTruckScheduleComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}
