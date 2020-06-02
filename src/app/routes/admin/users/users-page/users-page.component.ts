import {Component, OnInit, ViewChild} from '@angular/core';
import {UserManagementModel} from '@shared/models/data.models/user-management.model';
import {UserService, RoleService} from '@app/user-management/shared/services';
import {TQLFormData} from '@shared/models/default/default-object.model';
import {RoleModel} from '@app/user-management/shared/models/data.models/role.model';
import {MatSnackBar} from '@angular/material';
import {MessageQuestionDialogComponent} from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {X_BUTTON, NOTIFICATION_DEFAULT_DURARION} from '@shared/constants/value.constant';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';
import {UmNewComponent} from '@management/user-management/um-new/um-new.component';
import {DialogService} from '@shared/services/others/dialog.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  users: UserManagementModel[];
  roles: RoleModel[];
  selectedUser: UserManagementModel;

  constructor(
    private _userService: UserService,
    private _roleService: RoleService,
    private _snackBar: MatSnackBar,
    private _DialogService: DialogService) {
  }

  ngOnInit() {
    this._roleService.loadAll().then(rs => {
      this.roles = this._roleService.roleLabelFormat(rs);
      this.roles = rs;
      this._refreshList();
    });
  }

  private _refreshList() {
    this._userService.loadAll().then(rs => {
      this.users = rs;
      _.map(this.users, (user: UserManagementModel) => {
        user.roleName = _.find(this.roles, (role: RoleModel) => role.getId() === user.roleId).name;
      });
    });
  }

  refreshData() {
    this._refreshList();
  }

  newUserClicked() {
    // this.isShowCreateUser = true;
    this.selectedUser = null;
    const newUserDialogRef = this._DialogService.open(UmNewComponent, {
      userDetail: this.selectedUser,
      roles: this.roles,
      autofocus: false
    });

    newUserDialogRef.afterClosed().subscribe(rs => {
      if (rs) {
        this._refreshList();
      }
    });
  }

  onEditUser(user) {
    this.selectedUser = user;
    const newUserDialogRef = this._DialogService.open(UmNewComponent, {
      userDetail: this.selectedUser,
      roles: this.roles
    });

    newUserDialogRef.afterClosed().subscribe(rs => {
      if (rs) {
        this._refreshList();
      }
    });
  }

  onResetPasword(user) {
    const dialogData: IQuestionDialogModel = {
      title: 'Reset password',
      question: `Do you want to reset password of this user?`,
      onYes: () => {
        const updateObj = new TQLFormData();
        updateObj.setValue('userName', user.userName);
        this._userService.resetPassword(updateObj).then(rs => {
          let message = '';
          if (rs && rs.length > 1 && rs[1]['Auth']['Status'] === 'Success') {
            message = `Password reset successfully.`;
            this._refreshList();
            questionDialogRef.close();
          } else {
            message = `There are problems in reseting this user's password.`;
          }
          this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        }).catch(error => {
          this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        });
      }
    };
    const questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent,
      dialogData
    );
  }

  onDeleteUser(user) {
    const dialogData: IQuestionDialogModel = {
      title: 'Delete user',
      question: `Do you want to delete this user?`,
      onYes: () => {
        const updateObj = new TQLFormData();
        updateObj.setValue('userName', user.userName);
        this._userService.delete(updateObj)
          .then(rs => {
            let message = '';
            if (rs && rs.length > 1 && rs[1]['Status'] === 'User Deleted Successfully') {
              message = `User Deleted Successfully.`;
              this._refreshList();
              questionDialogRef.close();
            } else {
              message = `There are problems in deleting this user.`;
            }
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }).catch(error => {
          this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        });
      }
    };
    const questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent,
      dialogData
    );
  }

  onLockUser(user: UserManagementModel) {
    const dialogData: IQuestionDialogModel = {
      title: 'Lock user',
      question: `Do you want to lock this user?`,
      onYes: () => {
        this._userService.lockUnlockUser(user.getId(), true)
          .then((rs) => {
            let message = '';
            if (rs && rs.length > 1 && rs[1]['Save']['Status'] === 'Success') {
              message = `${user.fullName} is locked`;
              this._refreshList();
              questionDialogRef.close();
            } else {
              message = `There are problems in locking this user.`;
            }
            this._refreshList();
            this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
          }).catch(error => {
          this._snackBar.open(error, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
        });
      }
    };
    const questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent,
      dialogData
    );
  }

  onUnlockUser(user: UserManagementModel) {
    this._userService.lockUnlockUser(user.getId(), false).then(() => {
      this._refreshList();
      this._snackBar.open(`${user.fullName} is unlocked`, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    });
  }

  /*  updateUserSuccess() {
      this._refreshList();
    }*/
}
