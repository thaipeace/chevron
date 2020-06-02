import { FormControl } from '@angular/forms';

export function noWhitespaceValidator(control: FormControl) {
  // const regex = new RegExp('^\\S[_A-z0-9]*((-|\\s)*[_A-z0-9\\s])*$');
  return control.value && control.value.trim() != '' ? null : { whitespace: true };
}
