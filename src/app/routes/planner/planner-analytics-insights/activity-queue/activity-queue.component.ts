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

@Component({
  selector: 'app-activity-queue',
  templateUrl: './activity-queue.component.html',
  styleUrls: ['./activity-queue.component.scss']
})

export class ActivityQueueComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'queueDatetime', 'activity', 'requestType', 'requestBy', 'state', 'startDatetime', 'endDatetime', 'progressStatus', 'averageExcutionTimeSpan', 'completionStatus', 'remark'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  activities: any[] = [];
  selectedDate: Date[] = [
    new Date((new Date()).setHours(0, 0, 0, 0)), new Date((new Date()).setHours(23, 59, 59, 999))
  ];
  startEndDate: any[] = [];
  intervalActivity: any;
  datePipe: DatePipe = new DatePipe('en');
  searchTerm: any;

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.searchTerm = searchTerm;
      this.applyFilter(this.searchTerm);
    });
  }

  ngOnInit() {
    this.setActivities();
    this.intervalActivity = setInterval(() => { this.setActivities(); }, 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalActivity);
  }

  setActivities() {
    if (!this.startEndDate.length) {
      this.startEndDate = this.setStartEndDate([new Date(), new Date()]);
    }

    let getActivityPayload = new Payload(PayloadsConstant.activityManagement.getAllActivityDetails,
      [this.startEndDate[0], this.startEndDate[1]]
    );
    this.apiDataService.executeQuery(getActivityPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      this.activities = raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Message.Activity)
        : []

      this.tableData = new MatTableDataSource(this.activities);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['QueuedTime', 'StartTime', 'EndTime'];
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

      this.applyFilter(this.searchTerm);
    }, error => {
      console.log('Loading error');
    });

  }

  onClickRow(row) {
    this.highlightRow(row);
    // this.isShowEditParam = true;
    // this.selectedParam = Object.assign({}, row);
    // this.openEdit();
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
    this.setActivities();
  }

  onTimeChange() {
    this.startEndDate = this.setStartEndDate(this.selectedDate);
    this.setActivities();
  }

  private setStartEndDate(dateArray) {
    let start = new Date(dateArray[0]);
    let end = new Date(dateArray[1]);
    return [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)];
  }

}
