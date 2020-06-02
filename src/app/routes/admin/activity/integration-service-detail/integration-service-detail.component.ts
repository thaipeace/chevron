import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const data = [];

@Component({
  selector: 'app-integration-service-detail',
  templateUrl: './integration-service-detail.component.html',
  styleUrls: ['./integration-service-detail.component.scss']
})
export class IntegrationServiceDetailComponent implements OnInit {
  
  selectedService: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any
  ) {
    this.selectedService = dataInput.data;
  }

  ngOnInit() {
    
  }  

  onCancel() {
    this.dialogRef.close(false);
  }

  tabChanged(event) {

  }

}
