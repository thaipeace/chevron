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
import { SideBarService } from '@app/shared/services/side-bar.service';
import { DynamicItem } from '@app/shared/models/dynamic-item.class';
import { EditProductTypesComponent } from '@app/management/settings-management/edit-product-types/edit-product-types.component';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { CreateProductTypesComponent } from './create-product-types/create-product-types.component';
import { IQuestionDialogModel } from '@app/shared/models/dialog/question.dialog.model';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-types',
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.scss']
})
export class ProductTypesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'productCode', 'created', 'modified', 'actions'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  productTypes: any[] = [];
  datePipe: DatePipe = new DatePipe('en');
  selectedProductType: any = {};
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
    this.setProductTypes();

    this._SideBarService.refreshObservable.subscribe((res) => {
      if (res === 'productType') {
        this.onRefesh();
      }      
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setProductTypes() {
    let getProductTypesPayload = new Payload(PayloadsConstant.settings.listAllProducts, []);

    this.apiDataService.executeQuery(getProductTypesPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);

      this.productTypes = raw.APIResponse && raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Products.Product)
        : []

      this.tableData = new MatTableDataSource(this.productTypes);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['createDate', 'LastUpdated'];
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
    this.selectedProductType = Object.assign({}, row);
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
    this.setProductTypes();
    this._SideBarService.close();
  }

  openEdit() {
    this._SideBarService.open(new DynamicItem(EditProductTypesComponent, { productType: this.selectedProductType }));
  }

  onCreate() {
    const dialogRef = this._DialogService.open(CreateProductTypesComponent, {}, {disableClose: true});
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setProductTypes();
      }
    });
  }

  onDelete(row) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Do you want to delete this product type?`,
      onYes: () => {
        questionDialogRef.close();

        let exePayload = new Payload(PayloadsConstant.settings.deleteProduct, [row.ProductId]);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJson(res);
          let message;
          if (raw.ApIResponse.Status === 'success') {
            message = raw.ApIResponse.Message;
            this.onRefesh();
          } else {
            message = 'Delete product failed';
          }

          this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        }, error => {
          console.log('Loading error');
        });
      }
    };

    let questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

}
