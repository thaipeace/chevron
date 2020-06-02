import {DefaultComponent} from '@shared/models/default/default-component.model';
import {OnInit, Type, ViewChild} from '@angular/core';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {FormControl} from '@angular/forms';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import * as _ from 'lodash';
import {MatPaginator} from '@angular/material/paginator';
import {MatCheckboxChange, MatSort, MatTableDataSource} from '@angular/material';
import {debounceTime} from 'rxjs/operators';
import {UtilsService} from '@shared/services/utils.service';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';

export class SmDefaultList extends DefaultComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchControl: FormControl = new FormControl('');

  tableData: MatTableDataSource<any>;
  displayedColumns = [];

  selectedRow: any;
  selectedArray: any[] = [];

  dataArray: any[] = [];

  pageSizeOptions = {
    size: 10,
    sizes: [5, 10, 25, 100]
  };

  constructor(public _SideBarService: SideBarService,
              public _DataService: SettingsDataService,
              public _DialogService: DialogService,
              public _NewComponent: Type<any>,
              public _DetailsComponent: Type<any>,
              public _SelectedMapComponent: Type<any>) {
    super();

    this.addSubscribes(this._SideBarService.statusObservable.subscribe((rs) => {
      if (this._SideBarService.isClose(rs)) {
        this.selectedRow = null;
      }
    }));

    this.addSubscribes(this._SideBarService.refreshObservable.subscribe((rs) => {
      if (rs) {
        this.onRefresh();
      }
    }));
  }

  ngOnInit() {
    this.onRefresh();
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });

    this.addSubscribes(this.paginator.page.subscribe(() => {
      this.reselectRow(this.dataArray);
    }));

  }

  applyFilter(filterValue: string = '') {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  onNew() {
    const dialogRef = this._DialogService.open(this._NewComponent, {}, {disableClose: true});
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.onRefresh();
      }
    });
  }

  onRefresh() {
    this.tableData = null;
    this.selectedArray = [];
    return this._DataService.findSettingAll()
      .then((rs) => {
        this.dataArray = rs;
        this.tableData = new MatTableDataSource(this.dataArray);
        this.tableData.paginator = this.paginator;
        this.tableData.sortingDataAccessor = (item, property) => {
          return item._data[property];
        };
        this.tableData.filterPredicate = UtilsService.filterPredicate;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
        this.reselectRow(this.dataArray);
      });
  }

  reselectRow(data: any[]) {
    const array = _.slice(data, this.paginator.pageSize * this.paginator.pageIndex,
      this.paginator.pageSize * (this.paginator.pageIndex + 1));
    if (this.selectedRow) {
      this.selectedRow = _.find(array, (el) => this.selectedRow.getId() === el.getId());
      if (!(!!this.selectedRow)) {
        // the selected row is not found or deleted, close the details
        this._SideBarService.close();
      }
    }
  }

  openCompact(row: any = null) {
    this.selectedRow = row;
    this._SideBarService.open(new DynamicItem(this._DetailsComponent, {
      id: this.selectedRow.getId ? this.selectedRow.getId() : null
    }));
  }

  onMapSelected() {
    this._DialogService.open(this._SelectedMapComponent, {groups: this.selectedArray});
  }

  onSelectAll($event: MatCheckboxChange) {
    if ($event.checked) {
      this.selectedArray = this.dataArray.slice();
    } else {
      this.selectedArray = [];
    }
  }

  onSelectionChange($event: MatCheckboxChange, item: any) {
    if ($event.checked) {
      this.selectedArray.push(item);
    } else {
      _.remove(this.selectedArray, (el) => {
        return el.getId() === item.getId();
      });
    }
  }

  onDelete(row: any) {
    const self = this;
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Are you sure to delete it?`,
      onYes: () => {
        self._DataService.delete(row.getId())
          .then(() => {
            self.onRefresh();
            questionDialogRef.close();
          });
      }
    };

    const questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }

}
