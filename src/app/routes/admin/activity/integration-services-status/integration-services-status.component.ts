import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { IntegrationServicesService } from '@app/shared/services/data/integration-services.service';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { IntegrationServiceDetailComponent } from '../integration-service-detail/integration-service-detail.component';
import { DatePipe } from '@angular/common';

const tableData = [];

@Component({
  selector: 'app-integration-services-status',
  templateUrl: './integration-services-status.component.html',
  styleUrls: ['./integration-services-status.component.scss']
})
export class IntegrationServicesStatusComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  tableData: MatTableDataSource<any>;
  displayedColumns = ['#', 'status', 'enabled', 'integrationServiceName', 'serviceHandler', 'serviceFeature', 'lastUpdated', 'minimumUpdateFrequencyTimespan', 'action'];
  inputSearch: string;
  selectedRowIndex: number = -1;
  searchControl: FormControl = new FormControl('');
  summary: any = {};

  services: any[] = [];
  selectedDate: Date[] = [
    new Date((new Date()).setHours(0, 0, 0, 0)), new Date((new Date()).setHours(23, 59, 59, 999))
  ];
  startEndDate: any[] = [];
  datePipe: DatePipe;

  constructor(
    private integrationServicesService: IntegrationServicesService,
    private _DialogService: DialogService,
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchTerm => {
      this.inputSearch = searchTerm;
      this.applyFilter(searchTerm);
    });

    this.datePipe = new DatePipe('en');
    this.integrationServicesService.integrationServices.subscribe(result => {
      if (result.integrationServices === undefined) {
        this.integrationServicesService.getIntegrationServices(this.startEndDate);
      } else {
        this.services = result.integrationServices;
        this.tableData = new MatTableDataSource(this.services);

        const defaultPredicate=this.tableData.filterPredicate;
        let dateFormatedArr = ['LastUpdated'];
        this.tableData.filterPredicate = (data: any, filter: string) => {
          let reFormatValues = [];
          dateFormatedArr.forEach(d => {
            if (data[d] && data[d] !== 'NA') {
              reFormatValues.push(this.datePipe.transform(data[d], 'yyyy-MM-dd (HH:mm)'));
            }
          });
          
          reFormatValues.push(data.Status === 'OK' ? 'yes' : 'no');
          return reFormatValues.some(v => v.includes(filter)) || defaultPredicate(data, filter) ;
        };

        this.tableData.sort = this.sort;
        this.tableData.paginator = this.paginator;
        this.summary = this.integrationServicesService.summary;
      }
    });
  }

  ngOnInit() {
    this.setServices();
  }

  setServices() {
    if (!this.startEndDate.length) {
      this.startEndDate = this.setStartEndDate([new Date(), new Date()]);
    }
    this.integrationServicesService.getIntegrationServices(this.startEndDate);
  }

  onDetails(row) {
    this._DialogService.open(IntegrationServiceDetailComponent, { data: row });
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

  onRefresh() {
    this.setServices();
  }

  onTimeChange() {
    this.startEndDate = this.setStartEndDate(this.selectedDate);
    this.setServices();
  }

  private setStartEndDate(dateArray) {
    let start = new Date(dateArray[0]);
    let end = new Date(dateArray[1]);
    return [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)];
  }


}
