import { Component, OnInit } from '@angular/core';
import { SmDefaultDetailsCompact } from '@management/settings-management/sm-class/sm-default-details-compact.class';
import { DialogService } from '@shared/services/others/dialog.service';
import { SideBarService } from '@shared/services/side-bar.service';
import { DeliveryPointGroupDataService } from '@shared/services/data/settings/delivery-point-group-data.service';
import { MpmEditableCoordinateDialogComponent } from '@management/map-management/mpm-editable-coordinate-dialog/mpm-editable-coordinate-dialog.component';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { GeoPoint } from '@app/shared/models/geo-point.model';
import * as _ from 'lodash';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-sm-dpg-details-compact',
  templateUrl: './sm-dpg-details-compact.component.html',
  styleUrls: ['./sm-dpg-details-compact.component.scss']
})
export class SmDpgDetailsCompactComponent extends SmDefaultDetailsCompact implements OnInit {
  keys: string[] = ['DeliveryPointGroupName', 'Description'];
  stations: StationModel[] = [];
  selectedStations: StationModel[] = [];
  selectedStationIds: string[] = [];
  stationList: any[] = [];
  boundPoints: GeoPoint[];

  constructor(
    private _snackBar: MatSnackBar,
    public _DialogService: DialogService,
    public _SideBarService: SideBarService,
    public _DeliveryPointGroupDataService: DeliveryPointGroupDataService,
    private _StationDataService: StationDataService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
  ) {
    super(_DialogService, _SideBarService, _DeliveryPointGroupDataService);
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(res => {
      this.stations = res;
      this.stationList = res.map(r => r._data);
    })
  }

  loadData() {
    this._DataService.findSettingById(this.id).then((rs: any) => {
        if (rs) {
          this.object = rs;
          this.generateFormData(this.object);
          if (rs._data.DeliveryPoints) {
            let stations = this.dataUtilService.wrapObjToOneElementArray(rs._data.DeliveryPoints.DeliveryPoint);
            this.selectedStationIds = stations.map(s => s.StationId);
          }
        }
      });
  }

  // onCoordinateOpenDialog() {
  //   this._DialogService.open(MpmEditableCoordinateDialogComponent,
  //     {
  //       points: this.coordinates,
  //       onChange: ($event) => this.onCoordinateChange($event),
  //       readonly: !this.isEditing,
  //       maxPoint: 1,
  //       drawable: this.isEditing
  //     });
  // }

  onDeliveryPointsChange(event) {
    this.selectedStations = this.stations.filter(s => event.some(e => s.sysId === e.sysId));
    this.boundPoints = [];
    _.map(this.selectedStations, (el) => {
      this.boundPoints = this.boundPoints.concat([el.geoPoint].slice());
    });
  }

  async onUpdate() {
    await this.removeStationRef();
    let deliveryPoints = this.buildDeliveryPoints();
    let exePayload = new Payload(PayloadsConstant.DELIVERY_POINT_GROUP.UPDATE,
      [this.id, this.formDOM.value.DeliveryPointGroupName, this.formDOM.value.Description, deliveryPoints.join('')]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.isEditing = false;
        this.loadData();
        this._SideBarService.refresh();
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  buildDeliveryPoints() {
    return this.selectedStations.map(s => `<StationId>${s.sysId}</StationId>`);
  }

  removeStationRef() {
    let exePayload = new Payload(PayloadsConstant.DELIVERY_POINT_GROUP.DELETE_STATION_REF, [this.id]);
    return this.apiDataService.executeQuery(exePayload).toPromise();
  }
}
