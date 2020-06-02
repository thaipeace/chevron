import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import {UserService, AuthenticationService} from '@app/user-management/shared/services';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  tmpAvatar: any = null;
  currentAvatar: any = null;
  errors: string[];
  user;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UploadAvatarComponent>,
              public authenService: AuthenticationService,
              private _authenService: AuthenticationService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
  ) {
    this.user = this.data.user;
  }

  ngOnInit() {
    this._authenService.dpUserObservable.subscribe((image: string) => {
      if (!!image) {
        this.tmpAvatar = `data:image/png;base64,${image}`;
        this.currentAvatar = `data:image/png;base64,${image}`;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  submit() {
    const formData = new TQLFormData();
    formData.setValue('username', this.user.userName);
    formData.setValue('code', this.tmpAvatar.split(',')[1]);

    this.userService.updateDP(formData).then((rs) => {
      this.authenService.fetchDP();
      this._snackBar.open('User avatar is uploaded!', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
      this.dialogRef.close(true);
    });
    // return false;
  }

  onFileChange(fileInput: any) {
    let self = this;
    let fileTypes = ['jpg', 'jpeg', 'png'];
    self.errors = [];
    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let extension = file.name.split('.').pop().toLowerCase();  //file extension from input file

      if (fileTypes.indexOf(extension) < 0) {
        self.errors.push('Only accept file types: ' + fileTypes.toString());
        return;
      }

      if (file.size >= 716800) {
        self.errors.push('Maximum file size is 700KB');
        return;
      }

      var reader = new FileReader();

      reader.onload = function (e: any) {
        self.tmpAvatar = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  triggerUploadFile($event: MouseEvent) {
    let el: HTMLElement = this.uploadInput.nativeElement;
    el.click();
  }
}
