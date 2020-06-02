import { Component, OnInit, Input } from '@angular/core';
import { Info } from '@app/shared/models/info';

@Component({
  selector: 'info-item',
  templateUrl: './info-item.component.html',
  styleUrls: ['./info-item.component.scss']
})
export class InfoItemComponent implements OnInit {

  @Input() data: Info;
  style;

  constructor() { }

  ngOnInit() {
    this.style = {
      'border-color': this.data.color,
      'background-color': `rgba(${this.hex2rgb(this.data.color)})`
    };
  }

  hex2rgb(hex) {
    const r: [] = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (r) {
      return r.slice(1, 4).map(x => parseInt(x, 16)).reduce((cur, x) => cur + `${x},`, '') + '0.3';
    }
  }
}
