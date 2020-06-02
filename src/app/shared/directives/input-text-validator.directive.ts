import { Directive, Input, ElementRef, Provider, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';

export const INPUT_TEXT_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => InputTextValidatorDirective),
  multi: true
};

@Directive({
  selector: '[appInputTextValidator][ngModel]',
  providers: [
    INPUT_TEXT_VALIDATOR
  ]
})
export class InputTextValidatorDirective implements Validator {

  private _text = [];
  private _onChange: Function;
  @Input()
  get inputText() {
    return this._text;
  }

  set inputText(value: string | Array<string> | null) {
    if (typeof value === 'string') {
      this._text = value.split(' ');
    } else if (Array.isArray(value)) {
      this._text = value;
    } else {
      this._text = [];
    }
    if (this._onChange) this._onChange();
  }
  constructor() { }

  validate(c: AbstractControl) {
    return this._text.includes(c.value) ? {
      invalidusername: true
    } : null;
  }
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}
