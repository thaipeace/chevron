import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {StationDataService} from '@shared/services/data/station-data.service';
import {MatDialog, MatTableDataSource, MatSnackBar, MatPaginator} from '@angular/material';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {IQuestionDialogModel} from '@app/shared/models/dialog/question.dialog.model';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {CmStationNewComponent} from '../cm-station-new/cm-station-new.component';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {AuthenticationService} from '@app/user-management/shared/services';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';

@Component({
    selector: 'app-cm-station-page',
    templateUrl: './cm-station-page.component.html',
    styleUrls: ['./cm-station-page.component.scss']
})
export class CmStationPageComponent extends DefaultComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() customerId: string = null;
    @Input() username: string = null;

    @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();

    stations: StationModel[] = [];
    tableData: MatTableDataSource<StationModel>;
    displayedColumns = ['index', 'stationName', 'stationType', 'status', 'streetAddress', 'actions'];
    selectedStation: StationModel;
    load_fn;
    load_observable;
    searchControl: FormControl = new FormControl('');

    constructor(private _stationDataService: StationDataService,
                private _dialogService: DialogService,
                private _authenService: AuthenticationService,
                private _snackBar: MatSnackBar,
                public _dialog: MatDialog) {
        super();
    }

    ngOnInit() {
        this.reset();
        this.load_fn = () => {
            this._stationDataService.findAll();
        };
        this.load_observable = this._stationDataService.stationAllObservable;

        if (this.customerId) {
            this.load_fn = () => {
                this._stationDataService.findAllByCustomerId(this.customerId);
            };
            this.load_observable = this._stationDataService.stationAllByCustomerObservable;
        }

        if (this.username) {
            this.load_fn = () => {
                this._stationDataService.findAllByUsername(this.username);
            };
            this.load_observable = this._stationDataService.stationAllByUsernameObservable;
        }

        this.addSubscribes(
            this.load_observable
                .subscribe((rs) => {
                    this.stations = rs;
                    this.tableData = new MatTableDataSource(this.stations);
                    this.tableData.paginator = this.paginator;
                }),
            this.searchControl.valueChanges.pipe(
                debounceTime(400)
            ).subscribe(filterValue => {
                filterValue = filterValue.trim().toLowerCase();
                this.tableData.filter = `${filterValue}`;
            })
        );

        this.load_fn();

    }

    ngOnChanges(changes: SimpleChanges): void {
        const {customerId, username} = changes;
        if (!!customerId && !customerId.isFirstChange()) {
            this._stationDataService.findAllByCustomerId(this.customerId);
        } else if (!!username && !username.isFirstChange()) {
            this._stationDataService.findAllByUsername(this.username);
        }
    }

    reset() {
        this.stations = [];
        this.tableData = new MatTableDataSource(this.stations);
        this.tableData.paginator = this.paginator;
        this.paginator.firstPage();
    }

    onRefresh() {
        this.paginator.firstPage();
        this.reset();
        this.load_fn();
        this.refreshed.emit(true);
    }

    onDetails(item) {
        this._dialogService.open(CmStationDetailsDialogComponent,
            {
                id: item.getId(),
                readonly: false
            });
    }

    onNew() {
        this.selectedStation = null;
        const newStationDialogRef = this._dialog.open(CmStationNewComponent, {
            data: {
                stationDetail: this.selectedStation,
                customerId: this.customerId
            }
        });
        this.addSubscribes(
            newStationDialogRef.afterClosed()
                .subscribe(rs => {
                    if (rs) {
                        this.onRefresh();
                    }
                })
        );
    }

    onEditStation(item) {
        this.selectedStation = item;
        const newStationDialogRef = this._dialog.open(CmStationNewComponent, {
            data: {
                stationDetail: this.selectedStation,
            }
        });
        this.addSubscribes(
            newStationDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            }));
    }

    onDeleteStation(item) {
        const dialogData: IQuestionDialogModel = {
            title: 'Delete station',
            question: `Do you want to delete this station?`,
            onYes: () => {
                const updateObj = new TQLFormData();
                updateObj.setValue('stationName', item.getValue('stationName'));
                this._stationDataService.delete(updateObj, this._authenService.getUsername()).then(rs => {
                    let message = '';
                    if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
                        message = `Station Deleted Successfully.`;
                        this.onRefresh();
                        questionDialogRef.close();
                    } else {
                        message = `There are problems in deleting this station.`;
                    }
                    this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                }).catch(error => {
                    this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                });
            }
        };
        const questionDialogRef = this._dialog.open(MessageQuestionDialogComponent, {
            data: dialogData
        });
    }

    getPageStartIndex(): number {
        return this.paginator.pageIndex * this.paginator.pageSize;
    }
}

