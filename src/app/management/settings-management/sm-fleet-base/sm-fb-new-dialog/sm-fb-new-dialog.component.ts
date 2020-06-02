import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';

@Component({
  selector: 'app-sm-fb-new-dialog',
  templateUrl: './sm-fb-new-dialog.component.html',
  styleUrls: ['./sm-fb-new-dialog.component.scss']
})
export class SmFbNewDialogComponent extends DefaultDialogComponent implements OnInit {

  public selectedItem: any = {};
  public geoLocations: any[] = [];
  public geofencePointsQuery: string = '';

  constructor(
    private _snackBar: MatSnackBar,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmFbNewDialogComponent>,
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.selectedItem.rotaTimeSpan = new Date();
  }

  onCreate() {
    let exePayload = new Payload(PayloadsConstant.FLEET_BASE.CREATE,
      [this.selectedItem.fleetBaseName, this.selectedItem.description,
        this.selectedItem.rotaTimeSpan.getTime(), this.geofencePointsQuery]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = raw.APIResponse.Message;;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancel(true);
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      this._snackBar.open(`Oops! Something went wrong. Please try again.`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    })
  }

  onCancel(isRefresh: boolean = false) {
    this.dialogRef.close(isRefresh);
  }

  onTableChange(event) {
    if (Array.isArray(event)) {
      this.buildGeofencePointsQuery(event);
    }
  }

  buildGeofencePointsQuery(geoLocations) {
    let locations = [];
    locations = geoLocations.map(g => {
      return `<geofencePoint><latitude>${g.lat}</latitude><longitude>${g.lng}</longitude></geofencePoint>`;
    });

    this.geofencePointsQuery = locations.join('');
  }

}
