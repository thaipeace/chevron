import { Component, OnInit, Inject } from '@angular/core';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-fm-truck-delete-dialog',
  templateUrl: './fm-truck-delete-dialog.component.html',
  styleUrls: ['./fm-truck-delete-dialog.component.scss']
})
export class FmTruckDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FmTruckDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TruckModel
  ) { }

  ngOnInit() {
  }

  onSaveClick() {
    this.dialogRef.close(true);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
