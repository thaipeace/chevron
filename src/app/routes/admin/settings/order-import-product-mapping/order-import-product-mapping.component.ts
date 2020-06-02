import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { DatePipe } from '@angular/common';
import { DynamicItem } from '@app/shared/models/dynamic-item.class';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { CreateOrderImportProductMappingComponent } from './create-order-import-product-mapping/create-order-import-product-mapping.component';
import { EditOrderImportProductMappingComponent } from '@app/management/settings-management/edit-order-import-product-mapping/edit-order-import-product-mapping.component';

@Component({
  selector: 'app-order-import-product-mapping',
  templateUrl: './order-import-product-mapping.component.html',
  styleUrls: ['./order-import-product-mapping.component.scss']
})
export class OrderImportProductMappingComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'inputProductName', 'ATMOSProductName', 'created', 'modified', 'actions'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRow: any;;
  selectedItem: any;

  importMappings: any[] = [];
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
    this.setImportMappings();

    this._SideBarService.statusObservable.subscribe((rs) => {
      if (this._SideBarService.isClose(rs)) {
        this.selectedRow = null;
      }
    })

    this._SideBarService.refreshObservable.subscribe((res) => {
      if (res === 'orderImportProductMapping') {
        this.onRefesh();
      }
    });
  }

  setImportMappings() {
    let exePayload = new Payload(PayloadsConstant.settings.orderImportProductMapping.list, []);

    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this.importMappings = raw.Find.Status === 'Success'
        ? this.dataUtilService.wrapToArrayRemoveParent(raw.Find.Result, 'SAPAtmosProductMapping')
        : []

      this.tableData = new MatTableDataSource(this.importMappings);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['createDate', 'lastUpdated'];
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
    this.selectedItem = Object.assign({}, row);
    this.openEdit();
  }

  highlightRow(row) {
    this.selectedRow = row;
  }

  clearHighLightRow() {
    this.selectedRow = null;
  }

  applyFilter(filterValue: string = '') {
    this.clearHighLightRow();
    filterValue = filterValue.trim().toLowerCase();
    this.tableData.filter = filterValue;
  }

  onRefesh() {
    this.setImportMappings();
    this._SideBarService.close();
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this Order Import Product Mapping?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.settings.orderImportProductMapping.delete,
          [row.sysId]
        );
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
          let message = `Delete failed`;
          if (raw.DeleteAll.Status === "Success") {
            message = `Delete succesfully`;
            this.onRefesh();
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

  openEdit() {
    this._SideBarService.open(new DynamicItem(EditOrderImportProductMappingComponent, { item: this.selectedItem }));
  }

  onCreate() {
    const dialogRef = this._DialogService.open(CreateOrderImportProductMappingComponent, {}, { disableClose: true });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setImportMappings();
      }
    });
  }

  handlePage(e: any) {
    let currentTableItems = this.getCurrentItems(this.tableData, e);
    if (currentTableItems.some(c => c.sysId === this.selectedRow.sysId)) return;
    this._SideBarService.close();
  }

  getCurrentItems(tableData, page) {
    let list = tableData.data;
    let min = page.pageSize*(page.pageIndex);
    let max = page.pageSize*(page.pageIndex + 1);
    return list.filter((l, i) => i<max && i>=min);
  }
}
