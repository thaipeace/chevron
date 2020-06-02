import {
    Component,
    OnInit,
    Input,
    ViewChild,
    OnChanges,
    SimpleChanges, Output, EventEmitter
} from '@angular/core';
import {
    MatPaginator,
    MatTableDataSource,
    MatSnackBar,
    MatDialog,
    MatSort
} from '@angular/material';
import {DriverModel} from '@shared/models/data.models/fleet/driver.model';
import {FormControl} from '@angular/forms';
import {DriverDataService} from '@shared/services/data/driver-data.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {debounceTime} from 'rxjs/operators';
import {FmDriverEditableDialogComponent} from '../fm-driver-editable-dialog/fm-driver-editable-dialog.component';
import {
    X_BUTTON,
    NOTIFICATION_DEFAULT_DURARION
} from '@shared/constants/value.constant';
import {FmDriverDeleteDialogComponent} from '../fm-driver-delete-dialog/fm-driver-delete-dialog.component';
import {FmDriverDetailsDialogComponent} from '../fm-driver-details-dialog/fm-driver-details-dialog.component';
import {AuthenticationService} from '@app/user-management/shared/services/authentication.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {FmTreeviewLoadingService} from '@app/shared/services/fm-treeview-loading.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {FmDriverDetailsCompactComponent} from '@management/fleet-management/fm-driver/fm-driver-details-compact/fm-driver-details-compact.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {UtilsService} from '@shared/services/utils.service';
import {ToastService} from '@shared/services/others/toast.service';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {Payload} from '@app/shared/models/payload';
import {DataUtilService} from '@app/shared/services/data-util.service';

@Component({
    selector: 'app-fm-driver-list',
    templateUrl: './fm-driver-list.component.html',
    styleUrls: ['./fm-driver-list.component.scss']
})
export class FmDriverListComponent extends DefaultComponent implements OnInit, OnChanges {
    @Input() truckCompanyIds: string[];
    @Input() defaultCompanyId: string;
    @Input() readonly: boolean = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    drivers: DriverModel[] = [];
    tableData: MatTableDataSource<DriverModel>;
    displayedColumns = [
        'index',
        'companyId',
        'chevronDriverId',
        'fullName',
        'terminalPassExpiryDate',
        'actions'
    ];

    getAll$: Subscription;
    getAllByCompanyId$: Subscription;

    statusList: any[];
    status: any = {};

    searchControl: FormControl = new FormControl('');
    selectedRow;
    errors: string[];
    fileDrivers: any = {};
    today: Date = new Date();

    constructor(
        private _DriverDataService: DriverDataService,
        private _authenService: AuthenticationService,
        private _DialogService: DialogService,
        private _fmTreeviewLoading: FmTreeviewLoadingService,
        private _snackBar: MatSnackBar,
        private _SideBarService: SideBarService,
        private _ToastService: ToastService,
        public dialog: MatDialog,
        private apiDataService: ApiDataService,
        private dataUtilService: DataUtilService
    ) {
        super();
        this.addSubscribes(
            this._SideBarService.statusObservable
                .subscribe((rs) => {
                    if (rs.status === SideBarService.STATUSES.CLOSE) {
                        this.selectedRow = null;
                    }
                })
        );

    }

    ngOnInit() {
        this.addSubscribes(
            this.searchControl.valueChanges
                .pipe(debounceTime(400))
                .subscribe(filterValue => {
                    filterValue = filterValue.trim().toLowerCase();
                    this.tableData.filter = `${filterValue}`;
                    this.tableData.sort = this.sort;
                }));
        this._DriverDataService.findAllStatus()
            .then(res => {
                let tmpStatus = _.orderBy(res, [el => el.Key.toLowerCase()], ['asc']);
                this.status = tmpStatus.reduce((obj, item) => {
                    obj[item.Key] = item.Value;
                    return obj;
                }, {});
                this.statusList = Object.keys(this.status);
            });
        this.addSubscribes(
            this._fmTreeviewLoading.loading
                .subscribe(_ => this.onRefresh()));

        this.today.getTime();
    }

    ngOnChanges(changes: SimpleChanges) {
        const {defaultCompanyId} = changes;

        if (!!defaultCompanyId) {
            this.clearSubscription();
            if (!this.defaultCompanyId) {
                this.getAll$ = this._DriverDataService.driverAllObservable
                    .subscribe(
                        rs => {
                            this.drivers = rs;
                            this.drivers = this.drivers.map((u, index) => {
                                u.index = (index + 1).toString();
                                return u;
                            });
                            this.tableData = new MatTableDataSource(this.drivers);
                            this.tableData.paginator = this.paginator;
                            this.tableData.sort = this.sort;
                            this.sort.disableClear = true;
                        }
                    );
                this.addSubscribes(this.getAll$);
            } else {
                this.getAllByCompanyId$ = this._DriverDataService.driverAllByCompanyObservable
                    .subscribe(
                        rs => {
                            this.drivers = rs;
                            this.drivers = this.drivers.map((u, index) => {
                                u.index = (index + 1).toString();
                                return u;
                            });
                            this.tableData = new MatTableDataSource(this.drivers);
                            this.tableData.paginator = this.paginator;
                            this.tableData.sort = this.sort;
                            this.sort.disableClear = true;
                        }
                    );
                this.addSubscribes(this.getAllByCompanyId$);
                this.addPromises(this._DriverDataService.findAllByCompanyIds([this.defaultCompanyId]));
            }
        }
    }

    onRefresh() {
        this.drivers = [];
        this.tableData = new MatTableDataSource(this.drivers);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
        this.paginator.firstPage();
        if (!this.defaultCompanyId) {
            this.addPromises(this._DriverDataService.findAll());
        } else {
            this.addPromises(this._DriverDataService.findAllByCompanyIds([this.defaultCompanyId]));
        }
    }

    onNew() {
        const dialogRef = this.dialog.open(FmDriverEditableDialogComponent, {
            data: {
                driverDetail: null,
                defaultCompanyId: this.defaultCompanyId,
                truckCompanyIds: this.truckCompanyIds,
                disabledSelect: true
            }
        });

        dialogRef.afterClosed()
            .subscribe(modalResult => {
                if (!!modalResult) {
                    this.onRefresh();
                }
            });
    }

    onEdit(item: DriverModel) {
        const dialogRef = this.dialog.open(FmDriverEditableDialogComponent, {
            data: {
                driverDetail: item,
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

    onRemove(item: DriverModel) {
        const dialogRef = this.dialog.open(FmDriverDeleteDialogComponent, {
            width: '500px',
            data: item
        });

        dialogRef.afterClosed().subscribe(modalResult => {
            if (!!modalResult) {
                this._DriverDataService
                    .delete(item.getId(), this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(
                            `${modalResult.fullName} is deleted`,
                            X_BUTTON,
                            {duration: NOTIFICATION_DEFAULT_DURARION}
                        );
                    });
            }
        });
    }

    onDetails(item) {
        this._DialogService.open(FmDriverDetailsDialogComponent, {
            width: '80vw',
            id: item.getId(),
            driverId: item.chevronDriverId
        }, {}, () => {
            this._SideBarService.refresh();
        });

        this._DialogService.resultChanged.subscribe(res => {
            if (res.dialogName === 'FmDriverDetailsDialogComponent') {
                this.onRefresh();
            }
        })
    }

    getPageStartIndex(): number {
        return this.paginator.pageIndex * this.paginator.pageSize;
    }

    private clearSubscription() {
        if (!!this.getAll$) {
            this.getAll$.unsubscribe();
        }

        if (!!this.getAllByCompanyId$) {
            this.getAllByCompanyId$.unsubscribe();
        }
    }

    openCompact(row: any) {
        this.selectedRow = row;
        this._SideBarService.open(new DynamicItem(FmDriverDetailsCompactComponent, {id: row.getId()}));
    }

    downloadTemplate() {
        this._DriverDataService.downloadDriverDataTemplate()
            .then((rs) => {
                if (rs['data']['APIResponse']['Status'] && rs['data']['APIResponse']['Status'] === 'Success') {
                    UtilsService.openNewWindow(rs['data']['APIResponse']['DownloadLink']);
                } else {
                    this._ToastService.openSimple('Some errors occur');
                }
            });
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

            this.fileDrivers = file;
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
        let driversListPayload = new Payload(PayloadsConstant.DRIVER_PROFILE.UPLOAD_FILE_DRIVERS, [file]);
        this.apiDataService.executeQuery(driversListPayload).subscribe(res => {
            let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
            this._snackBar.open(raw.APIResponse.Message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }, error => {
            console.log('Loading error');
        });
    }

}
