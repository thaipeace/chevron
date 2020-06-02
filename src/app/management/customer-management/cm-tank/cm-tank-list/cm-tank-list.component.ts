import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { TankDataService } from '@shared/services/data/tank-data.service';
import {
  MatDialog,
  MatTableDataSource,
  MatSnackBar,
  MatPaginator,
  MatSort
} from '@angular/material';
import { DialogService } from '@shared/services/others/dialog.service';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';
import { CmTankNewComponent } from '../../cm-tank/cm-tank-new/cm-tank-new.component';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@app/shared/constants/value.constant';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { CmTankDetailsDialogComponent } from '@management/customer-management/cm-tank/cm-tank-details-dialog/cm-tank-details-dialog.component';
import { DefaultComponent } from '@shared/models/default/default-component.model';

@Component({
  selector: 'app-cm-tank-list',
  templateUrl: './cm-tank-list.component.html',
  styleUrls: ['./cm-tank-list.component.scss']
})
export class CmTankListComponent extends DefaultComponent
  implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() stationId: string = null;
  @Input() readonly: boolean = true;

  @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();

  tanks: TankModel[] = [];
  tableData: MatTableDataSource<TankModel>;
  displayedColumns = [
    '#',
    'dischargePointName',
    'dischargepointIndex',
    'tankNumber',
    'archived',
    'currentVolume',
    'deadStock',
    'productCode',
    'lastUpdated',
    'isPtoReq',
    'actions'
  ];
  selectedTank: TankModel;
  searchControl: FormControl = new FormControl('');

  constructor(
    private _AuthenticationService: AuthenticationService,
    private _tankDataService: TankDataService,
    private _dialogService: DialogService,
    private _snackBar: MatSnackBar
  ) {
    super();
    switch (this._AuthenticationService.getRole()) {
      case DEFAULT_ROLES.ADMIN:
        this.readonly = false;
        break;
      default:
        this.readonly = true;
    }
  }

  ngOnInit() {
    if (this.stationId) {
      this.addSubscribes(
        this._tankDataService.tankAllByStationObservable.subscribe(rs => {
          this.tanks = rs;
          this.tableData = new MatTableDataSource(this.tanks);
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
        })
      );
      this._tankDataService.findAllByStationId(this.stationId);
    } else {
      this.addSubscribes(
        this._tankDataService.tankAllObservable.subscribe(rs => {
          this.tanks = rs;
          this.tableData = new MatTableDataSource(this.tanks);
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
          this.sort.disableClear = true;
        })
      );
      this._tankDataService.findAll();
    }

    this.addSubscribes(
      this.searchControl.valueChanges
        .pipe(debounceTime(400))
        .subscribe(filterValue => {
          filterValue = filterValue.trim().toLowerCase();
          this.tableData.filter = `${filterValue}`;
          this.tableData.sort = this.sort;
          this.sort.disableClear = true;
        })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { stationId } = changes;
    if (!!stationId && !stationId.isFirstChange()) {
      this._tankDataService.findAllByStationId(this.stationId);
    }
  }

  onRefresh() {
    this.tanks = [];
    this.tableData = new MatTableDataSource(this.tanks);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.sort.disableClear = true;
    this.paginator.firstPage();

    if (this.stationId) {
      this._tankDataService.findAllByStationId(this.stationId);
    } else {
      this._tankDataService.findAll();
    }

    this.refreshed.emit(true);
  }

  onDetails(item) {
    const detailTankDialogRef = this._dialogService.open(CmTankDetailsDialogComponent, {
      id: item.getId(),
      popup: true,
      isArchivedTank: item.archived
    });

    this.addSubscribes(
      detailTankDialogRef.afterClosed().subscribe(rs => {
        if (rs) {
          this.onRefresh();
        }
      })
    );
  }

  onNew() {
    this.selectedTank = null;
    const newTankDialogRef = this._dialogService.open(CmTankNewComponent, {
      tankDetail: this.selectedTank,
      stationId: this.stationId,
      disabledSelect: true
    });
    this.addSubscribes(
      newTankDialogRef.afterClosed().subscribe(rs => {
        if (rs) {
          this.onRefresh();
        }
      })
    );
  }

  onEditTank(item) {
    this.selectedTank = item;
    const newTankDialogRef = this._dialogService.open(CmTankNewComponent, {
      tankDetail: this.selectedTank
    });
    this.addSubscribes(
      newTankDialogRef.afterClosed().subscribe(rs => {
        if (rs) {
          this.onRefresh();
        }
      })
    );
  }

  onDeleteTank(item) {
    const dialogData: IQuestionDialogModel = {
      title: 'Delete tank',
      question: `Do you want to delete this tank?`,
      onYes: () => {
        const updateObj = new TQLFormData();
        updateObj.setValue('sysId', item.getId());
        this._tankDataService
          .delete(updateObj, this._AuthenticationService.getUsername())
          .then(rs => {
            let message = '';
            if (
              rs &&
              rs.length > 1 &&
              rs[1]['DeleteAll']['Status'] === 'Success'
            ) {
              message = `Tank Deleted Successfully.`;
              this.onRefresh();
              questionDialogRef.close();
            } else {
              message = `There are problems in deleting this tank.`;
            }
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          })
          .catch(error => {
            this._snackBar.open(error, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          });
      }
    };
    const questionDialogRef = this._dialogService.open(
      MessageQuestionDialogComponent, {...dialogData}
    );
  }

  getPageStartIndex(): number {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }
}
