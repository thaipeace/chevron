import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: '[app-table-mini-actions]',
  templateUrl: './table-mini-actions.component.html',
  styleUrls: ['./table-mini-actions.component.scss']
})
export class TableMiniActionsComponent implements OnInit {
  @Input() templateLink: string;
  @Output() onUpload = new EventEmitter();
  @Output() clearData = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  downloadTemplate() {
    if (this.templateLink) {
      if (window) {
        window.open(this.templateLink, '_blank');
      }
    }
  }
}
