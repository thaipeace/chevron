import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {TQLFormData} from '@shared/models/default/default-object.model';
import {AlertMailModel} from '@shared/models/data.models/alert-mail.model';
import {NgForm, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '@app/user-management/shared/services';
import {MicsDataService} from '@shared/services/others/mics-data.service';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';
import {noWhitespaceValidator} from '@shared/validators/no-white-spaces';

@Component({
    selector: 'app-system-help-dialog',
    templateUrl: './system-help-dialog.component.html',
    styleUrls: ['./system-help-dialog.component.scss']
})
export class SystemHelpDialogComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    formData: TQLFormData;
    rfMessage: FormGroup;
    username;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<SystemHelpDialogComponent>,
                private _snackBar: MatSnackBar,
                private _MicsDataService: MicsDataService,
                private _AuthenticationService: AuthenticationService) {
        this._AuthenticationService.loginedUserObservable
            .subscribe((user) => {
                if (user) {
                    this.username = user.username;
                }
            });
    }

    ngOnInit() {
        this.rfMessage = new FormGroup({
            subject: new FormControl('', [
                Validators.required,
                noWhitespaceValidator
            ]),
            message: new FormControl('', [
                Validators.required,
                noWhitespaceValidator
            ])
        });
        this.formData = AlertMailModel.getFormData();
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    onSubmit() {
        this._MicsDataService.sendAlertMessage(this.username, this.rfMessage.get('subject').value, this.rfMessage.get('message').value)
            .then((rs) => {
                if (rs['data']) {
                    const message = `${rs['data']['Status']}! ${rs['data']['Message']}`;
                    this._snackBar.open(message.trim(),
                        X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
                    this.onCancel();
                }
            });
    }

}
