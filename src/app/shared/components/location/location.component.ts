import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocaltionInfoModel } from '@app/shared/models/localtion-info.model';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  @Input() position: [number, number];
  @Input() type: string;
  @Input() number: number;
  @Input() info: LocaltionInfoModel;
  @Output() e: EventEmitter<any> = new EventEmitter<any>();
  marker;

  constructor() { }

  ngOnInit() {
  }

  clicked() {
    this.marker.info = this.info;
    this.e.emit(this.marker);
  }

  onMarkersInit(marker) {
    this.marker = marker;
  }
}
