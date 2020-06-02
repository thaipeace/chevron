import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject, ViewChild } from '@angular/core';
import { SideBarControl } from '@app/shared/models/sidebar-control.class';
import { MatSnackBar, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatDialogRef } from '@angular/material';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { IDynamicComponent } from '@app/shared/models/dynamic-item.class';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { TankDataService } from '@app/shared/services/data/tank-data.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-edit-discharge-point',
  templateUrl: './edit-discharge-point.component.html',
  styleUrls: ['./edit-discharge-point.component.scss']
})
export class EditDischargePointComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() data;
  control: SideBarControl = null;
  promise;

  public selectedItem: any = {};
  public originSelectedItem: any = {};
  public isEdit: boolean;
  public stationId: string = null;
  public tanks: any[] = [];
  public tankAssociations: string[] = [];
  tableData: MatTableDataSource<any>;
  displayedColumns = ['#', 'select', 'tankName', 'dischargePointName'];
  selection = new SelectionModel<any>(true, []);

  constructor(
    private _MatSnackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _tankDataService: TankDataService,
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    public dialogRef: MatDialogRef<EditDischargePointComponent>,
  ) {
    super();
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }

    if (this.dataModal) {
      this.isEdit = this.dataModal.isEdit;
      this.selectedItem = this.dataModal.selectedPoint || {};
      this.originSelectedItem = Object.assign({}, this.selectedItem);

      this.stationId = this.dataModal.stationId;
      if (this.stationId) {
        this.addSubscribes(
          this._tankDataService.tankAllByStationObservable.subscribe(rs => {
            this.tanks = rs;
            this.tableData = new MatTableDataSource(this.tanks);
            this.tableData.paginator = this.paginator;
            this.tableData.sort = this.sort;
            this.setDefaultSelected();
          })
        );
        this._tankDataService.findAllByStationId(this.stationId);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedItem = this.data.item;
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onCreate() {
    this.setTankAssociations();
    let exePayload = new Payload(PayloadsConstant.dischargePoints.createDischargePoint,
      [this.selectedItem.DischargePointName, this.selectedItem.DischargePointIndex,
        this.selectedItem.Longitude, this.selectedItem.Latitude,
        this.selectedItem.Altitude, this.tankAssociations.join(''), this.stationId]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === "Success") {
        this.dialogRef.close(true);
      }
      this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  async onUpdate() {
    await this.deleteAllTankAssociations();

    this.setTankAssociations();
    let exePayload = new Payload(PayloadsConstant.dischargePoints.updateDischargePoint,
      [this.selectedItem.DischargePointId, this.selectedItem.DischargePointName, 
        this.selectedItem.DischargePointIndex, this.selectedItem.Longitude,
        this.selectedItem.Latitude, this.selectedItem.Altitude, this.tankAssociations.join('')]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === "Success") {
        this.dialogRef.close(true);
      }
      this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  deleteAllTankAssociations() {
    let exePayload = new Payload(PayloadsConstant.dischargePoints.deleteDischargePointTankRef,
      [this.selectedItem.DischargePointId]
    );
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  setDefaultSelected() {
    this.selection.clear();
    this.tableData.data.forEach(row => {
      if (this.selectedItem.TankAssociations 
        && this.selectedItem.TankAssociations.TankNumber.some(t => t.StationtankId === row.sysId)) {
        this.selection.select(row);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableData.data.forEach(row => this.selection.select(row));
  }

  setTankAssociations() {
    this.tankAssociations.length = 0;
    this.selection.selected.forEach(selected => {
      this.tankAssociations.push(`<StationtankId>${selected.sysId}</StationtankId>`);
    });
  }

  isTankNotAvailable(row) {
    return (row.dischargePointName && !this.isEdit)
      || (this.originSelectedItem && row.dischargePointName && this.originSelectedItem.DischargePointName!==row.dischargePointName);
  }

  isAllTankNotAvailable() {
    let result = false;
    for (let i=0; i<this.tanks.length; i++) {
      if (this.isTankNotAvailable(this.tanks[i])) {
        result = true;
        break;
      };
    }
    return result;
  }
}
