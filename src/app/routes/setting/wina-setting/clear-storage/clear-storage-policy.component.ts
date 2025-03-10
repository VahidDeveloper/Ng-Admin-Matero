import { Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { StorageStore } from './services/storage-store.service';
import { DisableControlDirective } from '@shared';

/**
 * component to show list of storage elimination policy
 */
@Component({
  templateUrl: './clear-storage-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StorageStore],
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    MatSlideToggle,
    MatProgressSpinner,
    MatCardModule,
    DisableControlDirective,
  ],
})
export class ClearStoragePolicyComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(StorageStore);
  tr = inject(TranslateService);

  form: FormGroup;
  submitLoading: Observable<boolean> = of(false);
  fetchLoading$: Observable<boolean> = of(false);

  get diskBaseElimination(): FormGroup {
    return this.form.controls.diskBaseElimination as FormGroup;
  }

  get diskBaseWarning(): FormGroup {
    return this.form.controls.diskBaseElimination.get('warning') as FormGroup;
  }

  get timeBaseElimination(): FormGroup {
    return this.form.controls.timeBaseElimination as FormGroup;
  }

  get timeBaseWarning(): FormGroup {
    return this.form.controls.timeBaseElimination.get('warning') as FormGroup;
  }

  constructor() {
    this.form = this.fb.group({
      diskBaseElimination: this.fb.group({
        mountPoint: [{ value: '/', disabled: true }],
        enabled: [false],
        lowerBound: [null, [Validators.min(0), Validators.max(100)]],
        upperBound: [null, [Validators.min(0), Validators.max(100)]],
        warning: this.fb.group({
          enabled: [false],
          startThreshold: [null, [Validators.min(0), Validators.max(100)]],
          step: [null, [Validators.min(0), Validators.max(100)]],
        }),
      }),
      timeBaseElimination: this.fb.group(
        {
          enabled: [false],
          elapsedInSeconds: [null, [Validators.min(2)]],
          warning: this.fb.group({
            enabled: [false],
            startThreshold: [null, [Validators.required, Validators.min(1)]],
            step: [null, [Validators.required, Validators.min(1)]],
          }),
        },
        { validators: this.timeBaseEliminationValidator }
      ),
    });
    this.store.getConfig();
  }

  ngOnInit(): void {
    this.store
      .select(state => state.config)
      .pipe(tap(res => this.form?.patchValue(res!)))
      .subscribe();
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.submitLoading = this.store.select(state => state.postLoading);

    this.diskBaseElimination.controls.enabled.valueChanges
      .pipe(
        tap(value => {
          this.toggleDiskBaseEliminationControls(value);
        })
      )
      .subscribe();

    // Toggle controls based on the 'enabled' field for warning (inside diskBaseElimination)
    this.diskBaseWarning.controls.enabled.valueChanges
      .pipe(
        tap(value => {
          this.toggleDiskBaseWarningControls(value);
        })
      )
      .subscribe();

    this.timeBaseElimination.controls.enabled.valueChanges
      .pipe(
        tap(value => {
          this.toggleTimeBaseEliminationControls(value);
        })
      )
      .subscribe();

    this.timeBaseWarning.controls.enabled.valueChanges
      .pipe(
        tap(value => {
          this.toggleTimeBaseWarningControls(value);
        })
      )
      .subscribe();
  }

  toggleDiskBaseEliminationControls(isEnabled: boolean): void {
    Object.keys(this.diskBaseElimination.controls).forEach(key => {
      const control = this.diskBaseElimination.get(key);

      if (key !== 'enabled' && key !== 'mountPoint') {
        isEnabled ? control?.enable() : control?.disable();
      }
    });
    if (!isEnabled) {
      this.toggleDiskBaseWarningControls(false);
    }
  }

  // Toggle controls inside the warning form group based on the enabled field inside warning
  toggleDiskBaseWarningControls(isEnabled: boolean): void {
    // Enable or disable the controls inside the warning group based on the 'enabled' toggle
    Object.keys(this.diskBaseWarning.controls).forEach(key => {
      const control = this.diskBaseWarning.get(key);

      // Enable or disable based on the toggle
      if (key !== 'enabled') {
        isEnabled ? control?.enable() : control?.disable();
      }
    });
  }

  private timeBaseEliminationValidator: ValidatorFn = (
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

  toggleTimeBaseEliminationControls(isEnabled: boolean): void {
    Object.keys(this.timeBaseElimination.controls).forEach(key => {
      const control = this.timeBaseElimination.get(key);

      if (key !== 'enabled') {
        isEnabled ? control?.enable() : control?.disable();
      }
    });
    if (!isEnabled) {
      this.toggleTimeBaseWarningControls(false);
    }
  }

  toggleTimeBaseWarningControls(isEnabled: boolean): void {
    // Enable or disable the controls inside the warning group based on the 'enabled' toggle
    Object.keys(this.timeBaseWarning.controls).forEach(key => {
      const control = this.timeBaseWarning.get(key);

      // Enable or disable based on the toggle
      if (key !== 'enabled') {
        isEnabled ? control?.enable() : control?.disable();
      }
    });
  }

  submitForm() {}
}
