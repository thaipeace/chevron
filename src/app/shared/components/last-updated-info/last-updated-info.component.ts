import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-last-updated-info',
  templateUrl: './last-updated-info.component.html',
  styleUrls: ['./last-updated-info.component.scss']
})
export class LastUpdatedInfoComponent implements OnInit {
  @Input() username: string;
  @Input() lastUpdated: string;

  constructor() { }

  ngOnInit() {
  }

}
