import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {DeliveryDataService} from '@shared/services/data/delivery-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dm-windows-new-dialog',
  templateUrl: './dm-windows-new-dialog.component.html',
  styleUrls: ['./dm-windows-new-dialog.component.scss']
})
export class DmWindowsNewDialogComponent extends DefaultDialogComponent implements OnInit {
  @ViewChild('f') public form: NgForm;
  station: StationModel;
  keys: string[] = [
    'station',
    'name',
    'startDate',
    'duration',
    'startTime',
    'endTime',
    'maxMonthlyDeliveryDistribution',
  ];
  formDOM: FormGroup;

  constructor(public dialogRef: MatDialogRef<DmWindowsNewDialogComponent>,
              public _DeliveryDataService: DeliveryDataService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(dialogRef);
    if (data['station']) {
      this.station = data['station'];
    }
  }

  ngOnInit() {
    this.formDOM = new FormGroup({
      station: new FormControl(this.station.stationName, [
        Validators.required,
      ]),
      startDate: new FormControl(new Date(), [
        Validators.required,
      ]),
      duration: new FormControl(30, [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      startTime: new FormControl(new Date(), [
        Validators.required,
      ]),
      endTime: new FormControl(new Date(), [
        Validators.required,
      ]),
      maxMonthlyDeliveryDistribution: new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  onNew() {
    const startDate = moment(this.formDOM.get('startDate').value.getTime()).startOf('day');
    const endDate = moment(startDate).add(this.formDOM.get('duration').value, 'days').endOf('day');
    const startTime = moment(this.formDOM.get('startTime').value);
    const endTime = moment(this.formDOM.get('endTime').value);

    this._DeliveryDataService.createDeliveryWindow(
      this.station.getId(),
      this.formDOM.get('name').value,
      startDate.valueOf(),
      endDate.valueOf(),
      startTime.valueOf(),
      endTime.valueOf(),
      this.formDOM.get('maxMonthlyDeliveryDistribution').value,
    ).then((rs) => {
      if (rs) {
        this.onOk();
      }
    });
  }
}
