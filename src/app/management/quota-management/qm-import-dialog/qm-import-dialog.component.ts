import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSnackBar } from '@angular/material';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { PRODUCT_CODE, X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@shared/constants/value.constant';
import { InventoryDataService } from '@shared/services/data/inventory-data.service';
import { StationDataService } from '@shared/services/data/station-data.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { QuotaDataService } from '@shared/services/data/quota-data.service';
import { UtilsService } from '@shared/services/utils.service';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { keys } from 'highcharts';

@Component({
  selector: 'app-qm-import-dialog',
  templateUrl: './qm-import-dialog.component.html',
  styleUrls: ['./qm-import-dialog.component.scss']
})
export class QmImportDialogComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH = 1800;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  @ViewChild('dropContainer') dropContainer: ElementRef<HTMLElement>;

  STEPS = {
    ONE: 1,
    TWO: 2
  };

  step: number = this.STEPS.ONE;
  file: any;
  tmpFileInBase64: any = null;
  errors: string[] = [];
  selectedDate: Date;
  stations: StationModel[];
  selectedStations: StationModel[];
  PRODUCT_CODES = [PRODUCT_CODE.EURO4_97, PRODUCT_CODE.PREMIUM_95, PRODUCT_CODE.B10_DIESEL, PRODUCT_CODE.EURO5_B7];

  $promise;
  uploadFileName: string;
  tmp;

  constructor(private _QuotaDataService: QuotaDataService,
    private _StationDataService: StationDataService,
    public dialogRef: MatDialogRef<QmImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _MatSnackBar: MatSnackBar
  ){
    super(dialogRef);
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.stations = rs;

        setTimeout(() => {
          this.onPageChange();
        }, 1000);
      }
      // console.log(this.stations);
    });
    this.selectedDate = new Date();
    //
    this.constructDrop();

  }

  onPageChange() {
    this.selectedStations = this.stations.slice(this.paginator.pageIndex * this.paginator.pageSize, (this.paginator.pageIndex + 1) * this.paginator.pageSize);
  }

  next() {
    // this.step = this.STEPS[_.findKey(this.STEPS, (value) => value === this.step + 1)];
    this.step = this.STEPS.TWO;
    if (this.step === this.STEPS.TWO) {
      this.getUploadedFileData();
    }
  }

  getUploadedFileData() {
    this._QuotaDataService.getUploadedFileData(this.uploadFileName)
      .then((rs) => {
        // console.log(rs);
        // localStorage.setItem('tmp', JSON.stringify(rs));
        if (this.stations.length) {
          this.tmp = rs;

          if (this.tmp['data']['APIResponse']['ProductQuotas']['ProductQuota']) {
            this.tmp = this.tmp['data']['APIResponse']['ProductQuotas']['ProductQuota'];
            this.tmp = UtilsService.isArray(this.tmp) ? this.tmp : [this.tmp];
          }
          _.map(this.stations, (el) => {
            el.onhandinv = {};
            el.plannedOrder = {};
            const found = _.find(this.tmp, (el1) => parseInt(el1.ShipTo) === parseInt(el.shipTo));
            if (!!found) {
              el.onhandinv = found;
            }
          });
          // console.log(this.stations);
        }
      });
  }

  back() {
    // this.step = this.STEPS[_.findKey(this.STEPS, (value) => value === this.step - 1)];
    this.step = this.STEPS.ONE;
  }

  onDateChange($event: Date) {
    this.selectedDate = $event;
  }

  constructDrop() {
    let el: HTMLElement = this.dropContainer.nativeElement;
    el.ondragover = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add('onDragOver');
    };
    el.ondragleave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('onDragOver');
    };
    el.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('onDragOver');
      this.onFileChange(e.dataTransfer.files[0]);
    };
  }

  onClickToUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.onFileChange(fileInput.target.files[0]);
    }

  }

  onFileChange(file: any) {
    const self = this;
    self.uploadFileName = null;
    const fileTypes = ['csv', 'xls', 'xlsx', 'xlsm'];
    const extension = file.name.split('.').pop().toLowerCase();

    self.errors = [];

    if (fileTypes.indexOf(extension) < 0) {
      self.errors.push('Only accept file types: ' + fileTypes.toString());
      return;
    }

    if (file.size >= 4194304) {
      self.errors.push('Maximum file size is 4MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e: any) {
      self.tmpFileInBase64 = e.target.result.split(',')[1];
      self._QuotaDataService.uploadFile(self.tmpFileInBase64)
        .then((rs) => {
          if (rs) {
            self.uploadFileName = rs;
          }

        });
    };

    self.file = { fileName: file.name, extension: extension };

    reader.readAsDataURL(file);
  }

  triggerUploadFile($event: MouseEvent) {
    this.uploadInput.nativeElement['value'] = '';
    this.uploadInput.nativeElement.click();
  }

  onTimeChange($event: any) {
    this.getUploadedFileData();
  }

  prevDay() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'days').toDate();
    this.getUploadedFileData();
  }

  nextDay() {
    this.selectedDate = moment(this.selectedDate).add(1, 'days').toDate();
    this.getUploadedFileData();
  }

  zoomOut() {

  }

  zoomIn() {

  }

  import() {
    this.$promise = true;
    
    let quotaQuery = this.buildQuotaQuery();
    let exePayload = new Payload(PayloadsConstant.QUOTA.ADD_QUOTA_WITH_PRODUCT_CODE, [quotaQuery]);
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

  buildQuotaQuery() {
    let query = [];
    this.stations.forEach(ss => {
      if (Object.keys(ss['onhandinv']).length) {
        query.push(`<Data><StationId>${ss.sysId}</StationId><ProductQuotas>${this.buildProductQuotas(ss)}</ProductQuotas></Data>`);
      }
    })
    return query.join('');
  }

  buildProductQuotas(ss) {
    let quotas = [];
    let products = Object.assign({}, ss.onhandinv);
    ['Index', 'ShipTo', 'StationName'].forEach(i => delete products[i]);
    
    let productKeys = Object.keys(products);
    productKeys.forEach(k => {
      if (products[k]) {
        quotas.push(`<ProductQuota><ProductCode>${k}</ProductCode><MonthlyQuota>${products[k]}</MonthlyQuota><RemainingQuota>${products[k]}</RemainingQuota></ProductQuota>`);
      }
    });

    return quotas.join('');
  }
}
