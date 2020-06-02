import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {StationModel} from '@app/shared/models/data.models/station/station.model';
import {CustomerModel} from '@shared/models/data.models/customer/customer.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {CmCustomerDetailsDialogComponent} from '@management/customer-management/cm-customer/cm-customer-details-dialog/cm-customer-details-dialog.component';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {StationDataService} from '@app/shared/services/data/station-data.service';
import {AuthenticationService} from '@app/user-management/shared/services';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {CustomerTreeviewLoadingService} from '@app/shared/services/customer-treeview-loading.service';
import {telPhoneValidator} from '@app/shared/validators/telPhone';
import {noWhitespaceValidator} from '@app/shared/validators/no-white-spaces';
import {valueSafeValidator} from '@app/shared/validators/value-safe';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import * as _ from 'lodash';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';
import {RegionDataService} from '@shared/services/data/settings/region-data.service';
import {TerminalModel} from '@shared/models/data.models/terminal/terminal.model';
import {Payload} from '@app/shared/models/payload';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {DataUtilService} from '@app/shared/services/data-util.service';
import {RegionModel} from '@shared/models/data.models/terminal/region.model';
import {TankDataService} from '@app/shared/services/data/tank-data.service';
import {CmTankListComponent} from '../../cm-tank/cm-tank-list/cm-tank-list.component';
import {DeliveryPointGroupDataService} from '@shared/services/data/settings/delivery-point-group-data.service';
import {DeliveryPointGroupModel} from '@shared/models/data.models/terminal/delivery-point-group.model';
import {CustomerService} from '@shared/services/customer.service';

@Component({
  selector: 'app-cm-station-details',
  templateUrl: './cm-station-details.component.html',
  styleUrls: ['./cm-station-details.component.scss']
})
export class CmStationDetailsComponent extends DefaultComponent implements OnInit, OnChanges {
  @Input() station: StationModel;
  @Input() customer: CustomerModel;
  @Input() readonly: boolean = false;
  @Input() popupEdit: boolean = false;
  @Input() id;
  @Input() stationName;
  @Output() refreshed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
  @Output() showEdit: EventEmitter<any> = new EventEmitter<any>();

  inventoryData;
  stationForm: FormGroup;
  contactNumber: FormArray;
  edit = false;
  stationSelected;
  tanks: any[] = [];

  terminals: any[] = [];
  regions: any[] = [];
  regionsFiltered: any[] = [];
  deliveryPointGroups: any[] = [];
  isStationPTOReq: string = 'No';

  constructor(
    private _DialogService: DialogService,
    private _StationDataService: StationDataService,
    private _AuthenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _customerTreeviewLoading: CustomerTreeviewLoadingService,
    private _TerminalDataService: TerminalDataService,
    private _RegionDataService: RegionDataService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _tankDataService: TankDataService,
    private _DeliveryPointGroupDataService: DeliveryPointGroupDataService,
    private _CustomerService: CustomerService
  ) {
    super();
    this.stationForm = new FormGroup({
      stationName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      shortName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      streetAddress: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      contactNumber: new FormControl('', []),
      stationType: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      distanceFromTerminal: new FormControl('', [Validators.required]),
      estimatedHoursFromTerminal: new FormControl('', [Validators.required]),
      truckSize: new FormControl('', [Validators.required]),
      associatedTerminalId: new FormControl(''),
      associatedRegionId: new FormControl(''),
      deliveryPointGroupId: new FormControl('')
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stationSelected = changes;
    if (this.popupEdit) {
      this.loadData(this.id);
      this.setIsStationPTOReq(this.id);
    } else {
      const {station} = changes;
      if (station && station.currentValue) {
        this.loadData(this.station._data['sysId']);
        this.setIsStationPTOReq(this.station._data['sysId']);
      }
    }
  }

  loadData(id) {
    this.addPromises(
      this._StationDataService.findById(id).then(data => {
        if (data) {
          this.station = data;
          Object.keys(this.stationForm.controls).forEach(key =>
            this.stationForm.get(key).setValue(data._data[key])
          );

          if (this.station._data['contactNumber']) {
            this.contactNumber = new FormArray(
              String(this.station._data['contactNumber'])
                .split(',')
                .map(val => new FormControl(val.trim(), [Validators.required, telPhoneValidator]))
            );
          } else {
            this.contactNumber = new FormArray([]);
          }

          this.setTerminalsAndRegionsAndDeliveryPointGroup();

          if (this.station.customerId && typeof this.customer === 'undefined') {
            this._CustomerService.findById(this.station.customerId).then(rs2 => {
              this.customer = rs2;
            });
          }
        }
      })
    );
    this.addPromises(
      this._StationDataService.findCurrentInventoryByStationIds([id])
        .then((rs) => {
          console.log(rs);
          this.inventoryData = rs;
        })
    );

  }

  onRefresh() {
    this.refreshed.emit(true);
  }

  getTankNumber(tanks) {
    if (!tanks || !tanks.length) {
      return '';
    }
    return tanks.map((elem) => elem.tankNumber).join(' ,');
  }

  onSave() {
    const formData: TQLFormData = StationModel.getFormData();
    formData.updateValues(this.station._data);

    if (this.stationForm.valid) {
      Object.keys(this.stationForm.controls).forEach(key =>
        formData.setValue(key, this.stationForm.get(key).value)
      );

      formData.setValue('contactNumber', this.contactNumber.value.join(', '));
      formData.setValue('associatedTerminalId', this.station.associatedTerminalId);
      formData.setValue('associatedRegionId', this.station.associatedRegionId);
      formData.setValue('deliveryPointGroupId', this.station.deliveryPointGroupId);
      this._StationDataService.update(formData, this._AuthenticationService.getUsername()).then(rs => {
        if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
          this.edit = false;

          const message = `Update successfully`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          this.ngOnChanges(this.stationSelected);
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

  public tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (this.popupEdit) {
      tabChangeEvent.index === 0 ? this.showEdit.emit(true) : this.showEdit.emit(false);
    }

    if (['Tank List'].includes(tabChangeEvent.tab.textLabel)) {
      this._tankDataService.findAllByStationId(this.station._data['sysId']);
    }
  }

  onEdit() {
    this.edit = true;
  }

  onCancelEdit() {
    Object.keys(this.stationForm.controls).forEach(key =>
      this.stationForm.get(key).setValue(this.station._data[key])
    );
    this.edit = false;
  }

  enableSave() {
    return this.stationForm.valid && this.contactNumber.valid;
  }

  setIsStationPTOReq(id) {
    let exePayload = new Payload(PayloadsConstant.STATION.GetPTOReqForStation, [id]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this.isStationPTOReq = raw.APIResponse.isPTOReq === 'true' ? 'Yes' : 'No';
    }, error => {
      console.log('Loading error');
    });
  }

  setTerminalsAndRegionsAndDeliveryPointGroup() {
    this._TerminalDataService.findSettingAll().then((rs: TerminalModel[]) => {
      this.terminals = rs.map(t => t._data);
    });

    this._RegionDataService.findSettingAll().then((rs: RegionModel[]) => {
      this.regions = rs.map(t => t._data);
      if (this.station.associatedTerminalId) {
        this.regionsFiltered = this.regions.filter(r => r.AssociatedTerminalId === this.station.associatedTerminalId);
      }
    });

    this._DeliveryPointGroupDataService.findSettingAll().then((rs: any) => {
      this.deliveryPointGroups = rs.map(t => t._data);
    });
  }

  setDeliveryPointGroupId() {
    
  }

  getTerminalName(id) {
    let terminal = this.terminals.find(t => t.TerminalId === id);
    return terminal ? terminal.TerminalName : '';
  }

  getRegionName(id) {
    let region = this.regions.find(r => r.RegionId === id);
    return region ? region.RegionName : '';
  }

  onChangeAssociatedTerminal(event) {
    this.station.associatedRegionId = null;
    this.regionsFiltered = this.regions.filter(r => r.AssociatedTerminalId === event.TerminalId);
  }

  getDeliveryPointGroupName(id) {
    let deliveryPointGroup = this.deliveryPointGroups.find(d => d.SysId === id);
    return deliveryPointGroup ? deliveryPointGroup.DeliveryPointGroupName : '';
  }
}
