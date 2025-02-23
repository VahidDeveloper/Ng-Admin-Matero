import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { DiskBaseElimination } from '../../_models/disk-base-elimination';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component is responsible to show edit form for storage bt percent
 */
@Component({
  selector: 'app-clear-storage-policy-by-percent',
  templateUrl: './clear-storage-policy-by-percent.component.html',
  styleUrls: ['./clear-storage-policy-by-percent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearStoragePolicyByPercentComponent implements OnInit {
  /**
   * diskBaseElimination controls
   */
  _diskBaseElimination: FormGroup | undefined;
  isSubmitted = false;
  /**
   * error message for inputs
   */
  errorMessage = {
    invalidMinMax: this._translatorService.instant('MaximumShouldBeMoreThanMinimum'),
    invalidMinPercentToAlarm: this._translatorService.instant('WarningPercentValidation'),
  };
  /**
   * storage setting to set input value ,from parent component
   */
  @Input() storageSetting: DiskBaseElimination | undefined;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _parentForm: FormGroupDirective,
    private _translatorService: TranslateService
  ) {
    this._createForm();
  }

  ngOnInit(): void {
    this._parentForm.form.addControl('diskBaseElimination', this._diskBaseElimination);
    this._diskBaseElimination?.patchValue(this.storageSetting!);
    if (!this.storageSetting?.enabled) {
      this._disableForm();
    }
    this._parentForm.ngSubmit.subscribe(() => {
      this._diskBaseElimination?.markAllAsTouched();
      this.isSubmitted = true;
      this._cdr.markForCheck();
    });
  }

  get warningForm() {
    return this._diskBaseElimination?.get('warning') as FormGroup;
  }

  private _createForm() {
    this._diskBaseElimination = this._fb.group(
      {
        enabled: [false],
        mountPoint: [{ value: '/', disabled: true }],
        lowerBound: [null, [Validators.min(0), Validators.max(100)]],
        upperBound: [null, [Validators.min(0), Validators.max(100)]],
        warning: this._fb.group({
          startThreshold: [null, [Validators.min(0), Validators.max(100)]],
          step: [null, [Validators.min(0), Validators.max(100)]],
          enabled: [false],
        }),
      },
      { validators: this._checkValidator }
    );
  }

  /**
   * it is called when file transfer switch changed.
   * @param event to get value of switch from template
   */
  checkTransfer(event: any): void {
    if (!event.target.checked) {
      this._disableForm();
    } else {
      this._diskBaseElimination?.enable();
      this._diskBaseElimination?.controls.mountPoint.disable();
    }
  }

  /**
   * disable all form elements except deleteFile and mountPoint
   */
  private _disableForm(): void {
    Object.keys(this._diskBaseElimination?.controls || {})
      .filter(key => key !== 'enabled' && key !== 'mountPoint')
      .forEach(key => {
        if (this._diskBaseElimination?.invalid) {
          if (key === 'warning') {
            for (const control in this.warningForm.controls) {
              if (this.warningForm.controls[control].invalid) {
                this.warningForm.controls[control].patchValue(
                  this.storageSetting?.warning?.[
                    control as keyof typeof this.storageSetting.warning
                  ]
                );
              }
            }
          } else {
            if (this.storageSetting && key in this.storageSetting) {
              this._diskBaseElimination?.controls[key].patchValue(
                (this.storageSetting as any)[key]
              );
            }
          }
        }
        this._diskBaseElimination?.controls[key].disable();
      });
    if (!this.storageSetting?.warning.enabled) {
      this.warningForm.controls['enabled'].disable();
    }
  }

  /**
   * to check maxStorage and minStorage and minPercentToAlarm cross validation
   */
  private _checkValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const minStorage = control.get('lowerBound');
    const maxStorage = control.get('upperBound');
    const minPercentToAlarm = control.get('warning')?.get('startThreshold');
    if (maxStorage?.value <= minStorage?.value) {
      maxStorage?.setErrors({
        ...maxStorage?.errors,
        invalidMinMax: true,
      });
      minStorage?.setErrors({
        ...minStorage?.errors,
        invalidMinMax: true,
      });
      return { invalidMinMax: true };
    } else {
      this._clearErrorSpecified(maxStorage, 'invalidMinMax');
      this._clearErrorSpecified(minStorage, 'invalidMinMax');
    }
    if (minPercentToAlarm?.value >= maxStorage?.value) {
      minPercentToAlarm?.setErrors({
        ...minPercentToAlarm.errors,
        invalidMinPercentToAlarm: true,
      });
      return { invalidMinPercentToAlarm: true };
    } else {
      this._clearErrorSpecified(minPercentToAlarm!, 'invalidMinPercentToAlarm');
      return null;
    }
  };

  /**
   //  * clears specified form error from control
   //  */
  private _clearErrorSpecified = (formControl: AbstractControl | null, errorName: string): void => {
    if (formControl && formControl.errors) {
      delete formControl.errors[errorName];
    }

    if (formControl && formControl.errors && Object.keys(formControl.errors).length) {
      formControl.setErrors(formControl.errors);
    } else {
      formControl?.setErrors(null);
    }
  };
}
