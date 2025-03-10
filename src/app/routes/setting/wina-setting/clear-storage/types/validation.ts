import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeBaseEliminationValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const elapsedInSeconds = control.get('elapsedInSeconds')?.value;
  const startThresholdControl = control.get('warning')?.get('startThreshold');

  if (!startThresholdControl) {
    return null; // Ensure the control exists
  }

  const startThreshold = startThresholdControl.value;

  if (elapsedInSeconds && startThreshold !== null) {
    if (startThreshold >= elapsedInSeconds) {
      startThresholdControl.setErrors({ startThresholdGreaterThanElapsed: true });
    } else {
      // Remove only 'startThresholdGreaterThanElapsed' error while keeping others
      if (startThresholdControl.hasError('startThresholdGreaterThanElapsed')) {
        const errors = { ...startThresholdControl.errors };
        delete errors.startThresholdGreaterThanElapsed;
        startThresholdControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
  return null;
};
