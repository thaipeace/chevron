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

@Component({
  selector: 'app-sm-hl-list',
  templateUrl: './sm-hl-list.component.html',
  styleUrls: ['./sm-hl-list.component.scss']
})
export class SmHlListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'name', 'key', 'value', 'created', 'modified', 'action'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  links: any[] = [];
  selectedLink: any;
  datePipe: DatePipe = new DatePipe('en');

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _SideBarService: SideBarService,
    private _DialogService: DialogService,
    private _snackBar: MatSnackBar
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    this.setLinks();

    this._SideBarService.statusObservable.subscribe((res) => {
      if (!res.status) {
        this.clearHighLightRow();
      }
    });

    this._SideBarService.refreshObservable.subscribe((res) => {
      if (res) {
        this.onRefesh();
      }
    });
  }

  setLinks() {
    let exePayload = new Payload(PayloadsConstant.HELP_LINK.LIST,  []);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);

      this.links = raw.APIResponse && raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.HelpLinks.HelpLink)
        : []

      this.tableData = new MatTableDataSource(this.links);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['Created', 'Modified'];
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
    this.selectedLink = Object.assign({}, row);
    this.openEdit();
  }

  highlightRow(row) {
    this.selectedRowIndex = row.SysId;
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
    this.setLinks();
  }

  openEdit() {
    this._SideBarService.open(new DynamicItem(SmHlDetailsCompactComponent, {link: this.selectedLink}));
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this help link ?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.HELP_LINK.DELETE, [row.SysId]);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message;
          if (raw.APIResponse.Status === 'Success') {
            message = raw.APIResponse.Message;
            this.onRefesh();
          } else {
            message = 'Delete help link failed';
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  onNew() {
    const dialogRef = this._DialogService.open(SmHlNewDialogComponent, {}, {disableClose: true});

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setLinks();
      }
    });
  }

  onPaginationChange() {
    this._SideBarService.close();
  }
}
