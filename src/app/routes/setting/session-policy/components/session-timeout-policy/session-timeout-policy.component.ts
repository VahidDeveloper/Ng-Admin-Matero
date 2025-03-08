import { Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SessionStore } from '../../services/session-store.service';

@Component({
  selector: 'session-timeout-policy',
  templateUrl: './session-timeout-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatCheckbox,
    MatProgressSpinner,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
  ],
})
export class SessionTimeoutPolicyComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(SessionStore);

  submitLoading: Observable<boolean> = of(false);

  fetchLoading$: Observable<boolean> = of(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      webTimeoutMinutes: [null, Validators.required],
      connectionTimeoutMinutes: [null, Validators.required],
      connectionTimeoutEnabled: [false],
    });
  }

  ngOnInit(): void {
    this.store
      .select(state => state.sessionConfig)
      .pipe(tap(res => this.form?.patchValue(res!)))
      .subscribe();
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.submitLoading = this.store.select(state => state.postLoading);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.setSessionConfig(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
