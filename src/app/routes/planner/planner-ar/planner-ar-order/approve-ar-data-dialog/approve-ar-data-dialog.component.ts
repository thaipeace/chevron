import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-approve-ar-data-dialog',
  templateUrl: './approve-ar-data-dialog.component.html',
  styleUrls: ['./approve-ar-data-dialog.component.scss']
})
export class ApproveARDataDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApproveARDataDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close('Cancel');
  }

  submit() {
    this.dialogRef.close('Submit');
  }
}
