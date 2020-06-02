import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { DatePipe } from '@angular/common';
import { UtilsService } from '@shared/services/utils.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-detail-data',
  templateUrl: './detail-data.component.html',
  styleUrls: ['./detail-data.component.scss']
})
export class DetailDataComponent implements OnInit {

  @Input() serviceApp: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;

  displayedColumns = ['#', 'datetime', 'direction', 'payload'];
  searchControl: FormControl = new FormControl('');
  inputSearch: string;
  selectedRowIndex: number = -1;

  selectedApp: any = {};
  details: any[] = [];
  selectedDate: Date[] = [
    new Date((new Date()).setHours(0, 0, 0, 0)), new Date((new Date()).setHours(23, 59, 59, 999))
  ];
  startEndDate: any[] = [];
  datePipe: DatePipe = new DatePipe('en');

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _MatSnackBar: MatSnackBar
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });
  }

  ngOnInit() {
    this.selectedApp = this.serviceApp;
    this.setDetails();
  }

  setDetails() {
    if (!this.startEndDate.length) {
      this.startEndDate = this.setStartEndDate([new Date(), new Date()]);
    }

    let getConnectionsPayload = new Payload(PayloadsConstant.activityManagement.getIntigratedServiceDetails,
      [this.selectedApp.IntigratedServicename, this.selectedApp.ServiceFeature, this.startEndDate[0], this.startEndDate[1]]);
    this.apiDataService.executeQuery(getConnectionsPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      this.details = (raw.APIResponse.Status === 'Success' && raw.APIResponse.ExternalServices)
        ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.ExternalServices.ExternalService)
        : [];

      this.tableData = new MatTableDataSource(this.details);

      const defaultPredicate = this.tableData.filterPredicate;
      this.tableData.filterPredicate = (data: any, filter: string) => {
        let reFormatValues = [];
        reFormatValues.push(this.datePipe.transform(data.DateTime, 'yyyy-MM-dd (HH:mm)'));
        reFormatValues.push(JSON.stringify(data.Payload).toLowerCase());
        return reFormatValues.some(v => v.includes(filter)) || defaultPredicate(data, filter);
      };

      this.tableData.sort = this.sort;
      this.tableData.paginator = this.paginator;
    }, error => {
      console.log('Loading error');
    })

  }

  onClickRow(row) {
    this.highlightRow(row);
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
    this.setDetails();
  }

  onExport() {
    let exePayload = new Payload(PayloadsConstant.activityManagement.exportexternalServicedata,
      [this.selectedApp.IntigratedServicename, this.selectedApp.ServiceFeature, this.startEndDate[0], this.startEndDate[1]]);
    this.apiDataService.executeQuery(exePayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      if (raw.DownloadLink) {     
        UtilsService.openNewWindow(raw.DownloadLink.ExternalServiceHistoryData);
      } else {
        this._MatSnackBar.open(raw.APIResponse.Message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
    }, error => {
      console.log('Loading error');
    })
  }

  onTimeChange() {
    this.startEndDate = this.setStartEndDate(this.selectedDate);
    this.setDetails();
  }

  private setStartEndDate(dateArray) {
    let start = new Date(dateArray[0]);
    let end = new Date(dateArray[1]);
    return [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)];
  }
}
