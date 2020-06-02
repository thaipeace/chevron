import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { OrderDataService } from '@app/shared/services/data/order-data.service';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { WsService } from '@app/shared/services/ws.service';
import { NotificationDataService } from '@app/shared/services/data/notification-data.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';

@Component({
  selector: 'app-import-manual-ci-orders-dialog',
  templateUrl: './import-manual-ci-orders-dialog.component.html',
  styleUrls: ['./import-manual-ci-orders-dialog.component.scss']
})
export class ImportManualCiOrdersDialogComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  tmpFileInBase64: any = null;
  errors: string[];
  file: any;
  user;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImportManualCiOrdersDialogComponent>,
    private _orderDataService: OrderDataService,
    private _snackBar: MatSnackBar,
    private _wsService: WsService,
    private _notificationDataService: NotificationDataService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
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
    
    let exePayload = new Payload(PayloadsConstant.ORDER.ImportManualAndCNIOrders,
      [formData["Base64Data"]["value"]]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message = 'Upload failed';
      if (raw.APIResponse.Status === 'Success') {
        message = 'Upload successful';
        this.dialogRef.close('Uploaded');
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  onFileChange(fileInput: any) {
    let self = this;
    let fileTypes = ['xls', 'xlsx', 'csv'];
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

      self.file = { fileName: file.name, extension: extension };

      reader.readAsDataURL(file);
    }
  }

  triggerUploadFile($event: MouseEvent) {
    let el: HTMLElement = this.uploadInput.nativeElement;
    el.click();
  }

}
