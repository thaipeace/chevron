import {Component, OnInit, Input} from '@angular/core';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {
    MatTreeNestedDataSource,
    MatDialog,
    MatSnackBar
} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {IFleetCompanyTreeNode} from '@shared/models/interfaces/tree-view.interface';
import {DriverDataService} from '@shared/services/data/driver-data.service';
import {TruckCompanyDataService} from '@shared/services/data/truck-company-data.service';
import {TruckCompanyModel} from '@shared/models/data.models/fleet/truck-company.model';
import {tap, debounceTime} from 'rxjs/operators';
import {DriverModel} from '@shared/models/data.models/fleet/driver.model';
import {FmTruckEditableDialogComponent} from '../fm-truck/fm-truck-editable-dialog/fm-truck-editable-dialog.component';
import {AuthenticationService} from '@app/user-management/shared/services';
import {
    X_BUTTON,
    NOTIFICATION_DEFAULT_DURARION
} from '@shared/constants/value.constant';
import {FmDriverEditableDialogComponent} from '../fm-driver/fm-driver-editable-dialog/fm-driver-editable-dialog.component';
import {FmDriverDeleteDialogComponent} from '../fm-driver/fm-driver-delete-dialog/fm-driver-delete-dialog.component';
import {FmTruckDeleteDialogComponent} from '../fm-truck/fm-truck-delete-dialog/fm-truck-delete-dialog.component';
import {FmCompanyEditableDialogComponent} from '../fm-company/fm-company-editable-dialog/fm-company-editable-dialog.component';
import {FmCompanyDeleteDialogComponent} from '../fm-company/fm-company-delete-dialog/fm-company-delete-dialog.component';
import {FormControl} from '@angular/forms';
import {FmTreeviewLoadingService} from '@app/shared/services/fm-treeview-loading.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {SideBarService} from '@shared/services/side-bar.service';

@Component({
    selector: 'app-fm-page-treeview',
    templateUrl: './fm-page-treeview.component.html',
    styleUrls: ['./fm-page-treeview.component.scss']
})
export class FmPageTreeviewComponent extends DefaultComponent
    implements OnInit {
    @Input() readonly = true;
    @Input() truckCompanySysIds: string[];
    @Input() canCreateCompany: boolean = true;

    searchControl: FormControl = new FormControl('');

    truckCompanies: TruckCompanyModel[] = [];
    truckCompanyIds: string[];

    treeControl = new NestedTreeControl<IFleetCompanyTreeNode>(
        node => node.children
    );
    dataSource = new MatTreeNestedDataSource<IFleetCompanyTreeNode>();

    selectedNode: IFleetCompanyTreeNode;
    expandingNode: IFleetCompanyTreeNode = null;
    promise;

    constructor(
        private _truckCompanyDataService: TruckCompanyDataService,
        private _fmTreeviewLoading: FmTreeviewLoadingService,
        private _truckDataService: TruckDataService,
        private _driverDataService: DriverDataService,
        private _authenService: AuthenticationService,
        private _snackBar: MatSnackBar,
        private _SideBarService: SideBarService,
        public dialog: MatDialog
    ) {
        super();
    }

    ngOnInit() {
        this.initTreeView();

        this.onRefresh();

        this.searchControl.valueChanges
            .pipe(debounceTime(200))
            .subscribe(filterValue => {
                filterValue = filterValue.trim().toLowerCase();
                this.processTruckCompanyData(
                    this.truckCompanies.filter((truckCompany: TruckCompanyModel) =>
                        truckCompany.companyName.toLowerCase().includes(filterValue)
                    )
                );
                this.refreshTreeView();
            });

        this._fmTreeviewLoading.loading.subscribe(_ => this.onRefresh());
    }

    initTreeView() {
        this.addSubscribes(
            this._truckCompanyDataService.truckCompanyAllObservable.subscribe(rs => {
                if (!!rs) {
                    this.truckCompanies = !!this.truckCompanySysIds
                        ? rs.filter((company: TruckCompanyModel) =>
                            this.truckCompanySysIds.includes(company.getId())
                        )
                        : rs;

                    this.processTruckCompanyData(this.truckCompanies);
                    this.refreshTreeView();
                } else {
                    this.dataSource.data = [];
                    this.refreshTreeView();
                }
            }),
            this._truckDataService.truckAllByCompanyObservable
                .pipe()
                .subscribe((trucks: TruckModel[]) => {
                    if (trucks) {
                        this.promise = new Promise(resolve => setTimeout(resolve, 1000));
                        this.processTruckData(trucks);
                        this.refreshTreeView();
                    }
                }),
            this._driverDataService.driverAllByCompanyObservable
                .pipe()
                .subscribe((drivers: DriverModel[]) => {
                    if (drivers) {
                        this.promise = new Promise(resolve => setTimeout(resolve, 1000));
                        this.processDriverData(drivers);
                        this.refreshTreeView();
                    }
                })
        );
    }

    hasChild = (_: number, node: IFleetCompanyTreeNode) =>
        !node.isChildrenLoaded || (!!node.children && node.children.length > 0);
    canEdit = (node: IFleetCompanyTreeNode) =>
        !['Drivers', 'Trucks'].includes(node.levelName);
    canRemove = (node: IFleetCompanyTreeNode) =>
        !['Drivers', 'Trucks'].includes(node.levelName);

    onAddNew(value: string | any): void {
        const disabledSelect = value && value['disabledSelect'];
        const key = value.key || value;
        switch (key) {
            case 'Company':
                this.onNewCompany(disabledSelect);
                break;
            case 'Truck':
                this.onNewTruck(disabledSelect);
                break;
            case 'Driver':
                this.onNewDrirver(disabledSelect);
                break;
        }
    }

    onEdit(node: IFleetCompanyTreeNode): void {
        switch (node.levelName) {
            case 'Company':
                this.onEditCompany(node.nodeData as TruckCompanyModel);
                break;
            case 'Truck':
                this.onEditTruck(node.nodeData as TruckModel);
                break;
            case 'Driver':
                this.onEditDrirver(node.nodeData as DriverModel);
                break;
        }
    }

    onDelete(node: IFleetCompanyTreeNode): void {
        switch (node.levelName) {
            case 'Company':
                this.onRemoveCompany(node.nodeData as TruckCompanyModel);
                break;
            case 'Truck':
                this.onRemoveTruck(node.nodeData as TruckModel);
                break;
            case 'Driver':
                this.onRemoveDrirver(node.nodeData as DriverModel);
                break;
        }
    }

    private onNewCompany(disabledSelect: boolean = false) {
        const dialogRef = this.dialog.open(FmCompanyEditableDialogComponent, {
            data: {
                companyDetail: null,
                companyId: null,
                disabledSelect
            }
            // width: '500px'
        });

        dialogRef.afterClosed().subscribe((modalResult: TruckCompanyModel) => {
            console.log(modalResult);
            if (!!modalResult) {
                this._truckCompanyDataService
                    .create(modalResult, this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(
                            `${modalResult.companyName} is created`,
                            X_BUTTON,
                            {
                                duration: NOTIFICATION_DEFAULT_DURARION
                            }
                        );
                    });
            }
        });
    }

    private onEditCompany(item: TruckCompanyModel) {
        const dialogRef = this.dialog.open(FmCompanyEditableDialogComponent, {
            data: {
                companyDetail: item
            },
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((modalResult: TruckCompanyModel) => {
            if (!!modalResult) {
                this._truckCompanyDataService
                    .update(item.getId(), modalResult, this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(
                            `${modalResult.companyName} is updated`,
                            X_BUTTON,
                            {
                                duration: NOTIFICATION_DEFAULT_DURARION
                            }
                        );
                    });
            }
        });
    }

    private onRemoveCompany(item: TruckCompanyModel) {
        const dialogRef = this.dialog.open(FmCompanyDeleteDialogComponent, {
            width: '500px',
            data: item
        });

        dialogRef.afterClosed().subscribe((modalResult: TruckCompanyModel) => {
            if (!!modalResult) {
                this._truckCompanyDataService
                    .delete(item.getId(), this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(`${item.companyName} is deleted`, X_BUTTON, {
                            duration: NOTIFICATION_DEFAULT_DURARION
                        });
                    });
            }
        });
    }

    private onNewTruck(disabledSelect: boolean = false) {
        const dialogRef = this.dialog.open(FmTruckEditableDialogComponent, {
            data: {
                truckDetail: null,
                defaultCompanyId: null,
                truckCompanyIds: this.truckCompanyIds,
                disabledSelect
            }
            // width: '500px'
        });

        dialogRef.afterClosed().subscribe((modalResult: TruckModel) => {
            if (!!modalResult) {
                this.onRefresh();
            }
        });
    }

    private onNewDrirver(disabledSelect: boolean = false) {
        const dialogRef = this.dialog.open(FmDriverEditableDialogComponent, {
            data: {
                driverDetail: null,
                defaultCompanyId: null,
                truckCompanyIds: this.truckCompanyIds,
                disabledSelect
            }
            // width: '500px'
        });

        dialogRef.afterClosed().subscribe(rs => {
            if (rs) {
                this.onRefresh();
            }
        });
    }

    private onEditDrirver(item: DriverModel) {
        const dialogRef = this.dialog.open(FmDriverEditableDialogComponent, {
            data: {
                driverDetail: item,
                defaultCompanyId: item.companyId,
                truckCompanyIds: this.truckCompanyIds
            },
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(rs => {
            if (rs) {
                this.onRefresh();
            }
        });
    }

    private onRemoveDrirver(item: DriverModel) {
        const dialogRef = this.dialog.open(FmDriverDeleteDialogComponent, {
            width: '500px',
            data: item
        });

        dialogRef.afterClosed().subscribe(modalResult => {
            if (!!modalResult) {
                this._driverDataService
                    .delete(item.getId(), this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(`${item.fullName} is deleted`, X_BUTTON, {
                            duration: NOTIFICATION_DEFAULT_DURARION
                        });
                    });
            }
        });
    }

    private onEditTruck(item: TruckModel) {
        const dialogRef = this.dialog.open(FmTruckEditableDialogComponent, {
            data: {
                truckDetail: item,
                defaultCompanyId: item.companyId,
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

    private onRemoveTruck(item) {
        const dialogRef = this.dialog.open(FmTruckDeleteDialogComponent, {
            width: '500px',
            data: item
        });

        dialogRef.afterClosed().subscribe(modalResult => {
            if (!!modalResult) {
                this._truckDataService
                    .delete(item.getId(), this._authenService.getUsername())
                    .then(result => {
                        this.onRefresh();
                        this._snackBar.open(`${item.truckPlate} is deleted`, X_BUTTON, {
                            duration: NOTIFICATION_DEFAULT_DURARION
                        });
                    });
            }
        });
    }

    onRefresh() {
        this.searchControl.setValue('');
        this.promise = this._truckCompanyDataService.findAll();
    }

    toggleNode(node) {
        if (node.isChildrenLoaded === false) {
            this.expandingNode = node;
            node.isChildrenLoaded = true;
            switch (node.levelName) {
                case 'Company':
                    this.expandingNode.children = ['Trucks', 'Drivers'].map(
                        (nodeName: string) => {
                            const subNode: IFleetCompanyTreeNode = {
                                nodeId: node.nodeId,
                                name: nodeName,
                                nodeData: node.nodeData,
                                levelName: nodeName,
                                icon:
                                    nodeName === 'Trucks'
                                        ? 'fal fa-truck-container'
                                        : 'fal fa-user',
                                isChildrenLoaded: false,
                                children: [],
                                companyName: this.expandingNode.companyName,
                                parent: this.expandingNode
                            };

                            return subNode;
                        }
                    );
                    this.treeControl.expand(this.expandingNode);
                    this.refreshTreeView();
                    break;
                case 'Trucks':
                    this.promise = this._truckDataService.findAllByCompanyIds([node.companyName]);
                    break;
                case 'Drivers':
                    this.promise = this._driverDataService.findAllByCompanyIds([node.companyName]);
                    break;
            }
        } else {
            this.treeControl.toggle(node);
        }
    }

    onSelectedNodeChanged(node) {
        this.selectedNode = node;
        this._SideBarService.close();
        if (node.isChildrenLoaded === false) {
            switch (node.levelName) {
                case 'Company':
                    this.expandingNode = node;
                    node.isChildrenLoaded = true;
                    this.expandingNode.children = ['Trucks', 'Drivers'].map(
                        (nodeName: string) => {
                            const subNode: IFleetCompanyTreeNode = {
                                nodeId: node.nodeId,
                                name: nodeName,
                                nodeData: node.nodeData,
                                levelName: nodeName,
                                icon:
                                    nodeName === 'Trucks'
                                        ? 'fal fa-truck-container'
                                        : 'fal fa-user',
                                isChildrenLoaded: false,
                                children: [],
                                companyName: this.expandingNode.companyName,
                                parent: this.expandingNode
                            };

                            return subNode;
                        }
                    );
                    this.treeControl.expand(this.expandingNode);
                    this.refreshTreeView();
                    break;
                default:
            }
        }
    }

    private processTruckCompanyData(truckCompanies: TruckCompanyModel[]): void {
        if (!!this.truckCompanySysIds && this.truckCompanySysIds.length > 0) {
            this.truckCompanyIds = truckCompanies.map(c => c.companyId);
        }
        const treeDataSource: IFleetCompanyTreeNode[] = truckCompanies.map(
            (company: TruckCompanyModel) => {
                const companyNode: IFleetCompanyTreeNode = {
                    nodeId: company.getId(),
                    name: company.companyName,
                    nodeData: company,
                    levelName: 'Company',
                    icon: 'fal fa-building',
                    isChildrenLoaded: false,
                    children: [],
                    companyName: company.companyName
                };

                return companyNode;
            }
        );
        if (typeof treeDataSource !== 'undefined' && treeDataSource.length) {
            this.dataSource.data = treeDataSource;
            this.selectedNode = treeDataSource[0];
        }
    }

    private processTruckData(trucks: TruckModel[]) {
        if (!!trucks && trucks.length > 0 && !!this.expandingNode) {
            this.expandingNode.children = trucks.map((truck: TruckModel) => {
                const truckNode: IFleetCompanyTreeNode = {
                    nodeId: truck.getId(),
                    name: truck.truckPlate,
                    nodeData: truck,
                    levelName: 'Truck',
                    icon: 'fal fa-truck-container',
                    isChildrenLoaded: true,
                    children: [],
                    companyName: this.expandingNode.companyName,
                    truckPlate: truck.truckPlate,
                    parent: this.expandingNode
                };

                return truckNode;
            });
            this.treeControl.expand(this.expandingNode);
        }
    }

    private processDriverData(drivers: DriverModel[]) {
        if (!!drivers && drivers.length > 0 && !!this.expandingNode) {
            this.expandingNode.children = drivers.map((driver: DriverModel) => {
                const driverNode: IFleetCompanyTreeNode = {
                    nodeId: driver.getId(),
                    name: driver.fullName,
                    nodeData: driver,
                    levelName: 'Driver',
                    icon: 'fal fa-user',
                    isChildrenLoaded: true,
                    children: [],
                    companyName: this.expandingNode.companyName,
                    driverName: driver.fullName,
                    parent: this.expandingNode
                };

                return driverNode;
            });
            this.treeControl.expand(this.expandingNode);
        }
    }

    private refreshTreeView() {
        const _data = this.dataSource.data;
        this.dataSource.data = null;
        this.dataSource.data = _data;
        this.expandingNode = null;
    }

    onRefreshDetails($event: any) {
        this.promise = $event;
    }
}
