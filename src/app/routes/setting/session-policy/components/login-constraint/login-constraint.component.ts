import { Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SessionStore } from '../../services/session-store.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'login-constraint',
  templateUrl: './login-constraint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatProgressSpinner,
  ],
})
export class LoginConstraintComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(SessionStore);
  tr = inject(TranslateService);

  form: FormGroup;
  submitLoading: Observable<boolean> = of(false);
  fetchLoading$: Observable<boolean> = of(false);

  constructor() {
    this.form = this.fb.group({
      captchaSessionThreshold: [
        null,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      captchaIpThreshold: [null, [Validators.required, Validators.min(5), Validators.max(1000)]],
      lockThreshold: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      lockMinutes: [null, [Validators.required, Validators.min(5), Validators.max(365 * 24 * 60)]],
      defaultOtpMedia: [null, Validators.required],
      otpValidTimeSeconds: [
        null,
        [Validators.required, Validators.min(120), Validators.max(5 * 60 * 60)],
      ],
      otpRetryMax: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      otpResendMax: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      tokenRetryMax: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      minPassLength: [null, [Validators.required, Validators.min(8), Validators.max(128)]],
    });
  }

  ngOnInit(): void {
    this.store
      .select(state => state.loginConfig)
      .pipe(tap(res => this.form?.patchValue(res!)))
      .subscribe();
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.submitLoading = this.store.select(state => state.postLoading);
  }

  /**
   * when user submit for , saved service should called and check error
   */
  submitForm(): void {
    this.store.setLoginConfig(this.form?.value);
  }
}
