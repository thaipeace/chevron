import {Component, HostBinding, OnInit} from '@angular/core';
import {DEFAULT_VALUES} from '@shared/constants/config.constant';

@Component({
  selector: 'tql-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  // @HostBinding( 'class.fxFlex' ) true;
  version;

  constructor() {
  }

  ngOnInit() {
    this.version = DEFAULT_VALUES.VERSION;
  }

}
