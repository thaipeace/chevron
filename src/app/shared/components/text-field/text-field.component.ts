import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MapPickupDialogComponent } from '../map/map-pickup-dialog/map-pickup-dialog.component';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {
  @Input() input: FormControl;
  @Input() value;
  @Input() isHidden;
  @Input() type;
  @Input() arrayList: any[];
  @Input() class;

  constructor(private matDialog: MatDialog) {}

  ngOnInit() {}

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
    _dialog.componentInstance.pickUp.subscribe(({ change, address }) => {
      if (change) {
        this.input.setValue(address);
      }
    });
  }
}
