import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {TankModel} from '@app/shared/models/data.models/tank/tank.model';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {CmCustomerDetailsDialogComponent} from '@management/customer-management/cm-customer/cm-customer-details-dialog/cm-customer-details-dialog.component';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {GET_COLOR_BY_PRODUCTCODE, X_BUTTON, NOTIFICATION_DEFAULT_DURARION, COLOR_TANK_LEVEL} from '@shared/constants/value.constant';
import {Info} from '@app/shared/models/info';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {MatSnackBar} from '@angular/material';
import {AuthenticationService} from '@app/user-management/shared/services';
import {TankDataService} from '@app/shared/services/data/tank-data.service';
import {StationDataService} from '@app/shared/services/data/station-data.service';
import {CustomerService} from '@app/shared/services/customer.service';
import {DATA_PRODUCT_CODE} from '@shared/constants/value.constant';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {Payload} from '@app/shared/models/payload';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {DataUtilService} from '@app/shared/services/data-util.service';
import {IQuestionDialogModel} from '@app/shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';

@Component({
  selector: 'app-cm-tank-details',
  templateUrl: './cm-tank-details.component.html',
  styleUrls: ['./cm-tank-details.component.scss']
})
export class CmTankDetailsComponent extends DefaultComponent implements OnInit, OnChanges {
  @Input() customer: CustomerModel;
  @Input() station: StationModel;
  @Input() readonly: boolean;
  @Input() tank: TankModel;
  @Input() id;
  @Input() popupEdit: boolean = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
  tankLevelsInfo: Info[];
  tankForm: FormGroup;
  edit = false;
  tankSelected;
  productCodeData = DATA_PRODUCT_CODE;
  editKeys: string[] = [
    'deadStock',
    'maxFillCapacity',
    'currentUllage',
    'currentVolume',
    'maxFillCapacityPercentage',
    'isPtoReq',
    'archived',
    'productCode',
    'PreferredMaxFill',
    'tankCapacity'
  ];

  originTankData: any;

  constructor(
    private _DialogService: DialogService,
    private _authenService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _StationDataService: StationDataService,
    private _TankDataService: TankDataService,
    private _CustomerService: CustomerService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    super();
    this.tankForm = new FormGroup({});
    this.editKeys.forEach(key => this.tankForm.addControl(key, new FormControl('', Validators.required)));
  }

  setTankForm() {
    if (this.tank) {
      Object.keys(this.tankForm.controls).forEach(key => {
        this.tankForm.get(key).setValue(this.tank._data[key] !== null ? this.tank._data[key] : false);
      });

      this.originTankData = this.tank._data;
    }
  }

  ngOnInit() {
    this.setTankForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {tank} = changes;
    if (tank && tank.currentValue) {
      this.loadData(tank.currentValue);
    } else {
      this.loadDetails();
    }
    // console.log(this.tank);
  }

  loadDetails() {
    this.addPromises(
      this._TankDataService.findById(this.id).then(rs => {
        this.tank = rs;

        this.originTankData = this.tank._data;
        this.loadData(this.tank);
        if (this.tank && this.tank.stationId) {
          this._StationDataService.findById(this.tank.stationId).then(rs1 => {
            this.station = rs1;
            if (this.station && this.station.customerId && typeof this.customer === 'undefined') {
              this._CustomerService.findById(this.station.customerId).then(rs2 => {
                this.customer = rs2;
              });
            }
          });
        }
      })
    );
  }

  loadData(tankData) {
    this.setTankForm();
    this.tankSelected = tankData;
    this.tankLevelsInfo = [
      {
        title: 'Total Capacity',
        color: COLOR_TANK_LEVEL.TOTAL,
        suffix: 'Liters',
        value: tankData && tankData['tankCapacity']
      },
      {
        title: 'Max Fill Capacity',
        color: COLOR_TANK_LEVEL.MAX_FILL,
        suffix: 'Liters',
        value: tankData && tankData['maxFillCapacity']
      },
      {
        title: 'Preferred Max Fill',
        color: COLOR_TANK_LEVEL.PREFERRED_FILL,
        suffix: 'Liters',
        value: tankData && tankData['preferredMaxFill']
      },
      {
        title: 'Dead Stock',
        color: COLOR_TANK_LEVEL.DEAD_STOCK,
        suffix: 'Liters',
        value: tankData && tankData['deadStock']
      }
    ];
    if (!tankData) {
      return;
    }
    const plotBandRange = [
      [0, tankData.deadStock],
      [tankData.deadStock, tankData.deadStock],
      [tankData.deadStock, tankData.maxFillCapacity],
      [tankData.maxFillCapacity, tankData.tankCapacity]
    ];

  }

  onSave() {
    const formData: TQLFormData = TankModel.getFormData();
    formData.updateValues(this.tank._data);
    if (this.tankForm.valid) {
      Object.keys(this.tankForm.controls).forEach(key => formData.setValue(key, this.tankForm.get(key).value));
      // console.log(formData);
      this._TankDataService.update(formData, this._authenService.getUsername()).then(rs => {
        if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {

          if (this.canArchived(formData)) {
            const archivedTankPayload = new Payload(
              PayloadsConstant.TANK.ARCHIVED_TANK,
              [this.tank.stationId, this.tank.tankNumber]
            );
            this.apiDataService.executeQuery(archivedTankPayload).subscribe(res => {
              let raw = this.dataUtilService.convertXmlToJson(res);
              this.ngOnChanges(this.tankSelected);
            }, error => {
              console.log('Loading error');
            });
          }

          this.edit = false;
          const message = `Update successfully`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          this.refresh.emit();
        } else {
          if (rs && rs[1] && rs[1]['Save']['Message']) {
            const message = rs[1]['Save']['Message'];
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }
        }
      });
    } else {
      const message = `There are some problems. Please try again!`;
      this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    }
  }

  onEdit() {
    this.edit = true;
  }

  onCancelEdit() {
    Object.keys(this.tankForm.controls).forEach(key => this.tankForm.get(key).setValue(this.tank._data[key]));
    this.edit = false;
  }

  canArchived(current) {
    let canMakeArchivedAttrs = ['productCode', 'tankCapacity'];
    let same = true;
    let keys = Object.keys(this.originTankData);
    for (let i = 0; i < keys.length; i++) {
      if (this.originTankData[keys[i]] && current[keys[i]] && canMakeArchivedAttrs.includes(keys[i])) {
        same = (this.originTankData[keys[i]]) === current[keys[i]].value;
        if (!same) {
          break;
        }
      }
    }
    return !same;
  }

  onDeleteArchivedTank() {
    const dialogData: IQuestionDialogModel = {
      title: 'Delete archived tank',
      question: `Do you want to delete this archived tank?`,
      onYes: () => {
        questionDialogRef.close();
        const deleteArchivedTankPayload = new Payload(
          PayloadsConstant.TANK.DELETE_ARCHIVED_TANK, [this.tank.stationId, this.tank.tankNumber]
        );
        this.apiDataService.executeQuery(deleteArchivedTankPayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          if (raw.Status === 'Success') {
            this._snackBar.open('Archived Tank Deleted Successfully.', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
            this.refresh.emit();
          } else {
            this._snackBar.open(raw.Status, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }
        }, error => {
          console.log('Loading error');
        });
      }
    };
    const questionDialogRef = this._DialogService.open(
      MessageQuestionDialogComponent, {...dialogData}
    );
  }
}
