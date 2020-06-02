import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  IDialogComponent,
  staticImplements
} from "@shared/models/default/default-component.model";
import { FmDriverDetailsComponent } from "../fm-driver-details/fm-driver-details.component";

@Component({
  selector: "app-fm-driver-details-dialog",
  templateUrl: "./fm-driver-details-dialog.component.html",
  styleUrls: ["./fm-driver-details-dialog.component.scss"]
})
@staticImplements<IDialogComponent>()
export class FmDriverDetailsDialogComponent {
  static DEFAULT_WIDTH: number = 1300;
  readonly;
  id;
  index;
  edit = false;
  driverId;
  chevronDriverId;
  showEdit = true;
  @ViewChild(FmDriverDetailsComponent) _component: FmDriverDetailsComponent;

  constructor(
    public dialogRef: MatDialogRef<FmDriverDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.chevronDriverId = data.driverId;
    this.index = data.index;
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
}
