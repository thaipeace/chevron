import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {MatSnackBar} from '@angular/material';
import {SideBarService} from '@shared/services/side-bar.service';
import {ApiDataService} from '@shared/services/api-data.service';
import {DataUtilService} from '@shared/services/data-util.service';
import {ParamsService} from '@shared/services/params.service';
import {DialogService} from '@shared/services/others/dialog.service';
import {PdfDialogComponent} from '@shared/components/dialogs/pdf-dialog/pdf-dialog.component';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-sm-hd-details-compact',
  templateUrl: './sm-hd-details-compact.component.html',
  styleUrls: ['./sm-hd-details-compact.component.scss']
})
export class SmHdDetailsCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedItem: any = null;
  isEditing: boolean = false;

  public fileInfor: any = null;
  public roles: any[] = [];
  public selectedRoles: any[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private _SideBarService: SideBarService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _DialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    if (this.data && this.data['control']) {
      this.control = this.data['control'];
    }

    this.selectedItem = this.data.document;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedItem = this.data.document;
    }
  }

  onCloseEditing(isRefresh?) {
    this._SideBarService.close();
    this.control.fn_close();

    if (isRefresh) {
      this._SideBarService.refresh();
    }
  }

  onUpdate() {
    let accessRolesQuery = this.buildAccessRolesQuery();
    let exePayload = new Payload(PayloadsConstant.HELP_DOCUMENT.UPDATE,
      [this.selectedItem.HelpDocumentId, accessRolesQuery.join('')]
    );
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      let message;
      if (raw.APIResponse.Status === 'Success') {
        message = raw.APIResponse.Message;
        this.onCloseEditing(true);
      }
      this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
    }, error => {
      console.log('Loading error');
    });

  }

  doCancel() {
    this.isEditing = false;
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
