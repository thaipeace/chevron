import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IDialogModel} from '@shared/services/others/dialog.service';
import {DefaultDialogComponent} from '@shared/models/default/default-component.model';

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent extends DefaultDialogComponent implements OnInit {
  static DEFAULT_WIDTH = 250;
  title: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogModel
  ) {
    super(dialogRef);
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }
}
