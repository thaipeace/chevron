import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: '[app-marker-element]',
  templateUrl: './marker-element.component.html',
  styleUrls: ['./marker-element.component.scss']
})
export class MarkerElementComponent implements OnInit {
  @Input() icon: string;
  @Input() image: string;

  static ICONS = {
    REGION: 'fal fa-map-marked-alt',
    STATION: 'fal fa-gas-pump',
    SUPPLY_POINT: 'fal fa-oil-can',
    EXCEPTION_AREA: 'fal fa-ban',
    TRUCK_STOP: 'fal fa-parking-circle',
  };

  constructor() {
  }

  ngOnInit() {
  }

}
