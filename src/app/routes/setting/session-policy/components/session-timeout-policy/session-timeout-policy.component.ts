import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { SessionStore } from '../../services/session-store.service';

@Component({
  selector: 'session-timeout-policy',
  templateUrl: './session-timeout-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTimeoutPolicyComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(SessionStore);

  /** create form for session timeout setting */

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      webTimeoutMinutes: [null, Validators.required],
      connectionTimeoutMinutes: [null, Validators.required],
      connectionTimeoutEnabled: [false],
    });
  }

  ngOnInit(): void {}

  /**
   * if session timeout form is valid
   * update session timeout setting
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.store.setSessionConfig(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
