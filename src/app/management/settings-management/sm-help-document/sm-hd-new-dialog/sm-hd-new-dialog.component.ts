import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { RoleService } from '@app/user-management/shared/services';

@Component({
  selector: 'app-sm-hd-new-dialog',
  templateUrl: './sm-hd-new-dialog.component.html',
  styleUrls: ['./sm-hd-new-dialog.component.scss']
})
export class SmHdNewDialogComponent implements OnInit {

  public selectedItem: any = {};
  public fileInfor: any = null;
  public roles: any[] = [];
  public selectedRoles: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmHdNewDialogComponent>,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar,
    private _RoleService: RoleService
  ) {
    
  }

  ngOnInit() {
    this._RoleService.loadAll().then((rs) => {
      console.log(rs);
      this.roles = this._RoleService.roleLabelFormat(rs);
      this.roles = this.roles.map(r => r._data);
      console.log(this.roles);
    });
  }

  onCreate() {
    let accessRolesQuery = this.buildAccessRolesQuery();
    let exePayload = new Payload(PayloadsConstant.HELP_DOCUMENT.CREATE,
      [this.selectedItem.name, this.fileInfor.metaData.lastModified, this.fileInfor.metaData.size,
        this.fileInfor.metaData.type.includes('pdf') ? 'PDF' : this.fileInfor.metaData.type, 
        accessRolesQuery.join(''), this.fileInfor.source]
    );

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      let message = raw.APIResponse.Message;
      if (raw.APIResponse.Status === 'Success') {
        this.onCancelAndUpdate();
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCancelAndUpdate() {
    this.dialogRef.close(true);
  }

  onFileUploaded($event) {
    this.fileInfor = $event;
  }

  buildAccessRolesQuery() {
    return this.selectedRoles.map(sr => {
      return `<RoleID>${sr.sysId}</RoleID>`;
    })
  }

  onSelectedRolesChange($event) {
    this.selectedRoles = $event;
  }
}
