import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { TankDataService } from '@shared/services/data/tank-data.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { StationDataService } from '@shared/services/data/station-data.service';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { DATA_PRODUCT_CODE } from '@shared/constants/value.constant';

@Component({
  selector: 'app-cm-tank-new',
  templateUrl: './cm-tank-new.component.html',
  styleUrls: ['./cm-tank-new.component.scss']
})
export class CmTankNewComponent extends DefaultComponent implements OnInit {
  @ViewChild('f') public form: NgForm;
  tankDetail: TankModel;
  stationId: string;
  productCodeData = DATA_PRODUCT_CODE;

  viewKeys: string[] = [
    'tankNumber',
    'deadStock',
    'maxFillCapacity',
    'preferredMaxFill',
    'currentUllage',
    'currentVolume',
    'stationId',
    'maxFillCapacityPercentage',
    'productCode',
    'tankCapacity',
    'isPtoReq',
    'archived'
  ];
  editKeys: string[] = [
    'tankNumber',
    'deadStock',
    'maxFillCapacity',
    'preferredMaxFill',
    'currentUllage',
    'currentVolume',
    'stationId',
    'maxFillCapacityPercentage',
    'productCode',
    'tankCapacity',
    'isPtoReq',
    'archived'
  ];
  keys: string[];
  isNew = false;
  isLoadStation = false;
  disabledSelect: boolean;
  stations: StationModel[];
  selectedStation: any;
  unAvailableTankNumbers: number[];
  formData: TQLFormData;

  constructor(
    private _tankService: TankDataService,
    private _stationService: StationDataService,
    private _authenService: AuthenticationService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CmTankNewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tankDetail: TankModel;
      stationId: string;
      disabledSelect: boolean;
    }
  ) {
    super();
    const { tankDetail, stationId, disabledSelect } = data;
    this.tankDetail = tankDetail;
    this.stationId = stationId;
    this.disabledSelect = disabledSelect;
  }

  ngOnInit() {
    this.formData = TankModel.getFormData();
    this.addSubscribes(
      this._stationService.stationAllObservable.subscribe(stations => {
        if (!this.isLoadStation && stations && stations.length === 0) {
          this.isLoadStation = true;
          this._stationService.findAll();
          return;
        }

        this.stations = stations;
        this.selectedStation = this.stations.find(s => s.sysId === this.stationId);
        this.unAvailableTankNumbers = this.selectedStation.tanks.map(t => +t.tankNumber);
        if (!this.tankDetail) {
          this.isNew = true;
          this.keys = this.viewKeys;
          if (!!this.stationId) {
            this.formData.setValue('stationId', this.stationId);
          }
        } else {
          this.isNew = false;
          this.formData = TankModel.getFormData();
          this.formData.updateValues(this.tankDetail._data);
          this.keys = this.editKeys;
        }
      })
    );

    this._stationService.findAll();
  }

  doUpdate() {
    if (this.isNew) {
      if (!this.formData.getValue('isPtoReq')) {
        this.formData.setValue('isPtoReq', false);
      }
      if (!this.formData.getValue('archived')) {
        this.formData.setValue('archived', false);
      }
      this._tankService.create(this.formData, this._authenService.getUsername()).then(rs => {
        if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
          const message = `Create successfully`;
          this._snackBar.open(message, X_BUTTON, {
            duration: NOTIFICATION_DEFAULT_DURARION
          });
          this.dialogRef.close(true);
        } else {
          if (rs && rs[1] && rs[1]['Create']['Message']) {
            const message = rs[1]['Create']['Message'];
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          }
        }
      });
    } else {
      this._tankService.update(this.formData, this._authenService.getUsername()).then(rs => {
        if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
          const message = `Update successfully`;
          this._snackBar.open(message, X_BUTTON, {
            duration: NOTIFICATION_DEFAULT_DURARION
          });
          this.dialogRef.close(true);
        } else {
          if (rs && rs[1] && rs[1]['Save']['Message']) {
            const message = rs[1]['Save']['Message'];
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          }
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  isExtraValid() {
    return this.unAvailableTankNumbers.every(u => u !== this.formData['tankNumber'].value);
  }
}
