import { Component, Input, OnChanges, OnInit, SimpleChanges, Inject } from '@angular/core';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { IDynamicComponent } from '@shared/models/dynamic-item.class';
import { SideBarControl } from '@shared/models/sidebar-control.class';
import * as _ from 'lodash';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { MatSnackBar, } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ParamsService } from '@app/shared/services/params.service';
import { GeoPoint } from '@app/shared/models/geo-point.model';
import { ICoordinateModel } from '@app/shared/models/data.models/interface-coordinate.model';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { MpmEditableCoordinateDialogComponent } from '@app/management/map-management/mpm-editable-coordinate-dialog/mpm-editable-coordinate-dialog.component';
import { TerminalModel } from '@app/shared/models/data.models/terminal/terminal.model';
import { RegionModel } from '@app/shared/models/data.models/terminal/region.model';
import { TerminalDataService } from '@app/shared/services/data/settings/terminal-data.service';
import { RegionDataService } from '@app/shared/services/data/settings/region-data.service';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { SupplyPointDataService } from '@app/shared/services/data/settings/supply-point-data.service';
import { SupplyPointModel } from '@app/shared/models/data.models/terminal/supply-point.model';

const directionItems: string[] = ['Station', 'Terminal', 'Supply Point'];

@Component({
  selector: 'app-cm-route-details-compact',
  templateUrl: './cm-route-details-compact.component.html',
  styleUrls: ['./cm-route-details-compact.component.scss']
})
export class CmRouteDetailsCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
  @Input() data;
  control: SideBarControl = null;
  promise;

  isEdit: boolean = false;
  selectedItemId: any = null;
  selectedItem: any = null;
  stationId: string = null;
  isEditing: boolean = false;
  object: ICoordinateModel;
  coordinates: GeoPoint[] = [];
  wayPointQuery: string[] = [];

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
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private paramsService: ParamsService,
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

    this.setTerminalsAndSLPAndStations();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  async onDataChange() {
    if (this.data) {
      this.selectedItemId = this.data.id;
      let res = await this.getSelectedItem();
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this.selectedItem = raw.APIResponse.Route;
      this.formatSelectedItem();
    }
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
    this.filterDirection('Destination')
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

  getSelectedItem() {
    let exePayload = new Payload(PayloadsConstant.ROUTE.FIND_BY_ID, [this.selectedItemId]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  onCloseEditing() {
    this._SideBarService.close();
    this.control.fn_close();
  }

  async onUpdate() {
    await this.deleteRouteWayPoints();

    this.setWayPointQuery(this.coordinates);
    let exePayload = new Payload(PayloadsConstant.ROUTE.UPDATE,
      [this.selectedItemId, this.selectedItem.RouteName, this.selectedItem.Active,
        this.selectedItem.Description, this.selectedItem.OriginType, this.selectedItem.Origin,
        this.selectedItem.DestinationType, this.selectedItem.Destination, this.selectedItem.EscortRequired,
        this.wayPointQuery.join('')]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.isEditing = false;
        this.onDataChange();
        this._SideBarService.refresh('route');
      }

      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });

  }

  doCancel() {
    this.isEditing = false;
  }

  onCoordinateChange(event) {
    this.coordinates = event;
  }

  onCoordinateOpenDialog() {
    this._DialogService.open(MpmEditableCoordinateDialogComponent,
      {
        points: this.coordinates,
        onChange: ($event) => this.onCoordinateChange($event),
        readonly: !this.isEditing
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
    let exePayload = new Payload(PayloadsConstant.ROUTE.DELETE_WAY_POINTS, [this.selectedItemId]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }

  isDialogOpen() {
    return document.querySelector('.mat-dialog-container');
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
