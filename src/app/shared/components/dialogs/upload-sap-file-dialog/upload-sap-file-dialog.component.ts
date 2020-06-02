import {Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {OrderDataService} from '@app/shared/services/data/order-data.service';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';
import {WsService} from '@app/shared/services/ws.service';
import {NotificationDataService} from '@app/shared/services/data/notification-data.service';

@Component({
  selector: 'app-upload-sap-file-dialog',
  templateUrl: './upload-sap-file-dialog.component.html',
  styleUrls: ['./upload-sap-file-dialog.component.scss']
})
export class UploadSapFileDialogComponent implements OnInit {
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  tmpFileInBase64: any = null;
  errors: string[];
  file: any;
  user;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UploadSapFileDialogComponent>,
              private _orderDataService: OrderDataService,
              private _snackBar: MatSnackBar,
              private _wsService: WsService,
              private _notificationDataService: NotificationDataService
  ) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close('Cancel');
  }

  submit() {
    const formData = new TQLFormData();
    formData.setValue('Base64Data', this.tmpFileInBase64);
    formData.setValue('filename', this.file.fileName);
    formData.setValue('extension', this.file.extension);
    this._wsService.setSAPProcessingStatus(true);
    this._orderDataService.uploadSAPFile(formData).then((rs) => {
      this._snackBar.open('Upload file successfully!', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});

    }).finally(() => {
      this._wsService.setSAPProcessingStatus(false);
      this._notificationDataService.findAll(10);
      this.dialogRef.close('Uploaded');
      this.tmpFileInBase64 = null;
      this.file = null;
    });
  }

  onFileChange(fileInput: any) {
    let self = this;
    let fileTypes = ['xls', 'xlsx'];
    self.errors = [];
    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let extension = file.name.split('.').pop().toLowerCase();

      if (fileTypes.indexOf(extension) < 0) {
        self.errors.push('Only accept file types: ' + fileTypes.toString());
        self.file = null;
        return;
      }

      if (file.size >= 716800) {
        self.errors.push('Maximum file size is 700KB');
        return;
      }

      self.errors = [];

      var reader = new FileReader();

      reader.onload = function (e: any) {
        self.tmpFileInBase64 = e.target.result.split(',')[1];
      };

      self.file = {fileName: file.name, extension: extension};

      reader.readAsDataURL(file);
    }
  }

  triggerUploadFile($event: MouseEvent) {
    let el: HTMLElement = this.uploadInput.nativeElement;
    el.click();
  }
}
