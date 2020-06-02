import { Component, Inject, OnInit } from '@angular/core';
import { DefaultDialogComponent, IDialogComponent, staticImplements } from '@shared/models/default/default-component.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { OrderDataService } from '@shared/services/data/order-data.service';

@staticImplements<IDialogComponent>()
@Component({
  selector: 'app-om-inventory-export-dialog',
  templateUrl: './om-inventory-export-dialog.component.html',
  styleUrls: ['./om-inventory-export-dialog.component.scss']
})
export class OmInventoryExportDialogComponent extends DefaultDialogComponent implements OnInit {

  static DEFAULT_WIDTH = 550;
  message: string;
  datetime: string;
  username: string;
  dateRange;

  constructor(
    public dialogRef: MatDialogRef<OmInventoryExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _OrderDataService: OrderDataService) {
    super(dialogRef);
  }

  ngOnInit() {
    this.dateRange = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];
  }

  onExport() {
    this._OrderDataService.exportInventory(this.dateRange[0].getTime(), this.dateRange[1].getTime())
      .then((rs) => {
        if (rs) {
          window.open(rs, '_blank');
          this.onCancel();
        }
      });
  }

  onDateChange($event: Date[]) {
    this.dateRange = [moment($event[0]).startOf('day').toDate(), moment($event[1]).endOf('day').toDate()];
  }

}
