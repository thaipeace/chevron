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

@Component({
  selector: 'app-analytics-artifacts',
  templateUrl: './analytics-artifacts.component.html',
  styleUrls: ['./analytics-artifacts.component.scss']
})
export class AnalyticsArtifactsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'fileName', 'path', 'date', 'size', 'kind', 'action'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  artifacts: any[] = [];
  selectedDate: Date[] = [
    new Date((new Date()).setHours(0, 0, 0, 0)), new Date((new Date()).setHours(23, 59, 59, 999))
  ];
  startEndDate: any[] = [];
  datePipe: DatePipe = new DatePipe('en');

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    this.setArtifacts();
  }

  setArtifacts() {
    if (!this.startEndDate.length) {
      this.startEndDate = this.setStartEndDate([new Date(), new Date()]);
    }

    let getArtifactsPayload = new Payload(PayloadsConstant.activityManagement.getAllAnalyticArtifacts,
      [this.startEndDate[0], this.startEndDate[1]]
    );

    this.apiDataService.executeQuery(getArtifactsPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);

      this.artifacts = raw.APIResponse.Status === 'Success'
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.Message.Artifact)
        : []

      this.tableData = new MatTableDataSource(this.artifacts);

      const defaultPredicate = this.tableData.filterPredicate;
      let dateFormatedArr = ['Date'];
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

  download(row) {

  }

  onRefesh() {
    this.setArtifacts();
  }

  onTimeChange() {
    this.startEndDate = this.setStartEndDate(this.selectedDate);
    this.setArtifacts();
  }

  private setStartEndDate(dateArray) {
    let start = new Date(dateArray[0]);
    let end = new Date(dateArray[1]);
    return [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)];
  }


}
