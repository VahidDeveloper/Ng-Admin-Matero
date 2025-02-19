import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * this class is built for form validators
 */
export class FormValidators {
  static _passwordsEquality(checkControlName: string): ValidatorFn | null {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const checkControl = control?.parent?.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['notMatchConfirmPass']) {
        // if there is another error, do nothing
        return null;
      }
      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ notMatchConfirmPass: true });
        return { notMatchConfirmPass: true };
      } else {
        checkControl?.setErrors(null); // clear notMatchConfirmPass error, if it is shown previously
        return null;
      }
    };
  }
}
