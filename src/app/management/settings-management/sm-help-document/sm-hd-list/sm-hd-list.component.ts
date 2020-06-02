import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ApiDataService} from '@shared/services/api-data.service';
import {DataUtilService} from '@shared/services/data-util.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {debounceTime} from 'rxjs/operators';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {SmHlDetailsCompactComponent} from '@management/settings-management/sm-help-link/sm-hl-details-compact/sm-hl-details-compact.component';
import {DialogService} from '@shared/services/others/dialog.service';
import {SmHlNewDialogComponent} from '@management/settings-management/sm-help-link/sm-hl-new-dialog/sm-hl-new-dialog.component';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { Payload } from '@app/shared/models/payload';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { SmHdDetailsCompactComponent } from '../sm-hd-details-compact/sm-hd-details-compact.component';
import { SmHdNewDialogComponent } from '../sm-hd-new-dialog/sm-hd-new-dialog.component';
import { AuthenticationService } from '@app/user-management/shared/services';

@Component({
  selector: 'app-sm-hd-list',
  templateUrl: './sm-hd-list.component.html',
  styleUrls: ['./sm-hd-list.component.scss']
})
export class SmHdListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'fileName', 'fileDate', 'fileSize', 'fileKind', 'created', 'modified', 'actions'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  links: any[] = [];
  selectedDocument: any;
  datePipe: DatePipe = new DatePipe('en');

  user: any = null;

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _SideBarService: SideBarService,
    private _DialogService: DialogService,
    private _snackBar: MatSnackBar,
    private _AuthenticationService: AuthenticationService,
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    this._AuthenticationService.loginedUserObservable.subscribe((user) => {
      this.user = user;
      this.setDocuments();
    });

    this._SideBarService.refreshObservable.subscribe((res) => {
      this.onRefesh();
    });
  }

  setDocuments() {
    let exePayload = new Payload(PayloadsConstant.HELP_DOCUMENT.LIST,  [this.user._data.sysId]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);

      this.links = raw.APIResponse && raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.HelpDocuments.HelpDocument)
        : []

      this.tableData = new MatTableDataSource(this.links);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['fileDate', 'Created', 'Modified'];
      this.tableData.filterPredicate = (data: any, filter: string) => {
        let reFormatValues = [];
        dateFormatedArr.forEach(d => {
          if (data[d] && data[d] !== 'NA') {
            reFormatValues.push(this.datePipe.transform(data[d], 'yyyy-MM-dd (HH:mm)'));
          }
        });

        return reFormatValues.some(v => v.includes(filter)) || defaultPredicate(data, filter);
      };

      this.tableData.sort = this.sort;
      this.tableData.paginator = this.paginator;
    }, error => {
      console.log('Loading error');
    });
  }

  onClickRow(row) {
    this.highlightRow(row);
    this.selectedDocument = Object.assign({}, row);
    this.openEdit();
  }

  highlightRow(row) {
    this.selectedRowIndex = row.HelpDocumentId;
  }

  clearHighLightRow() {
    this.selectedRowIndex = -1;
  }

  applyFilter(filterValue: string = '') {
    this.clearHighLightRow();
    filterValue = filterValue.trim().toLowerCase();
    this.tableData.filter = filterValue;
  }

  onRefesh() {
    this.tableData = null;
    this._SideBarService.close();
    this.setDocuments();
  }

  openEdit() {
    this._SideBarService.open(new DynamicItem(SmHdDetailsCompactComponent, {document: this.selectedDocument}));
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this help document ?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.HELP_DOCUMENT.DELETE, [row.HelpDocumentId]);
        this.apiDataService.executeQuery(exePayload).subscribe(async (res) => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message;
          if (raw.APIResponse.Status === 'Success') {
            message = raw.APIResponse.Message;
            await this.onDeleteRolesRef(row).toPromise();
            this.onRefesh();
          } else {
            message = 'Delete help document failed';
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  onDeleteRolesRef(row) {
    let exePayload = new Payload(PayloadsConstant.HELP_DOCUMENT.DELETE_ROLES_REF, [row.HelpDocumentId]);
    return this.apiDataService.executeQuery(exePayload);
  }

  onNew() {
    const dialogRef = this._DialogService.open(SmHdNewDialogComponent, {}, {disableClose: true});
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setDocuments();
      }
    });
  }

  onPaginationChange() {
    this._SideBarService.close();
  }
}
