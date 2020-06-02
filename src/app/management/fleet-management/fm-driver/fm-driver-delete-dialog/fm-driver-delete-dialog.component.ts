import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DriverModel } from '@shared/models/data.models/fleet/driver.model';

@Component({
  selector: 'app-fm-driver-delete-dialog',
  templateUrl: './fm-driver-delete-dialog.component.html',
  styleUrls: ['./fm-driver-delete-dialog.component.scss']
})
export class FmDriverDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FmDriverDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverModel
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
