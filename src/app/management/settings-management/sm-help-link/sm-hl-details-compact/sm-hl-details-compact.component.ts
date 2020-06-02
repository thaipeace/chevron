import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { IDynamicComponent } from '@shared/models/dynamic-item.class';
import { SideBarControl } from '@shared/models/sidebar-control.class';
import { MatSnackBar } from '@angular/material';
import { SideBarService } from '@shared/services/side-bar.service';
import { ApiDataService } from '@shared/services/api-data.service';
import { DataUtilService } from '@shared/services/data-util.service';
import { DialogService } from '@shared/services/others/dialog.service';
import { PdfDialogComponent } from '@shared/components/dialogs/pdf-dialog/pdf-dialog.component';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-sm-hl-details-compact',
  templateUrl: './sm-hl-details-compact.component.html',
  styleUrls: ['./sm-hl-details-compact.component.scss']
})
export class SmHlDetailsCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {

  @Input() data;
  control: SideBarControl = null;
  promise;

  selectedLink: any = null;
  isEditing: boolean = false;

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

    this.selectedLink = this.data.link;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      this.selectedLink = this.data.link;
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
    let exePayload = new Payload(PayloadsConstant.HELP_LINK.UPDATE,
      [this.selectedLink.SysId, this.selectedLink.FileName, this.selectedLink.Key,
      this.selectedLink.Value, this.selectedLink.Description]
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

  testLink() {
    this.dataUtilService.checkUrl(this.selectedLink.Value);
    setTimeout(() => {
      if (this.dataUtilService.isLinkAvailable) {
        this.openInformationDialog(this.selectedLink.FileName, this.selectedLink.Value, this.selectedLink.Key);
      } else {
        this._snackBar.open('Help link not found', X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
    }, 1000);
  }

  private openInformationDialog(title, src, topRight) {
    // TODO need update when having api
    this._DialogService.open(PdfDialogComponent, {
      title: title,
      topRight: topRight,
      src: src
    });
  }

}
