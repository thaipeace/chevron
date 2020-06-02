import { FormControl } from '@angular/forms';

export function NaNValidator(control: FormControl) {
  const emailRegEx = new RegExp('^\d\.{0,1}\d{0,}$');
  return emailRegEx.test(control.value) ? null : { NaN: true };
}