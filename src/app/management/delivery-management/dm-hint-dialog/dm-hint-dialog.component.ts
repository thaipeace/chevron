import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { IconInfo } from '@app/shared/models/icon-info';

@Component({
  selector: 'app-dm-hint-dialog',
  templateUrl: './dm-hint-dialog.component.html',
  styleUrls: ['./dm-hint-dialog.component.scss']
})
export class DmHintDialogComponent implements OnInit {

  locationIcon: IconInfo;
  routeIcon: IconInfo;
  statusIcon: IconInfo;

  constructor(
    private dialogRef: MatDialogRef<DmHintDialogComponent>,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('assets/mock/hint.json').subscribe(data => {
      this.locationIcon = data['iconLocaltion'];
      this.routeIcon = data['iconRouting'];
      this.statusIcon = data['iconStatus'];
    });
  }

  onCancel() {
    this.dialogRef.close(true);
  }
}
