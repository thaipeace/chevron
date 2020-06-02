import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { telPhoneValidator } from '@app/shared/validators/telPhone';

@Component({
  selector: 'contact-numbers',
  templateUrl: './contact-numbers.component.html',
  styleUrls: ['./contact-numbers.component.scss']
})
export class ContactNumbersComponent implements OnInit {
  @Input() formArray: FormArray;
  @Input() isSubmitted: boolean = false;
  @Input() wFull: boolean = false;
  @Input() type;

  constructor() {}

  ngOnInit() {
    console.log(this.wFull);
  }

  addContactNumberControl(): void {
    this.formArray.push(new FormControl('', [Validators.required, telPhoneValidator]));
  }

  canAddNewContactNumber(): boolean {
    return this.formArray.controls.length > 4;
  }

  onRemove(index: number) {
    this.formArray.removeAt(index);
  }

  getFirstError(obj: object) {
    return Object.keys(obj)[0];
  }
}
