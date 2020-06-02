import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatSort } from '@angular/material';
import { TruckHistoricalLocationModel } from '@shared/models/data.models/fleet/truck-historical-location.model';
import { TruckModel } from '@shared/models/data.models/fleet/truck.model';

@Component({
    selector: 'app-fm-truck-locations-dialog',
    templateUrl: './fm-truck-locations-dialog.component.html',
    styleUrls: ['./fm-truck-locations-dialog.component.scss']
})
export class FmTruckLocationsDialogComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    locations: TruckHistoricalLocationModel[] = [];
    truck: TruckModel;

    tableData: MatTableDataSource<TruckHistoricalLocationModel>;
    displayedColumns = ['index', 'geoPoint', 'readingTime', 'odometer', 'ignition', 'speed'];

    constructor(public dialogRef: MatDialogRef<FmTruckLocationsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.locations = data.locations || this.locations;
        this.truck = data.truck || {};
        this.locations = this.locations.map((u, index) => {
            u.index = (index + 1).toString();
            return u;
        });
        this.tableData = new MatTableDataSource(this.locations);
    }

    ngOnInit() {
        this.tableData.sort = this.sort;
        this.sort.disableClear = true;
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
