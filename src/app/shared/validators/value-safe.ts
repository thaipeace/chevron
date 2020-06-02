import { FormControl } from '@angular/forms';

export function valueSafeValidator(control: FormControl) {
  const emailRegEx = new RegExp('&|<');
  return emailRegEx.test(control.value) ? { notSafe: true } : null;
}
