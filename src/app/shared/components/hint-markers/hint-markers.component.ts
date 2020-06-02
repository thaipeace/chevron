import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MarkerElementComponent} from '@shared/components/marker-element/marker-element.component';

@Component({
  selector: '[app-hint-markers]',
  templateUrl: './hint-markers.component.html',
  styleUrls: ['./hint-markers.component.scss']
})
export class HintMarkersComponent implements OnInit {
  @Output() show: EventEmitter<Function> = new EventEmitter<Function>();

  isShow: boolean;
  markers = [
    {
      name: 'Region',
      icon: MarkerElementComponent.ICONS.REGION,
    },
    {
      name: 'Terminal',
      icon: MarkerElementComponent.ICONS.REGION,
    },
    {
      name: 'Station',
      icon: MarkerElementComponent.ICONS.STATION,
    },
    {
      name: 'Supply Point',
      icon: MarkerElementComponent.ICONS.SUPPLY_POINT,
    },
    {
      name: 'Exception Area',
      icon: MarkerElementComponent.ICONS.EXCEPTION_AREA,
    },
    {
      name: 'Truck Stop',
      icon: MarkerElementComponent.ICONS.TRUCK_STOP,
    },
  ];

  @HostListener('document:click', ['$event']) onClick($event) {
    if (this.isShow && !this._ElementRef.nativeElement.contains($event.target)) // or some similar check
    {
      this.toggle();
    }
  }

  constructor(private _ElementRef: ElementRef) {
    this.isShow = true;
    this.toggle();
  }

  ngOnInit() {
    this.show.emit(($event) => {
      this.toggle();
      $event.stopPropagation();
    });
  }

  /**
   * toggle DOM
   */
  toggle() {
    this.isShow = !this.isShow;
    if (this.isShow === true) {
      this._ElementRef.nativeElement.style['display'] = 'block';
    } else {
      this._ElementRef.nativeElement.style['display'] = 'none';
    }
  }

}
