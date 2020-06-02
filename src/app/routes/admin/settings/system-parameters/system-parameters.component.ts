import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { SideBarService } from '@app/shared/services/side-bar.service';
import { DynamicItem } from '@app/shared/models/dynamic-item.class';
import { EditSystemParametersComponent } from '@app/management/settings-management/edit-system-parameters/edit-system-parameters.component';
import { FormControl } from '@angular/forms';
import { ParamsService } from '@app/shared/services/params.service';
import { DatePipe } from '@angular/common';
// import { AlertService } from '@app/shared/services/alert.service';
// import { ParamsService } from '@app/shared/services/params.service';

@Component({
  selector: 'app-system-parameters',
  templateUrl: './system-parameters.component.html',
  styleUrls: ['./system-parameters.component.scss']
})
export class SystemParametersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;
  displayedColumns = ['#', 'name', 'category', 'keyType', 'key', 'valueType', 'value', 'created', 'modified'];
  isShowEditParam: boolean = false;
  inputSearch: string;
  selectedRowIndex: number = -1;
  isEditing: boolean = false;
  params: any[] = [];
  selectedParam: any = {};
  searchControl: FormControl = new FormControl('');
  datePipe: DatePipe = new DatePipe('en');
  
  constructor(
    private _SideBarService: SideBarService,
    private paramsService: ParamsService
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });

    this.paramsService.params.subscribe(result => {
      if (!result.params || !result.params.length) {
        this.paramsService.getAllParams();
      } else {
        this.params = result.params;
        this.paramTableRender();
        this.isEditing = false;
        this.isShowEditParam = false;
      }
    });
  }

  ngOnInit() {
    this.paramsService.getAllParams();
  }

  paramTableRender() {
    this.tableData = new MatTableDataSource(this.params.map((param, index) => {
      return {
        id: param.sVarId,
        name: param.VarName,
        type: param.VarValueType,
        keyType: param.VarKeyType,
        key: param.VarKey,
        category: param.VarCategory,
        value: param.VarValue,
        description: param.VarDescription,
        created: param.createDate,
        modified: param.lastUpdated
      };
    }));

    const defaultPredicate = this.tableData.filterPredicate;
    let dateFormatedArr = ['created', 'modified'];
    this.tableData.filterPredicate = (data: any, filter: string) => {
      let reFormatValues = [];
      dateFormatedArr.forEach(d => {
        if (data[d] && data[d] !== 'NA') {
          reFormatValues.push(this.datePipe.transform(data[d], 'yyyy-MM-dd (HH:mm)'));
        }
      });

      return reFormatValues.some(v => v.includes(filter)) || defaultPredicate(data, filter);
    };



    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }

  onClickRow(row) {
    this.highlightRow(row);
    // this.isShowEditParam = true;
    this.selectedParam = Object.assign({}, row);
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

  onRefresh() {
    this.paramsService.getAllParams();
  }

  // onCloseEditing() {
  //   this.isShowEditParam = false;
  //   this.isEditing = false;
  // }

  openEdit() {
    this._SideBarService.open(new DynamicItem(EditSystemParametersComponent, { parameter: this.selectedParam }));
  }

}
