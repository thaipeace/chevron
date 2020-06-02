import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { EditBaseProductTypesComponent } from '@app/management/settings-management/edit-base-product-types/edit-base-product-types.component';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { CreateBaseProductTypesComponent } from './create-base-product-types/create-base-product-types.component';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base-product-types',
  templateUrl: './base-product-types.component.html',
  styleUrls: ['./base-product-types.component.scss']
})
export class BaseProductTypesComponent implements OnInit, OnDestroy {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'productCode', 'created', 'modified', 'actions'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;
  selectedItem: any;

  baseProductTypes: any[] = [];
  datePipe: DatePipe = new DatePipe('en');
  private unsubscribe$ = new Subject();

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
    this.setBaseProductTypes();

    this._SideBarService.refreshObservable.subscribe((res) => {
      if (res === 'baseProductType') {
        this.onRefesh();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setBaseProductTypes() {
    let listAllBaseProductsPayload = new Payload(PayloadsConstant.settings.listAllBaseProducts, []);

    this.apiDataService.executeQuery(listAllBaseProductsPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);

      this.baseProductTypes = raw.APIResponse.Status === 'Success' && raw.APIResponse.BaseProducts
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.BaseProducts.BaseProduct)
        : []

      this.tableData = new MatTableDataSource(this.baseProductTypes);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['Created', 'Updated'];
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
    this.selectedRowIndex = row.id;
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
    this.setBaseProductTypes();
    this._SideBarService.close();
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this base product type?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.settings.deleteBaseProduct, [row.BaseProductId]);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message;
          if (raw.APIResponse.Status === 'success') {
            message = raw.APIResponse.Message;
            this.onRefesh();
          } else {
            message = 'Delete base product failed';
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
    this._SideBarService.open(new DynamicItem(EditBaseProductTypesComponent, { baseProductType: this.selectedItem }));
  }

  onCreate() {
    const dialogRef = this._DialogService.open(CreateBaseProductTypesComponent, {}, {disableClose: true});

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setBaseProductTypes();
      }
    });
  }
}
