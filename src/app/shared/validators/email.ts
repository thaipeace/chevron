import { FormControl } from '@angular/forms';

export function emailValidator(control: FormControl) {
    const emailRegEx = new RegExp('^[a-zA-Z0-9_]+[a-zA-Z0-9_.%+-]*@[a-z0-9.-]+\\.[a-z]{2,4}$');
    return emailRegEx.test(control.value) ? null : { emailError: true };
}
