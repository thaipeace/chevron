import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';
import {InventoryDataService} from '@shared/services/data/inventory-data.service';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {PRODUCT_CODE} from '@shared/constants/value.constant';

@Component({
  selector: 'app-im-history-import-dialog',
  templateUrl: './im-history-import-dialog.component.html',
  styleUrls: ['./im-history-import-dialog.component.scss']
})
export class ImHistoryImportDialogComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH = 1800;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  @ViewChild('dropContainer') dropContainer: ElementRef<HTMLElement>;

  STEPS = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
  };

  step: number = this.STEPS.ONE;
  file: any;
  tmpFileInBase64: any = null;
  errors: string[] = [];
  selectedDate: Date;
  stations: StationModel[];
  selectedStations: StationModel[];
  selectedStationIds: string[];
  PRODUCT_CODES = [PRODUCT_CODE.EURO4_97, PRODUCT_CODE.PREMIUM_95, PRODUCT_CODE.B10_DIESEL, PRODUCT_CODE.EURO5_B7];

  // $promise;
  uploadFileName: string;
  tmp;
  isPlanned: boolean = false;

  constructor(private _InventoryDataService: InventoryDataService,
              private _StationDataService: StationDataService,
              public dialogRef: MatDialogRef<ImHistoryImportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    super(dialogRef);
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable.subscribe(rs => {
      if (rs === null) {
        this._StationDataService.findAll();
      } else {
        this.stations = rs;
        this.selectedStationIds = rs.map(el => {
          return el.getId();
        });
        this.selectedStations = [...this.stations];
        // setTimeout(() => {
        //   this.onPageChange();
        // }, 1000);
      }
      // console.log(this.stations);
    });
    this.selectedDate = new Date();
    //
    this.constructDrop();

  }

  // onPageChange() {
  // this.selectedStations = this.stations.slice(this.paginator.pageIndex * this.paginator.pageSize, (this.paginator.pageIndex + 1) * this.paginator.pageSize);
  // }

  next() {
    this.step = this.STEPS[_.findKey(this.STEPS, (value) => value === this.step + 1)];
    if (this.step === this.STEPS.THREE) {
      this.getImportData();
    }
  }

  getImportData() {
    this._InventoryDataService.getFileUploadContent(this.uploadFileName, moment(this.selectedDate).format('DD/MM/YYYY'))
      .then((rs) => {
        console.log(rs);
        // localStorage.setItem('tmp', JSON.stringify(rs));
        if (this.stations.length) {
          this.tmp = rs;
          _.map(this.stations, (el) => {
            el.onhandinv = {};
            el.plannedOrder = {};
            const found = _.find(this.tmp, (el1) => el1._data.shipTo === el.shipTo);
            if (!!found) {
              el.onhandinv = found._data.onhandinv;
              el.plannedOrder = found._data.plannedOrder;
            }
          });
        }
      });
  }


  back() {
    this.step = this.STEPS[_.findKey(this.STEPS, (value) => value === this.step - 1)];
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

    // if (file.size >= 4194304) {
    //   self.errors.push('Maximum file size is 4MB');
    //   return;
    // }

    const reader = new FileReader();

    reader.onload = function (e: any) {
      self.tmpFileInBase64 = e.target.result.split(',')[1];
      self._InventoryDataService.fileUpload(self.tmpFileInBase64)
        .then((rs) => {
          if (rs) {
            self.uploadFileName = rs;
          }

        });
    };

    self.file = {fileName: file.name, extension: extension};

    reader.readAsDataURL(file);
  }

  triggerUploadFile($event: MouseEvent) {
    this.uploadInput.nativeElement['value'] = '';
    this.uploadInput.nativeElement.click();
  }

  onTimeChange($event: any) {
    this.getImportData();
  }

  prevDay() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'days').toDate();
    this.getImportData();
  }

  nextDay() {
    this.selectedDate = moment(this.selectedDate).add(1, 'days').toDate();
    this.getImportData();
  }

  zoomOut() {

  }

  zoomIn() {

  }

  import() {
    // this.$promise = true;
    
    let fileNameArr = this.uploadFileName.split('.');
    fileNameArr[1] = 'xml';

    this._InventoryDataService.importData(fileNameArr.join('.'), this.isPlanned).then((rs) => {
      // console.log(rs);
      if (rs) {
        this.onOk();
      }
    });
  }

  onStationSelectionChange(newV: any) {
    this.selectedStationIds = newV;
    this.selectedStations = _.filter(this.stations, (el) => this.selectedStationIds.indexOf(el.getId()) >= 0);
    this.paginator.length = this.selectedStations.length;
    if ((this.paginator.pageIndex + 1) * this.paginator.pageSize > this.paginator.length) {
      this.paginator.firstPage();
    }
  }
}
