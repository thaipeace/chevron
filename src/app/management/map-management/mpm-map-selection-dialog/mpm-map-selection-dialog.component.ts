import {Component, Inject, OnInit} from '@angular/core';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';
import {FleetBaseModel} from '@shared/models/data.models/terminal/fleet-base.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GeoPoint} from '@shared/models/geo-point.model';
import * as _ from 'lodash';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import { StationModel } from '@app/shared/models/data.models/station/station.model';

@Component({
  selector: 'app-mpm-map-selection-dialog',
  templateUrl: './mpm-map-selection-dialog.component.html',
  styleUrls: ['./mpm-map-selection-dialog.component.scss']
})
export class MpmMapSelectionDialogComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH = '90vw';
  groups: ICoordinateModel[] = [];
  boundPoints: GeoPoint[];
  isNotBorder: boolean = false;
  stations: StationModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MpmMapSelectionDialogComponent>,
  ) {
    super(dialogRef);
    if (data) {
      if (data.groups) {
        if (data.isNotBorder) {
          this.isNotBorder = data.isNotBorder;
          this.stations = data.stations;
          console.log(this.stations);
          console.log(this.groups);
        }
        
        this.groups = data.groups;
        this.boundPoints = [];
        _.map(this.groups, (el) => {
          this.boundPoints = this.boundPoints.concat(el.coordinates.slice());
        });
      }
    }
  }

  ngOnInit() {
  }

  setBound(item) {
    this.boundPoints = null;
    setTimeout(() => {
      this.boundPoints = this.isNotBorder ? [item.geoPoint] : item.coordinates.slice();
    });
  }
}
