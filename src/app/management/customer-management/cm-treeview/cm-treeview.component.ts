import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {
    MatDialog,
    MatTableDataSource,
    MatSnackBar,
    MatPaginator,
    MatTreeNestedDataSource,
    MatTreeNode
} from '@angular/material';
import {CustomerDataService} from '@shared/services/data/customer-data.service';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';
import {IQuestionDialogModel} from '@app/shared/models/dialog/question.dialog.model';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {tap, debounceTime, filter, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ICustomerTreeNode} from '@app/shared/models/interfaces/tree-view.interface';
import {NestedTreeControl} from '@angular/cdk/tree';
import {StationDataService} from '@shared/services/data/station-data.service';
import {TankDataService} from '@shared/services/data/tank-data.service';
import {StationModel} from '@app/shared/models/data.models/station/station.model';
import {TankModel} from '@app/shared/models/data.models/tank/tank.model';
import {AuthenticationService} from '@app/user-management/shared/services';
import {CmCustomerNewComponent} from '@management/customer-management/cm-customer/cm-customer-new/cm-customer-new.component';
import {CmStationNewComponent} from '@management/customer-management/cm-station/cm-station-new/cm-station-new.component';
import {CmTankNewComponent} from '@management/customer-management/cm-tank/cm-tank-new/cm-tank-new.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {CustomerTreeviewLoadingService} from '@app/shared/services/customer-treeview-loading.service';

@Component({
    selector: 'app-cm-treeview',
    templateUrl: './cm-treeview.component.html',
    styleUrls: ['./cm-treeview.component.scss']
})
export class CmTreeviewComponent extends DefaultComponent implements OnInit {
    customers: CustomerModel[] = [];
    stations: StationModel[] = [];
    tanks: TankModel[] = [];
    searchControl: FormControl = new FormControl('');

    treeControl = new NestedTreeControl<ICustomerTreeNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<ICustomerTreeNode>();
    refresh = false;

    selectedNode: ICustomerTreeNode;
    expandingNode: ICustomerTreeNode = null;
    promise;

    constructor(
        private _CustomerDataService: CustomerDataService,
        private _stationDataService: StationDataService,
        private _tankDataService: TankDataService,
        private _snackBar: MatSnackBar,
        private _authenService: AuthenticationService,
        public _dialog: MatDialog,
        private _customerTreeviewLoading: CustomerTreeviewLoadingService
    ) {
        super();
    }

    ngOnInit() {
        this.initTreeView();

        this.onRefresh();

        this.addSubscribes(
            this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(filterValue => {
                filterValue = filterValue.trim().toLowerCase();
                this.processCustomerData(
                    this.customers.filter((customer: CustomerModel) => customer.customerName.toLowerCase().includes(filterValue))
                );
                this.refreshTreeView();
            })
        );

        // this._customerTreeviewLoading.loading.subscribe(_ => {
        //   this._customerDataService.findAll();
        // })
    }

    initTreeView() {
        this.addSubscribes(
            this._CustomerDataService.customerAllObservable.pipe().subscribe(rs => {
                if (!!rs) {
                    const customers: CustomerModel[] = rs;
                    this.customers = customers;
                    this.processCustomerData(this.customers);
                    this.refreshTreeView();
                } else {
                    this.dataSource.data = [];
                    this.refreshTreeView();
                }
            }),

            this._stationDataService.stationAllByCustomerObservable.pipe().subscribe((stations: StationModel[]) => {
                if (!!stations && stations.length > 0 && !!this.expandingNode) {
                    this.expandingNode.children = stations.map((station: StationModel) => {
                        const stationNode: ICustomerTreeNode = {
                            nodeId: station.getId(),
                            name: station.stationName,
                            nodeData: station,
                            levelName: 'Station',
                            icon: 'fal fa-gas-pump',
                            isChildrenLoaded: false,
                            children: [],
                            customerName: this.expandingNode.customerName,
                            stationName: station.stationName,
                            parent: this.expandingNode
                        };

                        return stationNode;
                    });
                    this.treeControl.expand(this.expandingNode);
                }
                this.refreshTreeView();
            }),

            this._tankDataService.tankAllByStationObservable.pipe().subscribe((tanks: TankModel[]) => {
                if (!!tanks && tanks.length > 0 && !!this.expandingNode) {
                    this.expandingNode.children = tanks.map((tank: TankModel) => {
                        const tankNode: ICustomerTreeNode = {
                            nodeId: tank.getId(),
                            name: !!tank.tankNumber ? tank.tankNumber : '',
                            nodeData: tank,
                            levelName: 'Tank',
                            icon: '',
                            isChildrenLoaded: true,
                            children: [],
                            customerName: this.expandingNode.customerName,
                            stationName: this.expandingNode.stationName,
                            tankNumber: !!tank.tankNumber ? tank.tankNumber : '',
                            parent: this.expandingNode
                        };

                        return tankNode;
                    });
                    this.treeControl.expand(this.expandingNode);
                }
                this.refreshTreeView();
            })
        );
    }

    private refreshTreeView() {
        const _data = this.dataSource.data;
        this.dataSource.data = null;
        this.dataSource.data = _data;
        this.expandingNode = null;
    }

    onRefresh() {
        this.searchControl.setValue('');
        this.promise = this._CustomerDataService.findAll();
    }

    onNewListItem(node: ICustomerTreeNode) {
        switch (node.levelName) {
            case 'Customer':
                this.onNewStation();
                break;
            case 'Station':
                this.onNewTank();
                break;
        }
    }

    onAddNew(key: string): void {
        switch (key) {
            case 'Customer':
                this.onNewCustomer();
                break;
            case 'Station':
                this.onNewStation();
                break;
            case 'Tank':
                this.onNewTank();
                break;
        }
    }

    onNewCustomer() {
        const newCustomerDialogRef = this._dialog.open(CmCustomerNewComponent, {
            data: {
                customerDetail: null
            }
        });
        this.addSubscribes(
            newCustomerDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onNewStation() {
        const newStationDialogRef = this._dialog.open(CmStationNewComponent, {
            data: {
                stationDetail: null
            }
        });
        this.addSubscribes(
            newStationDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onNewTank() {
        const newTankDialogRef = this._dialog.open(CmTankNewComponent, {
            data: {
                tankDetail: null
            }
        });
        this.addSubscribes(
            newTankDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onEdit(node: ICustomerTreeNode): void {
        switch (node.levelName) {
            case 'Customer':
                this.onEditCustomer(node.nodeData as CustomerModel);
                break;
            case 'Station':
                this.onEditStation(node.nodeData as StationModel);
                break;
            case 'Tank':
                this.onEditTank(node.nodeData as TankModel);
                break;
        }
    }

    onEditCustomer(customerDetail: CustomerModel) {
        const newCustomerDialogRef = this._dialog.open(CmCustomerNewComponent, {
            data: {
                customerDetail: customerDetail
            }
        });
        this.addSubscribes(
            newCustomerDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onEditStation(stationDetail: StationModel) {
        const newStationDialogRef = this._dialog.open(CmStationNewComponent, {
            data: {
                stationDetail: stationDetail
            }
        });
        this.addSubscribes(
            newStationDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onEditTank(tankDetail: TankModel) {
        const newTankDialogRef = this._dialog.open(CmTankNewComponent, {
            data: {
                tankDetail: tankDetail
            }
        });
        this.addSubscribes(
            newTankDialogRef.afterClosed().subscribe(rs => {
                if (rs) {
                    this.onRefresh();
                }
            })
        );
    }

    onDelete(node: ICustomerTreeNode): void {
        switch (node.levelName) {
            case 'Customer':
                this.onDeleteCustomer(node.nodeData as CustomerModel);
                break;
            case 'Station':
                this.onDeleteStation(node.nodeData as StationModel);
                break;
            case 'Tank':
                this.onDeleteTank(node.nodeData as TankModel);
                break;
        }
    }

    onDeleteCustomer(customerDetail: CustomerModel) {
        const dialogData: IQuestionDialogModel = {
            title: 'Delete customer',
            question: `Do you want to delete this customer?`,
            onYes: () => {
                const updateObj = new TQLFormData();
                updateObj.setValue('sysId', customerDetail.getValue('sysId'));
                this._CustomerDataService
                    .delete(updateObj, this._authenService.getUsername())
                    .then(rs => {
                        let message = '';
                        if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
                            message = `Customer Deleted Successfully.`;
                            this.onRefresh();
                            questionDialogRef.close();
                        } else {
                            message = `There are problems in deleting this customer.`;
                        }
                        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    })
                    .catch(error => {
                        this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    });

                // TODO: remove customer will affect Tank and Station
                this.onRefresh();
            }
        };
        const questionDialogRef = this._dialog.open(MessageQuestionDialogComponent, {
            data: dialogData
        });
    }

    onDeleteStation(item) {
        const dialogData: IQuestionDialogModel = {
            title: 'Delete station',
            question: `Do you want to delete this station?`,
            onYes: () => {
                const updateObj = new TQLFormData();
                updateObj.setValue('stationName', item.getValue('stationName'));
                this._stationDataService
                    .delete(updateObj, this._authenService.getUsername())
                    .then(rs => {
                        let message = '';
                        if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
                            message = `Station Deleted Successfully.`;
                            this.onRefresh();
                            questionDialogRef.close();
                        } else {
                            message = `There are problems in deleting this station.`;
                        }
                        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    })
                    .catch(error => {
                        this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    });
            }
        };
        const questionDialogRef = this._dialog.open(MessageQuestionDialogComponent, {
            data: dialogData
        });
    }

    onDeleteTank(item) {
        const dialogData: IQuestionDialogModel = {
            title: 'Delete tank',
            question: `Do you want to delete this tank?`,
            onYes: () => {
                const updateObj = new TQLFormData();
                updateObj.setValue('tankNumber', item.getValue('tankNumber'));
                this._tankDataService
                    .delete(updateObj, this._authenService.getUsername())
                    .then(rs => {
                        let message = '';
                        if (rs && rs.length > 1 && rs[1]['DeleteAll']['Status'] === 'Success') {
                            message = `Tank Deleted Successfully.`;
                            this.onRefresh();
                            questionDialogRef.close();
                        } else {
                            message = `There are problems in deleting this tank.`;
                        }
                        this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    })
                    .catch(error => {
                        this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    });
            }
        };
        const questionDialogRef = this._dialog.open(MessageQuestionDialogComponent, {
            data: dialogData
        });
    }

    onDetailRefreshed() {
        const node = this.selectedNode;

        if (!node) {
            return;
        }

        // node.isChildrenLoaded = true;
        this.expandingNode = node;
        switch (node.levelName) {
            case 'Customer':
                this._stationDataService.findAllByCustomerId(node.nodeId);
                break;
            case 'Station':
                this._tankDataService.findAllByStationId(node.nodeId);
                break;
        }
    }

    hasChild = (_: number, node: ICustomerTreeNode) =>
        !node.isChildrenLoaded || (!!node.children && node.children.length > 0);

    toggleNode(node) {
        if (node.isChildrenLoaded === false) {
            this.expandingNode = node;
            node.isChildrenLoaded = true;
            switch (node.levelName) {
                case 'Customer':
                    this.promise = this._stationDataService.findAllByCustomerId(node.nodeId);
                    break;
                case 'Station':
                    this.promise = this._tankDataService.findAllByStationId(node.nodeId);
                    break;
            }
        } else {
            this.treeControl.toggle(node);
        }
    }

    onSelectedNodeChanged(node) {
        this.selectedNode = node;
        if (node.isChildrenLoaded === false) {
            this.expandingNode = node;
            node.isChildrenLoaded = true;
        }
    }

    canRemove = (node: ICustomerTreeNode) => false;

    private processCustomerData(customers: CustomerModel[]): void {
        const treeDataSource: ICustomerTreeNode[] = customers.map((customer: CustomerModel) => {
            const customerNode: ICustomerTreeNode = {
                nodeId: customer.getId(),
                name: customer.customerName,
                nodeData: customer,
                levelName: 'Customer',
                icon: 'fal fa-user-tie',
                isChildrenLoaded: false,
                children: [],
                customerName: customer.customerName
            };

            return customerNode;
        });
        this.dataSource.data = treeDataSource;
        this.selectedNode = treeDataSource[0];
    }

    onRefreshDetails($event: any) {
        this.promise = $event;
    }
}
