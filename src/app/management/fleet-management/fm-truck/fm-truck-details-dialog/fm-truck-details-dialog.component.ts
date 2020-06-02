import {Component, Inject, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {FmTruckDetailsComponent} from '../fm-truck-details/fm-truck-details.component';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';

// import {TruckModel} from '@shared/models/data.models/fleet/truck.model';

@Component({
  selector: 'app-fm-truck-details-dialog',
  templateUrl: './fm-truck-details-dialog.component.html',
  styleUrls: ['./fm-truck-details-dialog.component.scss']
})
export class FmTruckDetailsDialogComponent implements OnInit, AfterViewInit {
  static DEFAULT_WIDTH: number = 1200;
  @ViewChild(FmTruckDetailsComponent) _component: FmTruckDetailsComponent;
  readonly;
  edit = false;
  id;
  showEdit = true;
  truck: TruckModel;


  constructor(
    public dialogRef: MatDialogRef<FmTruckDetailsDialogComponent>,
    private _TruckDataService: TruckDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSave() {
    this._component.onSave();
    this.edit = false;
  }

  onEdit() {
    this._component.onEdit();
    this.edit = true;
  }

  onCancelEdit() {
    this._component.onCancelEdit();
    this.edit = false;
  }

  setTruckDetails($event: any) {
    this.truck = $event;
  }
}
