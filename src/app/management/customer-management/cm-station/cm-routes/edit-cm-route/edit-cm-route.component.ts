import { Component, OnInit, Inject, OnChanges, Input, SimpleChanges } from '@angular/core';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { DefaultComponent } from '@app/shared/models/default/default-component.model';
import { IDynamicComponent } from '@app/shared/models/dynamic-item.class';
import { SideBarControl } from '@app/shared/models/sidebar-control.class';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { ICoordinateModel } from '@app/shared/models/data.models/interface-coordinate.model';
import { GeoPoint } from '@app/shared/models/geo-point.model';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { MpmEditableCoordinateDialogComponent } from '@app/management/map-management/mpm-editable-coordinate-dialog/mpm-editable-coordinate-dialog.component';
import { TerminalDataService } from '@app/shared/services/data/settings/terminal-data.service';
import { SupplyPointDataService } from '@app/shared/services/data/settings/supply-point-data.service';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { TerminalModel } from '@app/shared/models/data.models/terminal/terminal.model';
import { RegionModel } from '@app/shared/models/data.models/terminal/region.model';
import { StationModel } from '@app/shared/models/data.models/station/station.model';

const directionItems: string[] = ['Station', 'Terminal', 'Supply Point'];

@Component({
  selector: 'app-edit-cm-route',
  templateUrl: './edit-cm-route.component.html',
  styleUrls: ['./edit-cm-route.component.scss']
})
export class EditCmRouteComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @Input() data;
  control: SideBarControl = null;
  promise;

  public selectedItem: any = {};
  public selectedId: string = null;
  public geoLocations: any[] = [];
  public geofencePointsQuery: string = '';
  public isEdit: boolean;
  public stationId: string = null;
  public object: ICoordinateModel;
  public coordinates: GeoPoint[] = [];
  public wayPointQuery: string[] = [];

  originColection: any[] = [];
  destinationColection: any[] = [];
  originColectionFull: any[] = [];
  destinationColectionFull: any[] = [];
  directionDestination: string[] = [];
  directionOrigin: string[] = [];

  terminals: any[] = [];
  supplyPoints: any[] = [];
  stations: any[] = [];

  constructor(
    private _MatSnackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    public dialogRef: MatDialogRef<EditCmRouteComponent>,
    public _DialogService: DialogService,
    private _TerminalDataService: TerminalDataService,
    private _SupplyPointDataService: SupplyPointDataService,
    private _StationDataService: StationDataService
  ) { 
    super();
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }

    if (this.dataModal) {
      this.isEdit = this.dataModal.isEdit;
      this.stationId = this.dataModal.stationId;
      let selectedItem = this.dataModal.selectedRoute || {};

      if (selectedItem.RouteId) {
        this.selectedId = selectedItem.RouteId;
        this.setSelectedItem();
      }
    }

    this.setTerminalsAndSLPAndStations();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedItem = this.data.item;
    }
  }

  setSelectedItem() {
    let exePayload = new Payload(PayloadsConstant.ROUTE.FIND_BY_ID, [this.selectedId]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      if (raw.APIResponse.Status === 'Success') {
        this.selectedItem = raw.APIResponse.Route;
        this.formatSelectedItem();
      }
    }, error => {
      console.log('Loading error');
    });
  }

  async setTerminalsAndSLPAndStations() {
    this.terminals = await this._TerminalDataService.findSettingAll();
    this.supplyPoints = await this._SupplyPointDataService.findSettingAll();
    this._StationDataService.stationAllObservable.subscribe(rs => {
      this.stations = rs;
    });

    this.setColection('OriginType', 'originColection');
    this.setColection('DestinationType', 'destinationColection');
    this.filterDirection('Origin');
    this.filterDirection('Destination');
  }

  formatSelectedItem() {
    this.object = this.selectedItem;
    this.selectedItem.Active = this.selectedItem.Active === "true";
    this.selectedItem.EscortRequired = this.selectedItem.EscortRequired === "true";
    
    if (!this.selectedItem.GeofencePoints) return;
    this.selectedItem.GeofencePoints.Geopoint = this.dataUtilService.wrapObjToOneElementArray(
      this.selectedItem.GeofencePoints.Geopoint
    );
    this.coordinates = this.selectedItem.GeofencePoints.Geopoint.map(w => {
      let coor = new GeoPoint();
      coor.lat = +w.Latitude;
      coor.lng = +w.Longitude;
      return coor;
    })
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.ROUTE.CREATE,
      [this.stationId, this.selectedItem.RouteName, this.selectedItem.Active ? this.selectedItem.Active : false,
        this.selectedItem.Description, this.selectedItem.OriginType, this.selectedItem.Origin, 
        this.selectedItem.DestinationType, this.selectedItem.Destination,
        this.selectedItem.EscortRequired ? this.selectedItem.EscortRequired : false, this.geofencePointsQuery]
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
    await this.deleteRouteWayPoints();

    this.setWayPointQuery(this.coordinates);
    let exePayload = new Payload(PayloadsConstant.ROUTE.UPDATE,
      [this.selectedId, this.selectedItem.RouteName, this.selectedItem.Active ? this.selectedItem.Active : false,
        this.selectedItem.Description, this.selectedItem.OriginType, this.selectedItem.Origin,
        this.selectedItem.DestinationType, this.selectedItem.Destination, 
        this.selectedItem.EscortRequired ? this.selectedItem.EscortRequired : false, this.wayPointQuery.join('')]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.dialogRef.close(true);
      }

      this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  setWayPointQuery(points) {
    this.wayPointQuery = [];
    points.forEach(p => {
      if (p.lat || p.lng) {
        this.wayPointQuery.push(`<geofencePoint><Latitude>${p.lat}</Latitude><Longitude>${p.lng}</Longitude></geofencePoint>`);
      }
    });
  }

  deleteRouteWayPoints() {
    let exePayload = new Payload(PayloadsConstant.ROUTE.DELETE_WAY_POINTS, [this.selectedId]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  onTableChange(event) {
    if (Array.isArray(event)) {
      this.buildGeofencePointsQuery(event);
      this.coordinates = event;
    }
  }

  onCoordinateOpenDialog() {
    this._DialogService.open(MpmEditableCoordinateDialogComponent,
      {
        points: this.coordinates,
        onChange: ($event) => this.onTableChange($event),
        readonly: false
      });
  }

  buildGeofencePointsQuery(geoLocations) {
    let locations = [];
    locations = geoLocations.map(g => {
      return `<geofencePoint><Latitude>${g.lat}</Latitude><Longitude>${g.lng}</Longitude></geofencePoint>`;
    });

    this.geofencePointsQuery = locations.join('');
  }

  onTypeChange(selectedString, directionString, collectionString) {
    this.selectedItem[selectedString] = null;
    this.setColection(directionString, collectionString);
    this.filterDirection(selectedString);
  }

  setColection(directionString, collectionString) {
    if (this.selectedItem[directionString] === 'Station') {
      this[collectionString + 'Full'] = this[collectionString] = this.stations.map(s => {
        return {id: s._data.sysId, name: s._data.stationName}
      });
    } else if (this.selectedItem[directionString] === 'Terminal') {
      this[collectionString + 'Full'] = this[collectionString] = this.terminals.map(s => {
        return {id: s._data.TerminalId, name: s._data.TerminalName}
      });
    } else if (this.selectedItem[directionString] === 'Supply Point') {
      this[collectionString + 'Full'] = this[collectionString] = this.supplyPoints.map(s => {
        return {id: s._data.SupplyPointId, name: s._data.SupplyPointName}
      });
    }
  }

  filterDirection(selectedString) {
    if (selectedString === 'Origin') {
      this.directionDestination = directionItems.filter(d => d !== this.selectedItem.OriginType);
      if (this.selectedItem.OriginType === this.selectedItem.DestinationType) {
        this.selectedItem.DestinationType = null;
        this.selectedItem.Destination = null;
      }
    } else {
      this.directionOrigin = directionItems.filter(d => d !== this.selectedItem.DestinationType);
      if (this.selectedItem.OriginType === this.selectedItem.DestinationType) {
        this.selectedItem.OriginType = null;
        this.selectedItem.Origin = null;
      }
    }
  }
}
