import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-nm-list-dialog',
  templateUrl: './nm-list-dialog.component.html',
  styleUrls: ['./nm-list-dialog.component.scss']
})
export class NmListDialogComponent implements OnInit {
  readonly: boolean = true;
  otherOptions: any;

  constructor(public dialogRef: MatDialogRef<NmListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.readonly = data['readonly'] || this.readonly;
    this.otherOptions = data['otherOptions'];
  }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
