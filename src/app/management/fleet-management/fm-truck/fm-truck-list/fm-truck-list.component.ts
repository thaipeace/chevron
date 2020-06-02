import { FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges, Output, EventEmitter, OnDestroy
} from '@angular/core';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSnackBar,
  MatSort
} from '@angular/material';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { TruckDataService } from '@shared/services/data/truck-data.service';
import { DialogService } from '@shared/services/others/dialog.service';
import { FmTruckEditableDialogComponent } from '../fm-truck-editable-dialog/fm-truck-editable-dialog.component';
import { FmTruckDetailsDialogComponent } from '../fm-truck-details-dialog/fm-truck-details-dialog.component';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@shared/constants/value.constant';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '@app/user-management/shared/services';
import { Subscription } from 'rxjs';
import { FmTruckDeleteDialogComponent } from '../fm-truck-delete-dialog/fm-truck-delete-dialog.component';
import { FmTreeviewLoadingService } from '@app/shared/services/fm-treeview-loading.service';
import { UtilsService } from '@shared/services/utils.service';
import { ToastService } from '@shared/services/others/toast.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { DefaultComponent } from '@shared/models/default/default-component.model';

@Component({
  selector: 'app-fm-truck-list',
  templateUrl: './fm-truck-list.component.html',
  styleUrls: ['./fm-truck-list.component.scss']
})
export class FmTruckListComponent extends DefaultComponent implements OnInit, OnChanges {
  @Input() truckCompanyIds: string[];
  @Input() defaultCompanyId: string;
  @Input() readonly: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh = new EventEmitter();

  trucks: TruckModel[] = [];
  tableData: MatTableDataSource<TruckModel>;
  displayedColumns = [
    'index',
    'truckPlate',
    'totalCapacity',
    'isPtoSupported',
    'safeLoadingPassDate',
    'truckState',
    'dedicated',
    'actions'
  ];
  searchControl: FormControl = new FormControl('');

  getAll$: Subscription;
  getAllByCompanyId$: Subscription;

  errors: string[];
  fileTrucks: any = {};
  today: Date = new Date();

  constructor(
    private _TruckDataService: TruckDataService,
    private _authenService: AuthenticationService,
    private _fmTreeviewLoading: FmTreeviewLoadingService,
    private _DialogService: DialogService,
    private _snackBar: MatSnackBar,
    private _ToastService: ToastService,
    public dialog: MatDialog,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    super();
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(filterValue => {
        filterValue = filterValue.trim().toLowerCase();
        this.tableData.filter = `${filterValue}`;
        this.tableData.sort = this.sort;
      });

    this._fmTreeviewLoading.loading.subscribe(_ => this.onRefresh());


  }

  ngOnChanges(changes: SimpleChanges): void {
    const { defaultCompanyId } = changes;

    if (!!defaultCompanyId) {
      this.clearSubscription();
      if (!this.defaultCompanyId) {
        this.getAll$ = this._TruckDataService.truckAllObservable.subscribe(
          rs => {
            this.trucks = rs;
            this.trucks = this.trucks.map((u, index) => {
              u.index = (index + 1).toString();
              return u;
            });
            this.tableData = new MatTableDataSource(this.trucks);
            this.tableData.paginator = this.paginator;
            this.tableData.sort = this.sort;
            this.sort.disableClear = true;
          }
        );
      } else {
        this.getAllByCompanyId$ = this._TruckDataService.truckAllByCompanyObservable.subscribe(
          rs => {
            this.trucks = rs;
            this.trucks = this.trucks.map((u, index) => {
              u.index = (index + 1).toString();
              return u;
            });
            this.tableData = new MatTableDataSource(this.trucks);
            this.tableData.paginator = this.paginator;
            this.tableData.sort = this.sort;
            this.sort.disableClear = true;
          }
        );

        this.addPromises(this._TruckDataService.findAllByCompanyIds([this.defaultCompanyId]));
      }
    }
  }

  onRefresh() {
    this.trucks = [];
    this.tableData = new MatTableDataSource(this.trucks);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.sort.disableClear = true;
    this.paginator.firstPage();
    if (!this.defaultCompanyId) {
      this.addPromises(this._TruckDataService.findAll());
    } else {
      this.addPromises(this._TruckDataService.findAllByCompanyIds([this.defaultCompanyId]));
    }
  }

  onNew() {
    const dialogRef = this.dialog.open(FmTruckEditableDialogComponent, {
      data: {
        truckDetail: null,
        defaultCompanyId: this.defaultCompanyId,
        truckCompanyIds: this.truckCompanyIds,
        disabledSelect: true
      }
    });

    dialogRef.afterClosed().subscribe((modalResult: TruckModel) => {
      if (!!modalResult) {
        this.onRefresh();
      }
    });
  }

  onEdit(item: TruckModel) {
    const dialogRef = this.dialog.open(FmTruckEditableDialogComponent, {
      data: {
        truckDetail: item,
        defaultCompanyId: this.defaultCompanyId,
        truckCompanyIds: this.truckCompanyIds
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(modalResult => {
      if (!!modalResult) {
        this.onRefresh();
      }
    });
  }

  onRemove(item) {
    const dialogRef = this.dialog.open(FmTruckDeleteDialogComponent, {
      width: '500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(modalResult => {
      if (!!modalResult) {
        this._TruckDataService
          .delete(item.getId(), this._authenService.getUsername())
          .then(result => {
            this.onRefresh();
            this._snackBar.open(
              `${modalResult.truckPlate} is deleted`,
              X_BUTTON,
              { duration: NOTIFICATION_DEFAULT_DURARION }
            );
          });
      }
    });
  }

  onDetails(item) {
    this._DialogService.open(FmTruckDetailsDialogComponent, {
      id: item.getId()
    });

    this._DialogService.resultChanged.subscribe(res => {
      if (res.dialogName = 'FmTruckDetailsDialogComponent') {
        this.onRefresh();
      }
    });
  }

  getPageStartIndex(): number {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }

  getDrivers(drivers: any[]) {
    return drivers.join(', ');
  }

  private clearSubscription() {
    if (!!this.getAll$) {
      this.getAll$.unsubscribe();
    }

    if (!!this.getAllByCompanyId$) {
      this.getAllByCompanyId$.unsubscribe();
    }
  }

  downloadTemplate() {
    this._TruckDataService.downloadTruckDataTemplate()
      .then((rs) => {
        if (rs['data']['APIResponse']['Status'] && rs['data']['APIResponse']['Status'] === 'Success') {
          UtilsService.openNewWindow(rs['data']['APIResponse']['DownloadLink']);
        } else {
          this._ToastService.openSimple('Some errors occur');
        }
      });
  }

  onUploadClicked(event) {
    event.target.value = '';
  }

  onFileChange(fileInput: any) {
    let self = this;
    self.errors = [];
    let fileTypes = ['csv', 'xls', 'xlsx', 'xlsm'];

    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let extension = file.name.split('.').pop().toLowerCase(); //file extension from input file

      if (fileTypes.indexOf(extension) < 0) {
        self.errors.push('Only accept file types: ' + fileTypes.toString());
        return;
      }

      if (file.size >= 716800) {
        self.errors.push('Maximum file size is 700KB');
        return;
      }

      this.fileTrucks = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e: any) {
        self.uploadFile(
          e.target.result.split(',')[1]
        );
      };
    }
  }

  uploadFile(file: string) {
    let driversListPayload = new Payload(PayloadsConstant.DRIVER_PROFILE.UPLOAD_FILE_TRUCKS, [file]);
    this.apiDataService.executeQuery(driversListPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this._snackBar.open(raw.APIResponse.Message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }
}
