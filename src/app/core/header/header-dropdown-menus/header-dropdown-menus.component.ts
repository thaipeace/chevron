import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-header-dropdown-menus',
  templateUrl: './header-dropdown-menus.component.html',
  styleUrls: ['./header-dropdown-menus.component.scss'],
})
export class HeaderDropdownMenusComponent implements OnInit, OnChanges {
  @Input() groups: any;
  @Input() current: any;
  @Input() exceptionElements: ElementRef[] = [];
  @Output() hide = new EventEmitter();
  column1: any[];
  column2: any[];
  column3: any[];

  @HostListener('document:click', ['$event']) onClick($event) {
    const array = _.map(this.exceptionElements, el => el.nativeElement).concat(this._ElementRef.nativeElement);
    if (_.every(array, (el) => {
      return !el.contains($event.target);
    })) {
      this.onHide();
    }
  }

  constructor(private _ElementRef: ElementRef) {
  }

  ngOnInit() {
  }

  onHide(){
    this.hide.emit();
  }

  reset() {
    this.column1 = [];
    this.column2 = [];
    this.column3 = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {groups} = changes;
    if (!!groups && groups.currentValue) {
      this.checkData();
    }
  }

  checkData() {
    this.reset();
    switch (this.groups.length) {
      case 0:
        break;
      case 1:
        this.column1.push(this.groups[0]);
        break;
      case 2:
        this.column1.push(this.groups[0]);
        this.column2.push(this.groups[1]);
        break;
      default:
        if (this.groups[0].menus.length >= (this.groups[1].menus.length + this.groups[2].menus.length)) {
          this.column1.push(this.groups[0]);
          this.column2.push(this.groups[1]);
          this.column2.push(this.groups[2]);
        } else {
          this.column1.push(this.groups[0]);
          this.column1.push(this.groups[1]);
          this.column2.push(this.groups[2]);
        }
        this.column3 = this.groups.slice(3, this.groups.length);
    }
  }

}
