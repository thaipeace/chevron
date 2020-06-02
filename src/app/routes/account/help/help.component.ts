import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { QuotaModel } from '@shared/models/data.models/quota/quota.model';
import { DialogService } from '@shared/services/others/dialog.service';
import { PdfDialogComponent } from '@shared/components/dialogs/pdf-dialog/pdf-dialog.component';
import { AuthenticationService } from '@app/user-management/shared/services';
import * as _ from 'lodash';
import { DefaultComponent } from '@shared/models/default/default-component.model';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { CustomRouterService } from '@shared/services/others/custom-router.service';
import { CUSTOM_ROUTE_NAMES } from '@shared/constants/routes.constant';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent extends DefaultComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns = ['index', 'fileName', 'date', 'size', 'kind'];
  tableData: MatTableDataSource<any>;
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;
  user: any = null;

  list = {
    customer: {
      path: 'customer',
      files: ['Atomiton - Terminal Loading and Distribution Solution - Customer User Guide']
    },
    planner: {
      path: 'planner',
      files: ['Atomiton - Terminal Loading and Distribution Solution - Planner User Guide']
    },
    trucking: {
      path: 'trucking',
      files: ['Atomiton - Terminal Loading and Distribution Solution - Trucking User Guide']
    },
    readMe: {
      path: 'readme',
      files: [
        'Atomiton - Terminal Loading and Distribution Solution - Read Me'
      ]
    },
    terminal: {
      path: 'terminal',
      files: [
        'Atomiton - Terminal Loading and Distribution Solution - Customer User Guide',
        'Atomiton - Terminal Loading and Distribution Solution - Planner User Guide',
        'Atomiton - Terminal Loading and Distribution Solution - Terminal User Guide',
        'Atomiton - Terminal Loading and Distribution Solution - Trucking User Guide',
        'Atomiton - Terminal Loading and Distribution Solution - Read Me'
      ]
    }
  };

  template = {
    'date': 'Sat Aug 24 2019 13:00:13',
    'size': '1.9MB',
    'kind': 'Adobe PDF Document',
    'fileName': '',
    'url': ''
  };

  constructor(
    private _DialogService: DialogService,
    private _AuthenticationService: AuthenticationService,
    private _CustomRouterService: CustomRouterService,
  ) {
    super();
    this._CustomRouterService.setCustomItem(CUSTOM_ROUTE_NAMES.HELP);
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    this.addSubscribes(
      this._AuthenticationService.loginedUserObservable
        .subscribe((user) => {
          this.user = user;
          this.loadDocument();
        })
    );
  }

  loadDocument() {
    if (this.user) {
      let obj;
      switch (this.user.roleId) {
        case DEFAULT_ROLES.ADMIN:
          obj = this.list.terminal;
          break;
        case DEFAULT_ROLES.PLANNER:
          obj = this.list.planner;
          break;
        case DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR:
        case DEFAULT_ROLES.TRUCK_COMPANY_OWNER:
          obj = this.list.trucking;
          break;
        case DEFAULT_ROLES.CUSTOMER:
          obj = this.list.customer;
          break;
      }
      if (obj) {
        let data = [];
        _.map(obj.files, (el) => {
          let cloneObj = _.cloneDeep(this.template);
          cloneObj['fileName'] = el;
          cloneObj['url'] = `assets/files/documentation/${obj['path']}/${el}.pdf`;
          data.push(cloneObj);
        });
        this.tableData = new MatTableDataSource(data);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
      }
    }
  }

  onRefresh() {
    this.loadDocument();
  }

  openPdf(obj) {
    this._DialogService.open(PdfDialogComponent, {
      title: obj['fileName'],
      src: obj['url']
    });
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
}
