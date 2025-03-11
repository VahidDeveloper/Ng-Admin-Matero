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
    this.store.getConfig();
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
        tap(value =>
          this.store.toggleEliminationControls({
            formGroup: this.diskBaseElimination,
            warningGroup: this.diskBaseWarning,
            isEnabled: value,
          })
        )
      )
      .subscribe();

    this.diskBaseWarning.controls.enabled.valueChanges
      .pipe(
        tap(value =>
          this.store.toggleWarningControls({ warningGroup: this.diskBaseWarning, isEnabled: value })
        )
      )
      .subscribe();

    this.timeBaseElimination.controls.enabled.valueChanges
      .pipe(
        tap(value =>
          this.store.toggleEliminationControls({
            formGroup: this.timeBaseElimination,
            warningGroup: this.timeBaseWarning,
            isEnabled: value,
          })
        )
      )
      .subscribe();

    this.timeBaseWarning.controls.enabled.valueChanges
      .pipe(
        tap(value =>
          this.store.toggleWarningControls({ warningGroup: this.timeBaseWarning, isEnabled: value })
        )
      )
      .subscribe();
  }

  submitForm() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      this.store.setConfig(formData);
    }
  }
}
