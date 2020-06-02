import { Component, OnInit, Inject } from '@angular/core';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-fm-company-delete-dialog',
  templateUrl: './fm-company-delete-dialog.component.html',
  styleUrls: ['./fm-company-delete-dialog.component.scss']
})
export class FmCompanyDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FmCompanyDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TruckCompanyModel
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
