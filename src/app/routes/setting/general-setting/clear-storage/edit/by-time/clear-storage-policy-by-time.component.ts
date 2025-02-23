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
import { TimeBaseElimination } from '../../_models/time-base-elimination';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component is responsible to show form for clear storage of edit
 */
@Component({
  selector: 'app-clear-storage-policy-by-time',
  templateUrl: './clear-storage-policy-by-time.component.html',
  styleUrls: ['./clear-storage-policy-by-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearStoragePolicyByTimeComponent implements OnInit {
  /**
   * storage setting input
   */
  @Input() storageSetting: TimeBaseElimination | undefined;
  /**
   * timeBaseEliminationForm controls
   */
  _timeBaseEliminationForm: FormGroup | undefined;
  extraValidatorsDescription = {
    remindingLessThanKeptDays: this._translatorService.instant('remindingLessThanKeptDays'),
  };
  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _parentForm: FormGroupDirective,
    private _translatorService: TranslateService
  ) {
    this._createForm();
  }

  ngOnInit(): void {
    this._parentForm.form.addControl('timeBaseElimination', this._timeBaseEliminationForm);
    this._timeBaseEliminationForm?.patchValue(this.storageSetting!);
    if (!this._timeBaseEliminationForm?.controls.enabled.value) {
      this._disableForm();
    }
    if (!this.warningForm.controls.enabled.value) {
      this.warningForm.controls.startThreshold.disable();
    }
    this._parentForm.ngSubmit.subscribe(() => {
      this._timeBaseEliminationForm?.markAllAsTouched();
      this._cdr.markForCheck();
    });
  }

  get warningForm() {
    return this._timeBaseEliminationForm?.get('warning') as FormGroup;
  }
  /**
   * to create form controls
   */
  private _createForm() {
    this._timeBaseEliminationForm = this._fb.group(
      {
        enabled: [false],
        elapsedInSeconds: [null, [Validators.min(2)]],
        warning: this._fb.group({
          startThreshold: [null, [Validators.required, Validators.min(1)]],
          step: [null, [Validators.required, Validators.min(1)]],
          enabled: [false],
        }),
      },
      { validators: this._checkValidator }
    );
  }

  /**
   * it is called when switch changed in the form.
   */
  checkTransfer(event: any, form: FormGroup, key?: string): void {
    if (!event.target.checked) {
      if (key) {
        if (form.controls[key].invalid) {
          form.controls[key]?.patchValue(
            this.storageSetting && key in this.storageSetting
              ? (this.storageSetting as any)[key]
              : (this.storageSetting?.warning as any)[key]
          );
        }
        form.controls[key].disable();
      } else {
        this._disableForm();
      }
    } else {
      key ? form.controls[key].enable() : this._enableForm(form);
    }
  }

  /**
   * disable controls of form base kay
   */
  private _disableForm(): void {
    Object.keys(this._timeBaseEliminationForm?.controls || {})
      .filter(key => key !== 'enabled')
      .forEach(key => {
        if (this._timeBaseEliminationForm?.controls[key].invalid) {
          if (key === 'warning') {
            for (const control in this.warningForm.controls) {
              if (this.storageSetting && this.warningForm.controls[control].invalid) {
                //TODO: uncomment this code
                // const value = this.storageSetting.warning[control];
                // this.warningForm.controls[control].patchValue(value);
              }
            }
          } else {
            if (this.storageSetting && key in this.storageSetting) {
              this._timeBaseEliminationForm?.controls[key].patchValue(
                (this.storageSetting as any)[key]
              );
            }
          }
        }
        this._timeBaseEliminationForm?.controls[key].disable();
      });
    this.warningForm.controls['enabled'].disable();
  }

  /**
   * to enable form
   */
  private _enableForm(form: FormGroup): void {
    form.enable();
    if (this.storageSetting?.warning.enabled) {
      this.warningForm.controls['enabled'].enable();
    }
  }

  /**
   * to check numOfDayToKept and numOfRemind :numOfRemind should be lower than numOfDayToKept
   */
  private _checkValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const numOfDayToKept = control.get('elapsedInSeconds');
    const numOfRemind = control.get('warning')?.get('startThreshold');
    if (numOfDayToKept?.value <= numOfRemind?.value) {
      numOfRemind?.setErrors({ remindingLessThanKeptDays: true });
      return { remindingLessThanKeptDays: true };
    } else {
      return null;
    }
  };
}
