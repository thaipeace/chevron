import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {StationModel} from '@app/shared/models/data.models/station/station.model';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {QuotaDataService} from '@app/shared/services/data/quota-data.service';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {QuotaModel} from '@app/shared/models/data.models/quota/quota.model';
import {X_BUTTON, NOTIFICATION_CREATION_DURARION, NOTIFICATION_DEFAULT_DURARION, PRODUCT_CODE} from '@app/shared/constants/value.constant';
import * as _ from 'lodash';
import {ProductDataService} from '@shared/services/data/product-data.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {ProductModel} from '@shared/models/data.models/terminal/product.model';

@Component({
  selector: 'app-qm-new',
  templateUrl: './qm-new.component.html',
  styleUrls: ['./qm-new.component.scss']
})
export class QmNewComponent extends DefaultComponent implements OnInit {
  @ViewChild('f') public form: NgForm;

  stations: StationModel[];
  selectedStation: StationModel;
  quotaDetail: QuotaModel;
  isNew = false;
  formData: TQLFormData = QuotaModel.getFormData();
  quotaKeys: string[] = ['StationId', 'ProductCode', 'MonthlyQuota', 'RemainingQuota'];
  quotaEditKeys: string[] = ['StationId', 'ProductCode', 'MonthlyQuota', 'RemainingQuota'];
  keys: string[];
  products: ProductModel[];


  constructor(
    private _QuotaDataService: QuotaDataService,
    public dialogRef: MatDialogRef<QmNewComponent>,
    private _ProductDataService: ProductDataService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { stations: StationModel[], quotaDetail: QuotaModel }
  ) {
    super();
    this.addPromises(this._ProductDataService.findSettingAll()
      .then((rs: ProductModel[]) => {
        this.products = rs;
        /*check if any product is available for each station*/
        this._QuotaDataService.findAll()
          .then((rs1) => {
            _.map(this.stations, (station) => {
              station.products = this.products.slice();
              const founds = _.filter(rs1, (e) => {
                return station.getId() === e.stationId;
              });
              // console.log(founds);
              if (founds.length) {
                _.map(founds, (e) => {
                  _.remove(station.products, (product) => product.getValue('ProductCode') === e['productCode']);
                });
              }
            });
          });
      }));


    const {stations, quotaDetail} = data;
    this.stations = stations.slice();
    this.quotaDetail = quotaDetail;
  }

  ngOnInit() {
    console.log(this.formData);
    if (!this.quotaDetail) {
      this.isNew = true;
      this.keys = this.quotaKeys;
    } else {
      this.isNew = false;
      this.formData.updateValues(this.quotaDetail._data);
      this.keys = this.quotaEditKeys;
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  doUpdate() {
    // this.formData.setValue('ProductCode', this.PRODUCT_CODE.B10_DIESEL);
    if (this.isNew) {
      this._QuotaDataService.create(this.formData).then(rs => {
        console.log(rs);
        if (rs && rs[1] && rs[1]['Create'] && rs[1]['Create']['Status'] === 'Success') {
          const message = `Quota is created successfully`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_CREATION_DURARION});
          this.dialogRef.close(true);
        } else {
          if (rs && rs[1] && rs[1]['Message']) {
            const message = rs[1]['Message'];
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }
        }
      });
    } else {
      this._QuotaDataService.update(this.formData).then(rs => {
        if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
          let userName = rs[2]['data']['Save']['User']['userName']['Value'];
          const message = `Update successfully`;
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          //this.updateUserSuccess.emit();
          this.dialogRef.close(true);
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
    }
  }

  onChangeStation(value: any) {
    this.selectedStation = _.find(this.stations, (station) => station.getId() === value);
    this.formData['StationId'].value = value;
  }
}
