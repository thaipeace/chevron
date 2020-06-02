import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';

@Component({
  selector: 'app-message-question-dialog',
  templateUrl: './message-question-dialog.component.html',
  styleUrls: ['./message-question-dialog.component.scss']
})
export class MessageQuestionDialogComponent implements OnInit {
  type;

  constructor(
    public dialogRef: MatDialogRef<MessageQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IQuestionDialogModel
  ) {
    this.type = data.type;
  }

  ngOnInit() {
  }

  onYes() {
    if (!!this.data && !!this.data.onYes) {
      this.data.onYes();
    }
    this.dialogRef.close();
  }

  onNo() {
    if (!!this.data && !!this.data.onNo) {
      this.data.onNo();
    }
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
