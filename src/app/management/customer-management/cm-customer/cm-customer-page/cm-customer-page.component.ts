import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatTableDataSource, MatSnackBar, MatPaginator, MatSort} from '@angular/material';
import {DialogService} from '@shared/services/others/dialog.service';
import {CustomerDataService} from '@shared/services/data/customer-data.service';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';
import {CmCustomerNewComponent} from '../cm-customer-new/cm-customer-new.component';
import {IQuestionDialogModel} from '@app/shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {CmCustomerDetailsDialogComponent} from '@management/customer-management/cm-customer/cm-customer-details-dialog/cm-customer-details-dialog.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';

@Component({
    selector: 'app-cm-customer-page',
    templateUrl: './cm-customer-page.component.html',
    styleUrls: ['./cm-customer-page.component.scss']
})
export class CmCustomerPageComponent extends DefaultComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    customers: CustomerModel[] = [];
    displayedColumns = ['index', 'customerName', 'emailAddress', 'terminalId', 'contactNumber', 'soldTo', 'actions'];
    searchControl: FormControl = new FormControl('');
    selectedCustomer: CustomerModel;
    tableData: MatTableDataSource<CustomerModel>;

    constructor(
        private _CustomerDataService: CustomerDataService,
        private _DialogService: DialogService,
        private _MatSnackBar: MatSnackBar,
    ) {
        super();
    }

    ngOnInit() {
        this.addSubscribes(
            this._CustomerDataService.customerAllObservable
                .subscribe((rs) => {
                    this.customers = rs;
                    this.customers = this.customers.map((u, index) => {
                        u.index = (index + 1).toString();
                        return u;
                    });
                    this.tableData = new MatTableDataSource(this.customers);
                    this.tableData.paginator = this.paginator;
                    this.tableData.sort = this.sort;
                    this.sort.disableClear = true;
                }),
            this.searchControl.valueChanges.pipe(debounceTime(400))
                .subscribe(filterValue => {
                    filterValue = filterValue.trim().toLowerCase();
                    this.tableData.filter = `${filterValue}`;
                    this.tableData.sort = this.sort;
                    this.sort.disableClear = true;
                })
        );

        this._CustomerDataService.findAll();
    }

    onRefresh() {
        this.customers = [];
        this.customers = this.customers.map((u, index) => {
            u.index = (index + 1).toString();
            return u;
        });
        this.tableData = new MatTableDataSource(this.customers);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
        this.paginator.firstPage();
        this._CustomerDataService.findAll();
    }

    onNew() {
        this.selectedCustomer = null;
        const newCustomerDialogRef = this._DialogService.open(CmCustomerNewComponent,
            {
                customerDetail: this.selectedCustomer,
            },
            {
                width: '600px',
            });

        this.addSubscribes(
            newCustomerDialogRef.afterClosed()
                .subscribe(rs => {
                    if (rs) {
                        this.onRefresh();
                    }
                })
        );
    }

    onEditCustomer(item) {
        this.selectedCustomer = item;
        const newCustomerDialogRef = this._DialogService.open(CmCustomerNewComponent,
            {
                customerDetail: this.selectedCustomer,
            },
            {
                width: '600px',
            });
        this.addSubscribes(
            newCustomerDialogRef.afterClosed()
                .subscribe(rs => {
                    if (rs) {
                        this.onRefresh();
                    }
                }));
    }

    onDetails(item) {
        this._DialogService.open(CmCustomerDetailsDialogComponent,
            {
                id: item.getId()
            });
    }

    onDeleteCustomer(item) {
        // TODO, nam, disabled 09/08
        /*const dialogData: IQuestionDialogModel = {
            title: 'Delete customer',
            question: `Do you want to delete this customer?`,
            onYes: () => {
                // const updateObj = new TQLFormData();
                // updateObj.setValue('sysId', item.getValue('sysId'));
                // this._customerDataService.delete(updateObj).then(rs => {
                //     let message = '';
                //     if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
                //         message = `Customer Deleted Successfully.`;
                //         this.onRefresh();
                //         questionDialogRef.close();
                //     } else {
                //         message = `There are problems in deleting this customer.`;
                //     }
                //     this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                // }).catch(error => {
                //     this._snackBar.open(error, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                // });

                // TODO: remove customer will affect Tank and Station
                this.onRefresh();
            }
        };
        this._DialogService.open(MessageQuestionDialogComponent, dialogData);*/
    }

    getPageStartIndex(): number {
        return this.paginator.pageIndex * this.paginator.pageSize;
    }

}
