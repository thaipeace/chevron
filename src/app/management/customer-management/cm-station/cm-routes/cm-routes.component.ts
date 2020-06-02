import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, Type } from '@angular/core';
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
import { EditCmRouteComponent } from './edit-cm-route/edit-cm-route.component';
import { DatePipe } from '@angular/common';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { DynamicItem } from '@app/shared/models/dynamic-item.class';
import { CmRouteDetailsCompactComponent } from './cm-route-details-compact/cm-route-details-compact.component';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MpmMapSelectionDialogComponent } from '@app/management/map-management/mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import { GeoPoint } from '@app/shared/models/geo-point.model';
import { SupplyPointDataService } from '@app/shared/services/data/settings/supply-point-data.service';
import { StationDataService } from '@app/shared/services/data/station-data.service';

@Component({
  selector: 'app-cm-routes',
  templateUrl: './cm-routes.component.html',
  styleUrls: ['./cm-routes.component.scss']
})
export class CmRoutesComponent extends DefaultComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tableData: MatTableDataSource<any>;
  @Input() stationId: string = null;
  @Input() readonly: boolean = true;
  @Input() terminals: any[] = [];
  @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayedColumns = ['select', '#', 'active', 'name', 'originName', 'destinationName', 'created', 'modified', 'action'];
  searchControl: FormControl = new FormControl('');
  routes: any[] = [];
  inputSearch: string;
  selectedRow: any;
  selectedRowIndex: number = -1;
  tankAssociations: any[] = [];
  datePipe: DatePipe = new DatePipe('en');
  selectedItem: any = {};
  selection = new SelectionModel<any>(true, []);

  supplyPoints: any[] = [];
  stations: any[] = [];

  constructor(
    private _AuthenticationService: AuthenticationService,
    private _dialogService: DialogService,
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _SideBarService: SideBarService,
    private _SupplyPointDataService: SupplyPointDataService,
    private _StationDataService: StationDataService
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

    this._SideBarService.statusObservable.subscribe((rs) => {
      if (this._SideBarService.isClose(rs)) {
        this.selectedRow = null;
      }
    });

    this._SideBarService.refreshObservable.subscribe((rs) => {
      if (rs === 'route') {
        this.onRefresh();
      }
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.setRoutes();
  }

  setRoutes() {
    let exePayload = new Payload(PayloadsConstant.ROUTE.FIND_ALL, [this.stationId]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      this.routes = [];
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      if (raw.APIResponse.Status === 'Success' || raw.APIResponse.Routes) {
        this.routes = this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Routes.Route);
      }
      this.setSupplyPointAndStations();
    }, error => {
      console.log('Loading error');
    });
  }

  async setSupplyPointAndStations() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      this.stations = rs;
    });
    
    this.supplyPoints = await this._SupplyPointDataService.findSettingAll();
    this.formatRoutesTable();
  }

  formatRoutesTable() {
    this.routes.forEach(r => {
      switch (r.OriginType) {
        case 'Station':
          let station = this.stations.find(s => s._data.sysId === r.Origin);
          if (station) {
            r.OriginName = station._data.stationName;
          };
          break;

        case 'Supply Point':
          let supplyPoint = this.supplyPoints.find(s => s._data.SupplyPointId === r.Origin);
          if (supplyPoint) {
            r.OriginName = supplyPoint._data.SupplyPointName;
          };
          break;

        default: return;
      }

      switch (r.DestinationType) {
        case 'Station':
          let station = this.stations.find(s => s._data.sysId === r.Destination);
          if (station) {
            r.DestinationName = station._data.stationName;
          }
          break;

        case 'Terminal':
          let terminal = this.terminals.find(s => s.TerminalId === r.Destination);
          if (terminal) {
            r.DestinationName = terminal.TerminalName;
          }
          break;

        default: return;
      }
    });

    this.tableData = new MatTableDataSource(this.routes);
    const defaultPredicate = this.tableData.filterPredicate;
    let dateFormatedArr = ['Created', 'Modified'];
    this.tableData.filterPredicate = (data: any, filter: string) => {
      let reFormatValues = [];
      dateFormatedArr.forEach(d => {
        if (data[d] && data[d] !== 'NA') {
          reFormatValues.push(this.datePipe.transform(data[d], 'yyyy-MM-dd (HH:mm)'));
        }
      });

      return reFormatValues.some(v => v.includes(filter)) || defaultPredicate(data, filter);
    };
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.selection.clear();

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
    this.setRoutes();
  }

  onEdit(isEdit, row?) {
    let inputData = { isEdit: isEdit, stationId: this.stationId };
    let newDialogRef;
    if (row) {
      inputData['selectedRoute'] = row;
    }
    newDialogRef = this._dialogService.open(EditCmRouteComponent, inputData);

    this.addSubscribes(
      newDialogRef.afterClosed().subscribe(rs => {
        if (rs) {
          this.onRefresh();
        }
      })
    );

  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete it?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.ROUTE.DELETE, [row.RouteId]);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message = raw.APIResponse.Message;
          if (raw.APIResponse.Status === 'Success') {
            this.onRefresh();
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._dialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  onClickRow(row) {
    if (this.isDialogOpen()) return;
    this.highlightRow(row);
    this.selectedItem = Object.assign({}, row);
    this._SideBarService.open(new DynamicItem(CmRouteDetailsCompactComponent, { id: this.selectedItem.RouteId }));
  }

  isDialogOpen() {
    return document.querySelector('.mat-dialog-container');
  }

  onMapSelected() {
    let selectedArr = this.selection.selected.map(select => select);
    selectedArr.forEach(item => {
      if (item.GeofencePoints) {
        item.GeofencePoints.Geopoint = this.dataUtilService.wrapObjToOneElementArray(item.GeofencePoints.Geopoint);
        item.coordinates = item.GeofencePoints.Geopoint.map(w => {
          let coor = new GeoPoint();
          coor.lat = +w.Latitude;
          coor.lng = +w.Longitude;
          return coor;
        });
      } else {
        item.coordinates = [];
      }

      item.name = item.RouteName;
    })

    this._dialogService.open(MpmMapSelectionDialogComponent, { groups: selectedArr });
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

}
