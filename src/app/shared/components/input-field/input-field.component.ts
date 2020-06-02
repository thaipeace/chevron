import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {MapPickupDialogComponent} from '../map/map-pickup-dialog/map-pickup-dialog.component';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {
  @Input() input: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string;
  @Input() isSubmit: boolean = false;
  @Input() noMappingLabel: boolean = false;
  @Input() max: number = null;
  @Input() min: number = null;
  @Input() arrayList: any[];
  @Input() arrayListLabel: string;
  @Input() arrayListValue: string;

  // item: any;

  constructor(private matDialog: MatDialog) {
  }

  ngOnInit() {
    console.log(this.input);
    if (this.hasRequireValidator(this.input)) {
      if (this.placeholder) {
        this.placeholder += ' *';
      }
    }
  }

  hasRequireValidator(input: FormControl) {
    try {
      // @ts-ignore
      const obj = input.validator('');
      return Object.keys(obj).indexOf('required') !== -1;
    } catch (e) {
      return false;
    }
  }

  getFirstError(obj: object) {
    return Object.keys(obj)[0];
  }

  pickUpLocation() {
    const _dialog = this.matDialog.open(MapPickupDialogComponent, {
      data: {
        address: this.input.value
      }
    });
    _dialog.componentInstance.cancel.subscribe(close => (close ? _dialog.close(MapPickupDialogComponent) : null));
    _dialog.componentInstance.pickUp.subscribe(({change, address}) => {
      if (change) {
        this.input.setValue(address);
      }
    });
  }
}
