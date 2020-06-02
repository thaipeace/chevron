import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header-status',
  templateUrl: './page-header-status.component.html',
  styleUrls: ['./page-header-status.component.scss']
})
export class PageHeaderStatusComponent implements OnInit {
  @Input() navLinks: any[];
  @Input() title: string;
  constructor() { }

  ngOnInit() {
  }

}
