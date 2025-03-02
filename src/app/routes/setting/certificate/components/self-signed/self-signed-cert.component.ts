import { of, tap, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogService, ToastService } from '@shared';
import { CertificateStore } from '../../services/certificate-store.service';
/**
 * this component is create to set ssl certificate config
 */

@Component({
  selector: 'app-self-signed-cert',
  templateUrl: './self-signed-cert.component.html',
  styleUrls: ['./self-signed-cert.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslatePipe,
  ],
})
export class SelfSignedCertComponent implements OnInit, AfterViewInit {
  fb = inject(FormBuilder);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  store = inject(CertificateStore);

  /**
   * create form for test sms
   */
  tlsForm: FormGroup;
  /**
   * show loading on submit form
   */
  submitLoading: Observable<boolean> = of(false);
  /**
   * a flag to show loading on get data
   */
  fetchLoading$: Observable<boolean> = of(false);

  constructor() {
    this.tlsForm = this.fb.group({
      rejectSelfSignedCert: [false],
      tlsParameterHardening: [false],
      crlUpdateIntervalDays: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.store
      .select(state => state.sslConfig)
      .pipe(tap(res => this.tlsForm.patchValue(res!)))
      .subscribe();
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.submitLoading = this.store.select(state => state.postLoading);
  }

  ngAfterViewInit(): void {}

  submit() {
    if (this.tlsForm.invalid) {
      this.tlsForm.markAllAsTouched();
      return;
    }

    this.store.submitForm({
      formValue: this.tlsForm.value,
      confirm: this.tlsForm.value.rejectSelfSignedCert,
    });
  }
}
