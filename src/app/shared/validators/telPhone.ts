import { FormControl } from '@angular/forms';

export function telPhoneValidator(control: FormControl) {
  const emailRegEx = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');
  return emailRegEx.test(control.value) ? null : { telPhoneError: true };
}
