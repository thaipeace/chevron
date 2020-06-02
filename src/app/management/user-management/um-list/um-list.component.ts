import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { UserManagementModel } from '@shared/models/data.models/user-management.model';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RoleModel } from '@app/user-management/shared/models/data.models/role.model';
import { CustomerService } from '@shared/services/customer.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogService } from '@shared/services/others/dialog.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { RolePlannerDetailsDialogComponent } from '@management/user-management/um-details/role-planner-details-dialog/role-planner-details-dialog.component';
import { RoleTruckCompanyDetailsDialogComponent } from '@management/user-management/um-details/role-truck-company-details-dialog/role-truck-company-details-dialog.component';
import { RoleCustomerDetailsDialogComponent } from '@management/user-management/um-details/role-customer-details-dialog/role-customer-details-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-um-list',
    templateUrl: './um-list.component.html',
    styleUrls: ['./um-list.component.scss']
})
export class UmListComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    @Input() users: UserManagementModel[];
    @Input() roles: RoleModel[];
    @Output() newUserClicked = new EventEmitter<any>();
    @Output() refreshClicked = new EventEmitter<any>();
    @Output() editUserClicked = new EventEmitter<UserManagementModel>();
    @Output() resetPaswordClicked = new EventEmitter<UserManagementModel>();
    @Output() deleteUserClicked = new EventEmitter<UserManagementModel>();
    @Output() lockUserClicked = new EventEmitter<UserManagementModel>();
    @Output() unlockUserClicked = new EventEmitter<UserManagementModel>();

    displayedColumns = ['id', 'userName', 'roleId', 'emailId', 'lastLoggedIn', 'createDate', 'action'];
    tableData: MatTableDataSource<UserManagementModel>;
    inputSearch: string;
    selectedRoles: string[] = [];
    selectedRowIndex = -1;
    userSeclected: BehaviorSubject<UserManagementModel>;
    searchControl: FormControl = new FormControl('');

    userName: string;

    // private _searchTermChange$ = new Subject<string>();

    constructor(
        private _customerService: CustomerService,
        private _snackBar: MatSnackBar,
        private _DialogService: DialogService,
        private _dialog: MatDialog,
        private _AuthenticationService: AuthenticationService
    ) {
        // this._searchTermChange$.pipe(
        //     debounceTime(400)
        // ).subscribe(searchTerm => {
        //     this.inputSearch = searchTerm;
        //     this.applyFilter(searchTerm, this.selectedRoles);
        // });
        combineLatest(
            this._AuthenticationService.loginedUserObservable,
        ).subscribe(([user]) => {
            if (user) {
                this.userName = user.username;
            }
        });
    }

    ngOnInit() {
        this.searchControl.valueChanges.pipe(
            debounceTime(200),
        ).subscribe(searchTerm => {
            this.inputSearch = searchTerm;
            this.applyFilter(searchTerm, this.selectedRoles);
        });
    }

    highlightRow(row) {
        this.selectedRowIndex = row.id;
    }

    clearHighLightRow() {
        this.selectedRowIndex = -1;
    }

    ngOnChanges(changes: SimpleChanges) {
        const { users, roles } = changes;
        if (users && users.currentValue) {
            if (this.users) {
                this.users = this.users.map((u, index) => {
                    u.id = (index + 1).toString();
                    return u;
                });
                if (this.userSeclected) {
                    this.userSeclected.next(this.users.find(u => u.userName == this.userSeclected.value.userName));
                }
            }
            if (!this.tableData) {
                this.tableData = new MatTableDataSource(this.users);
                // filtering
                this.tableData.filterPredicate = (data: any, filter: string): boolean => {
                    const [searchTerm = '', searchRoles = ''] = filter.split('$$');
                    const selectedRoles = searchRoles.split('|');

                    if (selectedRoles.indexOf(data['roleId']) > -1) {
                        for (let index = 0; index < this.displayedColumns.length; index++) {
                            const key = this.displayedColumns[index];
                            const value = data[key];
                            if (value && value.toLowerCase().indexOf(searchTerm) !== -1) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                this.tableData.paginator = this.paginator;
                this.tableData.sort = this.sort;
                this.sort.disableClear = true;
            } else {
                this.tableData.data = this.users;
                this.tableData.sort = this.sort;
                this.sort.disableClear = true;
                if (this.table) {
                    this.table.renderRows(); // new data update, trigger table change
                }
            }
            this.clearHighLightRow();
        }

        if (roles && roles.currentValue) {
            this.selectedRoles = this.roles.map(r => r.getValue('sysId'));
        }
    }

    applyFilter(filterValue: string = '', selectedRoles: string[] = []) {
        this.clearHighLightRow();
        filterValue = filterValue.trim().toLowerCase();
        this.tableData.filter = `${filterValue}$$${selectedRoles.join('|')}`;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
    }

    onRoleSelectionChange(roleIds) {
        this.selectedRoles = roleIds;
        this.applyFilter(this.inputSearch, roleIds);
    }

    // onInputSearchChange(searchTerm: string) {
    //     this._searchTermChange$.next(searchTerm);
    // }

    onNewUser() {
        this.newUserClicked.emit();
        this.clearHighLightRow();
    }

    onCloseNewUser() {
    }

    onRefresh() {
        this.paginator.firstPage();
        this.refreshClicked.emit();
    }

    onEditUser(user) {
        this.editUserClicked.emit(user);
    }

    onResetPasswordUser(user) {
        this.resetPaswordClicked.emit(user);
    }

    onDeleteUser(user) {
        this.deleteUserClicked.emit(user);
    }

    onLockUser(user) {
        this.lockUserClicked.emit(user);
    }

    onUnlockUser(user) {
        this.unlockUserClicked.emit(user);
    }

    onDetails(user: UserManagementModel) {
        switch (user.roleId) {
            case DEFAULT_ROLES.CUSTOMER:
                this.userSeclected = new BehaviorSubject(user);
                this._DialogService.open(RoleCustomerDetailsDialogComponent, {
                    user: this.userSeclected,
                    lockUser: (u: UserManagementModel) => {
                        this.onLockUser(u);
                    },
                    unLockUser: (u: UserManagementModel) => {
                        this.onUnlockUser(u);
                    },
                    resetPasswordUser: (u) => {
                        this.onResetPasswordUser(u);
                    }
                });
                break;
            case DEFAULT_ROLES.ADMIN:
                this.userSeclected = new BehaviorSubject(user);
                const dialog = this._DialogService.open(RolePlannerDetailsDialogComponent, {
                    user: this.userSeclected,
                    lockUser: (u: UserManagementModel) => {
                        this.onLockUser(u);
                    },
                    unLockUser: (u: UserManagementModel) => {
                        this.onUnlockUser(u);
                    },
                    resetPasswordUser: (u) => {
                        this.onResetPasswordUser(u);
                    },
                }/*, { disableClose: true }*/);
                // dialog.beforeClose().pipe(fn => confirm('abc') ? fn : null).subscribe(_ => { });
                break;
            case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
            case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
                this.userSeclected = new BehaviorSubject(user);
                this._DialogService.open(RoleTruckCompanyDetailsDialogComponent, {
                    user: this.userSeclected,
                    lockUser: (u: UserManagementModel) => {
                        this.onLockUser(u);
                    },
                    unLockUser: (u: UserManagementModel) => {
                        this.onUnlockUser(u);
                    },
                    resetPasswordUser: (u) => {
                        this.onResetPasswordUser(u);
                    }
                });
                break;
            default:
                this.userSeclected = new BehaviorSubject(user);
                this._DialogService.open(RolePlannerDetailsDialogComponent, {
                    user: this.userSeclected,
                    lockUser: (u: UserManagementModel) => {
                        this.onLockUser(u);
                    },
                    unLockUser: (u: UserManagementModel) => {
                        this.onUnlockUser(u);
                    },
                    resetPasswordUser: (u) => {
                        this.onResetPasswordUser(u);
                    }
                });
        }

    }
}
