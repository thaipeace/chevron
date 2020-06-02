import {Component, OnInit} from '@angular/core';
import {ReportDataService} from '@shared/services/data/report-data.service';
import {ReportModel} from '@shared/models/data.models/report.model';

@Component({
  selector: 'app-planner-reports',
  templateUrl: './planner-reports.component.html',
  styleUrls: ['./planner-reports.component.scss']
})
export class PlannerReportsComponent implements OnInit {
  reports: ReportModel[];
  selectedReportId: string;
  startDate: Date;
  endDate: Date;

  constructor(private _ReportDataService: ReportDataService) {
    this._ReportDataService.findAll()
      .then((rs) => {
        console.log(rs);
        this.reports = rs;
      });
  }

  ngOnInit() {
  }

  generate() {
    if (this.selectedReportId && this.startDate && this.endDate) {
      this._ReportDataService.generate(this.selectedReportId, this.startDate.getTime(), this.endDate.getTime())
        .then((rs) => {
          if (rs) {
            if (window) {
              window.open(rs, '_blank');
            }
          }
        });
    }
  }

  onStartDateChange() {
    this.endDate = null;
  }
}
