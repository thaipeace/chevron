import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[valueExist]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValueExistDirective, multi: true }]
})
export class ValueExistDirective implements Validator {
  @Input() valueExist: string[];

  validate(control: AbstractControl): { [key: string]: any } {
    if (!this.valueExist)
      return null;

    const value = control.value || '';
    return !this.valueExist.includes(value) ? null : { 'valueExist': 'value is exist' };
  }
}
