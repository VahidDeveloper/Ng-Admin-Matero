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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { StorageStore } from './services/storage-store.service';
import { DisableControlDirective } from '@shared';
import { timeBaseEliminationValidator } from './types/validation';

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
        { validators: timeBaseEliminationValidator }
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
      .pipe(tap(value => this.toggleDiskBaseEliminationControls(value)))
      .subscribe();

    this.diskBaseWarning.controls.enabled.valueChanges
      .pipe(tap(value => this.toggleWarningControls(this.diskBaseWarning, value)))
      .subscribe();

    this.timeBaseElimination.controls.enabled.valueChanges
      .pipe(tap(value => this.toggleTimeBaseEliminationControls(value)))
      .subscribe();

    this.timeBaseWarning.controls.enabled.valueChanges
      .pipe(tap(value => this.toggleWarningControls(this.timeBaseWarning, value)))
      .subscribe();
  }

  toggleDiskBaseEliminationControls(isEnabled: boolean): void {
    Object.keys(this.diskBaseElimination.controls).forEach(key => {
      const control = this.diskBaseElimination.get(key);
      if (key !== 'enabled' && key !== 'mountPoint') {
        isEnabled ? control?.enable() : control?.disable();
      }
    });
    this.toggleWarningControls(this.diskBaseWarning, false);
    if (isEnabled) {
      this.diskBaseWarning.get('enabled')?.enable();
    }
  }

  toggleTimeBaseEliminationControls(isEnabled: boolean): void {
    Object.keys(this.timeBaseElimination.controls)
      .filter(key => key !== 'enabled')
      .forEach(key => {
        isEnabled
          ? this.timeBaseElimination.get(key)?.enable()
          : this.timeBaseElimination.get(key)?.disable();
      });
    this.toggleWarningControls(this.timeBaseWarning, false);
    if (isEnabled) {
      this.timeBaseWarning.get('enabled')?.enable();
    }
  }

  toggleWarningControls(warningGroup: FormGroup, isEnabled: boolean): void {
    // Enable or disable the controls inside the warning group based on the 'enabled' toggle
    Object.keys(warningGroup.controls).forEach(key => {
      if (key !== 'enabled') {
        isEnabled ? warningGroup.get(key)?.enable() : warningGroup.get(key)?.disable();
      }
    });
  }

  submitForm() {}
}
