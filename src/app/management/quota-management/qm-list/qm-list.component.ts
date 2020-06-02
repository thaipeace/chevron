import * as _ from 'lodash';
import {Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatPaginator, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {QuotaModel} from '@shared/models/data.models/quota/quota.model';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {QmImportDialogComponent} from '@management/quota-management/qm-import-dialog/qm-import-dialog.component';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {QmDetailsCompactComponent} from '@management/quota-management/qm-details-compact/qm-details-compact.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {QuotaDataService} from '@shared/services/data/quota-data.service';

@Component({
  selector: 'app-qm-list',
  templateUrl: './qm-list.component.html',
  styleUrls: ['./qm-list.component.scss']
})
export class QmListComponent extends DefaultComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  @Input() quotaList: QuotaModel[];
  @Input() stations: StationModel[];

  @Output() newQuotaClicked = new EventEmitter<void>();
  @Output() viewQuotaDetail = new EventEmitter<QuotaModel>();
  @Output() refreshClicked = new EventEmitter<string[]>();

  displayedColumns = ['index', 'stationName','ProductIndex', 'ProductCode',
    'MonthlyQuota', 'RemainingQuota', 'lastUpdated', 'action'];

  tableData: MatTableDataSource<QuotaModel>;
  selectedRowIndex = -1;
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedStationIds: string[] = [];
  selectedRow: any;


  constructor(private _DialogService: DialogService,
              private _SideBarService: SideBarService,
              private _QuotaDataService: QuotaDataService) {
    super();
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
    ).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm, this.selectedStationIds);
    });

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

  ngOnChanges(changes: SimpleChanges): void {
    const {quotaList, stations} = changes;
    if (quotaList && quotaList.currentValue) {
      this.mappingData();
    }

    if (stations && stations.currentValue) {
      this.mappingData();
    }
  }

  applyFilter(filterValue: string = '', selectedStations: string[] = []) {
    filterValue = filterValue.trim().toLowerCase();
    this.tableData.filter = `${filterValue}$$${selectedStations.join('|')}`;
    this.tableData.sort = this.sort;
    this.sort.disableClear = true;
  }

  onStationSelectionChange(stationIds) {
    this.selectedStationIds = stationIds;
    this.applyFilter(this.inputSearch, stationIds);
  }

  mappingData() {
    if (this.quotaList && this.stations) {
      this.selectedStationIds = _.map(this.stations, (el) => el.getId());
      _.map(this.quotaList, (el) => {
        el.setStation(_.find(this.stations, (station) => station.getId() == el.stationId));
      });

      if (!this.tableData) {
        this.tableData = new MatTableDataSource(this.quotaList);
        // filtering
        this.tableData.filterPredicate = (data: any, filter: string): boolean => {
          const [searchTerm = '', searchStations = ''] = filter.split('$$');
          if (!searchStations) {
            return false;
          }
          const selectedStations = searchStations.split('|');

          const doSearch = (data, searchTerm, displayedColumns): boolean => {
            for (let index = 0; index < displayedColumns.length; index++) {
              const key = displayedColumns[index];
              const value = data._data[key];
              if (value && value.toLowerCase().indexOf(searchTerm) !== -1) {
                return true;
              }
            }
            return false;
          };

          if (selectedStations.length > 0 && selectedStations[0].length) {
            if (selectedStations.indexOf(data['stationId']) > -1) {
              return doSearch(data, searchTerm, this.displayedColumns);
            }
          } else {
            return doSearch(data, searchTerm, this.displayedColumns);
          }
          return false;
        };

        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
      } else {
        this.tableData.data = this.quotaList;
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
        if (this.table) {
          this.table.renderRows(); // new data update, trigger table change
        }
      }
    }
  }

  onRefresh() {
    const stationIds = _.map(this.stations, (el) => el.getId());
    this.refreshClicked.emit(stationIds);
    this.reselectRow(this.quotaList);
  }

  onNewQuota() {
    this.newQuotaClicked.emit();
  }

  onDetails(row: any) {
    this.viewQuotaDetail.emit(row);
  }

  onImport() {
    const dialogRef = this._DialogService.open(QmImportDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.onRefresh();
      }
    });
  }

  reselectRow(array) {
    if (this.selectedRow) {
      this.selectedRow = _.find(array, (el) => this.selectedRow.getId() === el.getId());
      if (!(!!this.selectedRow)) {
        // the selected row is not found or deleted, close the details
        this._SideBarService.close();
      }
    }
  }

  openCompact(row: any = null) {
    // this.selectedRow = row;
    // this._SideBarService.open(new DynamicItem(QmDetailsCompactComponent, {
    //   id: this.selectedRow.getId(),
    //   stationId: this.selectedRow.stationId
    // }));
  }

  onDelete(row: any) {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Are you sure to delete it?`,
      onYes: () => {
        this._QuotaDataService.delete(row.getId())
          .then((rs) => {
            if (rs) {
              // close and refresh data
              questionDialogRef.close();
              this.onRefresh();
            }
          });
      }
    };

    const questionDialogRef = this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }
}
