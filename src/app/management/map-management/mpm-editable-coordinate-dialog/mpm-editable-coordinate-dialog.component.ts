import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';

@Component({
  selector: 'app-mpm-editable-coordinate-dialog',
  templateUrl: './mpm-editable-coordinate-dialog.component.html',
  styleUrls: ['./mpm-editable-coordinate-dialog.component.scss']
})
export class MpmEditableCoordinateDialogComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH = '90vw';
  object: ICoordinateModel;
  geoLocations: GeoPoint[];
  onChange: Function;
  readonly: boolean = true;
  drawable: boolean = true;
  maxPoint: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MpmEditableCoordinateDialogComponent>,
  ) {
    super(dialogRef);
    if (data) {
      if (data.object) {
        this.object = data.object;
        this.geoLocations = this.object.coordinates;
      }
      if (this.data.onChange) {
        this.onChange = this.data.onChange;
      }
      if (this.data.points) {
        this.geoLocations = this.data.points;
      }
      if (this.data.maxPoint) {
        this.maxPoint = this.data.maxPoint;
      }
      if (typeof this.data.drawable !== 'undefined') {
        this.drawable = this.data.drawable;
      }
      if (typeof this.data.readonly !== 'undefined') {
        this.readonly = this.data.readonly;
      }
    }
  }

  ngOnInit() {
  }

  onTableChange($event: GeoPoint[]) {
    this.geoLocations = $event;
    // this.object.coordinates = this.geoLocations;
    // this.object = Object.assign({}, this.object);
  }

  onMapCoordinateChange($event: any) {
    console.log($event);
    // this.object = $event;
    this.geoLocations = $event.coordinates;
  }

  onUpdate() {
    // console.log(this.geoLocations);
    this.onChange(this.geoLocations);
    this.onOk();
  }
}
