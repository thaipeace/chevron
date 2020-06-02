import { Component, OnInit, Inject } from '@angular/core';
import { DriverModel } from '@shared/models/data.models/fleet/driver.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DriverDataService } from '@shared/services/data/driver-data.service';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { AuthenticationService } from '@app/user-management/shared/services';
import * as _ from 'lodash';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@shared/constants/value.constant';

@Component({
  selector: 'app-fm-driver-editable-dialog',
  templateUrl: './fm-driver-editable-dialog.component.html',
  styleUrls: ['./fm-driver-editable-dialog.component.scss']
})
export class FmDriverEditableDialogComponent implements OnInit {
  isNew: boolean;
  driverDetail: DriverModel;

  companies: TruckCompanyModel[];
  defaultCompanyId: string;
  truckCompanyIds: string[];
  statusList: any[];
  disabledSelect: boolean;

  formData: TQLFormData;
  status: any = {};
  isLoadCompany = false;
  keys = [
    'fullName',
    'address',
    'companyId',
    'contactNumber',
    'chevronDriverId',
    'terminalPassExpiryDate',
    'driverLicenceNumber'
  ];

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FmDriverEditableDialogComponent>,
    private _authenService: AuthenticationService,
    private _companyDataService: TruckCompanyDataService,
    private _driverDataService: DriverDataService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      driverDetail: DriverModel;
      defaultCompanyId: string;
      truckCompanyIds: string[];
      disabledSelect: boolean;
    }
  ) {
    const {
      driverDetail,
      defaultCompanyId,
      truckCompanyIds,
      disabledSelect
    } = data;

    this.driverDetail = driverDetail;
    this.defaultCompanyId = defaultCompanyId;
    this.truckCompanyIds = truckCompanyIds;
    this.disabledSelect = disabledSelect;
  }

  ngOnInit() {
    this.formData = DriverModel.getFormData();
    this.formData['terminalPassExpiryDate'].value = new Date();
    this._companyDataService.truckCompanyAllObservable.subscribe(companies => {
      if (!this.isLoadCompany && companies && companies.length === 0) {
        this.isLoadCompany = true;
        this._companyDataService.findAll();
        return;
      }

      this.companies =
        !!this.truckCompanyIds && this.truckCompanyIds.length > 0
          ? companies.filter((c: TruckCompanyModel) =>
              this.truckCompanyIds.includes(c.companyId)
            )
          : companies;
      if (!this.driverDetail) {
        this.isNew = true;
        if (!!this.defaultCompanyId) {
          this.formData.setValue('companyId', this.defaultCompanyId);
        }
      } else {
        this.isNew = false;
        this.formData = DriverModel.getFormData();
        this.formData.updateValues(this.driverDetail._data);
      }
    });
    this._driverDataService.findAllStatus().then(res => {
      let tmpStatus = _.orderBy(res, [el => el.Key.toLowerCase()], ['asc']);
      this.status = tmpStatus.reduce((obj, item) => {
        obj[item.Key] = item.Value;
        return obj;
      }, {});
      this.statusList = Object.keys(this.status);
    });
  }

  doUpdate() {
    if (this.isNew) {
      this._driverDataService
        .create(this.formData, this._authenService.getUsername())
        .then(rs => {
          if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
            const message = `${this.formData.getValue(
              'fullName'
            )} is created successfully`;
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
      this._driverDataService
        .update(
          this.driverDetail.getId(),
          this.formData,
          this._authenService.getUsername()
        )
        .then(rs => {
          if (rs && rs[1] && rs[1]['Update']['Status'] === 'Success') {
            const message = `${this.formData.getValue(
              'fullName'
            )} is updated successfully`;
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
            this.dialogRef.close(true);
          } else {
            if (rs && rs[1] && rs[1]['Update']['Message']) {
              const message = rs[1]['Update']['Message'];
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

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
