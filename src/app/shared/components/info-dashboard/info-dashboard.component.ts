import { Component, OnInit, Input } from '@angular/core';
import { Info } from '@app/shared/models/info';

@Component({
  selector: 'info-dashboard',
  templateUrl: './info-dashboard.component.html',
  styleUrls: ['./info-dashboard.component.scss']
})
export class InfoDashboardComponent implements OnInit {

  @Input() dataContext: Info[];

  constructor() { }

  ngOnInit() {
  }

}
