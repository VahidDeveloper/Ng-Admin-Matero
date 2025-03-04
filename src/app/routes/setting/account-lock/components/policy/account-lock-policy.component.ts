import { Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountLockStore } from '../../_services/account-lock-store.service';

/**
 * this component is created to set policy for locked user in a connection
 */
@Component({
  selector: 'app-account-lock-policy',
  templateUrl: './account-lock-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslatePipe,
  ],
  styles: `
    .policy-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 500px;
      padding: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .submit-button {
      align-self: flex-end;
    }
  `,
})
export class AccountLockPolicyComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(AccountLockStore);
  form: FormGroup;
  submitLoading: Observable<boolean> = of(false);
  fetchLoading$: Observable<boolean> = of(false);

  constructor() {
    this.form = this.fb.group({
      active: [false],
      lockTimeMinutes: [null, Validators.required],
      maxFailedAttempts: [null, Validators.required],
      resetTimeMinutes: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.store
      .select(state => state.policy)
      .pipe(tap(res => this.form.patchValue(res!)))
      .subscribe();
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.submitLoading = this.store.select(state => state.postLoading);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.setPolicy(this.form.value);
  }
}
