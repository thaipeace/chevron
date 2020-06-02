import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-map-pickup-dialog',
  templateUrl: './map-pickup-dialog.component.html',
  styleUrls: ['./map-pickup-dialog.component.scss']
})
export class MapPickupDialogComponent implements OnInit {
  address: FormControl;
  cancel = new BehaviorSubject(null);
  pickUp = new BehaviorSubject({ change: false, address: null });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.address = new FormControl(this.data.address, []);
    this.address.setValue(this.data.address);
  }

  onCancel() {
    this.cancel.next(true);
  }

  onChangeAddress(event) {
    this.address.setValue(event);
  }

  onPickUp() {
    console.log(this.address.value);
    this.pickUp.next({ change: true, address: this.address.value });
    this.onCancel();
  }
}
