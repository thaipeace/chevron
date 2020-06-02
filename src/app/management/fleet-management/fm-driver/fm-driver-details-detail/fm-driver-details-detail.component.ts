import { Component, OnInit, Input, Inject, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { DriverModel } from '@shared/models/data.models/fleet/driver.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { DriverDataService } from '@shared/services/data/driver-data.service';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@shared/constants/value.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/user-management/shared/services';
import { FmTreeviewLoadingService } from '@app/shared/services/fm-treeview-loading.service';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { emailValidator } from '@app/shared/validators/email';
import { telPhoneValidator } from '@app/shared/validators/telPhone';

@Component({
  selector: 'app-fm-driver-details-detail',
  templateUrl: './fm-driver-details-detail.component.html',
  styleUrls: ['./fm-driver-details-detail.component.scss']
})
export class FmDriverDetailsDetailComponent implements OnChanges {

  @Input() id;
  @Input() index = 0;
  @Input() readonly = true;
  @Input() chevronDriverId = true;
  @Input() popupEdit = false;
  @Output() showEdit = new EventEmitter();
  @Output() refresh = new EventEmitter();

  object: DriverModel;
  errors: string[];
  downloadLink: string = '';
  driverForm: FormGroup;
  edit = false;
  keys = ['fullName', 'driverLicenceNumber', 'address', 'contactNumber', 'terminalPassExpiryDate'];

  constructor(
    private _DriverDataService: DriverDataService,
    private _authenService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {
    this.driverForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      driverLicenceNumber: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      address: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        emailValidator,
        valueSafeValidator
      ]),
      contactNumber: new FormControl('', [Validators.required, noWhitespaceValidator, telPhoneValidator]),
      terminalPassExpiryDate: new FormControl('', [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { id, index } = changes;
    this.edit = false;

    if (!!id && !!id.currentValue) {
      this.loadDetails();
    }
  }

  loadForm() {
    this.keys.forEach(key => this.driverForm.get(key).setValue(this.object[key]));
  }

  loadDetails() {
    this._DriverDataService.findById(this.id).then(rs => {
      this.object = rs;
      this.loadForm();
      this.downloadLink = this.object.getValue('downloadLink');
    });
  }

  onFileChange(fileInput: any) {
    const self = this;
    self.errors = [];
    let fileTypes = ['pdf'];

    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let extension = file.name
        .split('.')
        .pop()
        .toLowerCase(); // file extension from input file

      if (fileTypes.indexOf(extension) < 0) {
        self.errors.push('Only accept file types: ' + fileTypes.toString());
        return;
      }

      if (file.size >= 716800) {
        self.errors.push('Maximum file size is 700KB');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e: any) {
        self.uploadFile(e.target.result.split(',')[1], self.object.chevronDriverId);
      };
    }
  }

  uploadFile(file: string, chevronDriverId: string) {
    const formData = new TQLFormData();
    formData.setValue('Base64Data', file);
    formData.setValue('chevronDriverId', chevronDriverId);
    this._DriverDataService.uploadDriverDoc(formData).then(rs => {
      this._snackBar.open(rs[1].Response, X_BUTTON, {
        duration: NOTIFICATION_DEFAULT_DURARION
      });
      this.loadDetails();
    });
  }

  onDownload() {
    if (window) {
      window.open(this.downloadLink, '_blank');
    }
  }

  onSave() {
    const formData = DriverModel.getFormData(); // data for update
    formData.updateValues(this.object._data);

    if (this.driverForm.valid) {
      this.keys.forEach(key => formData.setValue(key, this.driverForm.get(key).value));

      this._DriverDataService.update(this.id, formData, this._authenService.getUsername()).then(rs => {
        if (rs && rs[1] && rs[1]['Update']['Status'] === 'Success') {
          this.edit = false;
          this.loadDetails();
          const message = `Updated successfully`;
          this._snackBar.open(message, X_BUTTON, {
            duration: NOTIFICATION_DEFAULT_DURARION
          });
        } else {
          if (rs && rs[1] && rs[1]['Update']['Message']) {
            const message = rs[1]['Update']['Message'];
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          } else {
            const message = `There are some problems. Please try again!`;
            this._snackBar.open(message, X_BUTTON, {
              duration: NOTIFICATION_DEFAULT_DURARION
            });
          }
        }
      });
    } else {
      const message = `There are some problems. Please try again!`;
      this._snackBar.open(message, X_BUTTON, {
        duration: NOTIFICATION_DEFAULT_DURARION
      });
    }
  }

  onEdit() {
    this.edit = true;
  }

  onCancelEdit() {
    this.loadForm();
    this.edit = false;
  }
}
