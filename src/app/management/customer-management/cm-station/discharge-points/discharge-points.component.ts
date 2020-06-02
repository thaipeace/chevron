import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { Payload } from '@app/shared/models/payload';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { EditDischargePointComponent } from './edit-discharge-point/edit-discharge-point.component';
import { TankDataService } from '@app/shared/services/data/tank-data.service';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';

@Component({
  selector: 'app-discharge-points',
  templateUrl: './discharge-points.component.html',
  styleUrls: ['./discharge-points.component.scss']
})
export class DischargePointsComponent extends DefaultComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tableData: MatTableDataSource<any>;
  @Input() stationId: string = null;
  @Input() readonly: boolean = true;
  @Input() tanks: any[] = [];
  @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayedColumns = ['#', 'dischargePointName', 'lat', 'lon', 'alt', 'tankAssociations', 'action'];
  searchControl: FormControl = new FormControl('');
  points: any[] = [];
  inputSearch: string;
  selectedRowIndex: number = -1;
  tankAssociations: any[] = [];

  constructor(
    private _AuthenticationService: AuthenticationService,
    private _dialogService: DialogService,
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _tankDataService: TankDataService
  ) {
    super();
    switch (this._AuthenticationService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
        this.readonly = false;
        break;
      default:
        this.readonly = true;
    }

    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    // this.setPoints();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setPoints();
  }

  setPoints() {
    let exePayload = new Payload(PayloadsConstant.dischargePoints.showDischargePoints, [this.stationId]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      this.points = [];
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      if (raw.APIResponse.Status === 'Success' && raw.APIResponse.DischargePoints) {
        this.points = this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.DischargePoints.DischargePoint);
        
        this.points.forEach(p => {
          if (!p.TankAssociations) return;
          p.TankAssociations.TankNumber = this.dataUtilService.wrapObjToOneElementArray(p.TankAssociations.TankNumber);
        });
        console.log(this.points);
      }

      this.tableData = new MatTableDataSource(this.points);
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
    }, error => {
      console.log('Loading error');
    });
  }

  onClickRow(row) {
    this.highlightRow(row);
  }

  highlightRow(row) {
    this.selectedRowIndex = row.id;
  }

  clearHighLightRow() {
    this.selectedRowIndex = -1;
  }

  applyFilter(filterValue: string = '') {
    this.clearHighLightRow();
    filterValue = filterValue.trim().toLowerCase();
    this.tableData.filter = filterValue;
  }

  onRefresh() {
    this.setPoints();
  }

  onEdit(isEdit, row?) {
    let inputData = {isEdit: isEdit, stationId: this.stationId};
    if (row) {
      inputData['selectedPoint'] = row;
    }
    const newDischargePointDialogRef = this._dialogService.open( EditDischargePointComponent, inputData );

    this.addSubscribes(
      newDischargePointDialogRef.afterClosed().subscribe(rs => {
        if (rs) {
          this.onRefresh();
        }
      })
    );
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this discharge point?`,
      onYes: async () => {
        questionDialogRef.close();
        await this.deleteAllTankAssociations(row);
        let exePayload = new Payload(PayloadsConstant.dischargePoints.deleteDischargePoint, [row.DischargePointId]);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message;
          if (raw.APIResponse.Status === 'Success') {
            message = raw.APIResponse.Message;
            this.onRefresh();
          } else {
            message = 'Delete failed';
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._dialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  deleteAllTankAssociations(row) {
    let exePayload = new Payload(PayloadsConstant.dischargePoints.deleteDischargePointTankRef,
      [row.DischargePointId]
    );
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

}
