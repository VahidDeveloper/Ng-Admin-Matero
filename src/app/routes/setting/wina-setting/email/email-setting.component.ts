import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { tap } from 'rxjs';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton, MatFabButton } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

import { IdentityErrorComponent } from '@shared/components';
import { EmailSettingService } from './services/email-setting.service';
import { ToastService, ErrorDisplay, InputRegex, ConfirmDialogService } from '@shared';

/**
 * a class for set and update email config
 * test email address before set it
 */
@Component({
  selector: 'app-email-setting',
  templateUrl: './email-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFabButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressBar,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    MatTooltip,
    MatSelectModule,
    MatCheckbox,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    IdentityErrorComponent,
  ],
})
export class EmailSettingComponent implements OnInit {
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  service = inject(EmailSettingService);
  confirm = inject(ConfirmDialogService);
  dialog = inject(MatDialog);

  @ViewChild('certModal') certModal: TemplateRef<any> | undefined;

  /** create form for set email configs */
  form: FormGroup;
  /** create form for test email address */
  testEmailForm: FormGroup;

  /** loading indicator for get email configs */
  fetchLoading!: boolean;
  /** loading indicator for update email config service */
  submitLoading = signal(false);
  /** loading indicator for test email address */
  testEmailLoading = signal(false);
  /** used to accept certificate */
  _isTestingMod!: boolean;
  /** connection security types */
  _connectionSecurityValues = ['none', 'startTls', 'ssl'];
  /** authentication types */
  _authenticationValues = ['none', 'plain', 'login', 'digestMd5', 'ntlm', 'xoauth2'];
  /**
   * this information would be shown to the user to decide whether to accept the connection or reject it.
   * Note that during the component's lifecycle, only this input would be changed.
   */
  _certificateInfo!: Readonly<Record<string, string>>;
  /** previous certificate information which has to be gotten from server */
  _previousCertificate: Record<string, string> = {};

  constructor() {
    this.form = this.fb.group({
      address: [null, [Validators.required, Validators.pattern(InputRegex.ipVsHostname)]],
      port: [null, Validators.required],
      username: [null, Validators.required],
      name: [null],
      password: [null],
      authenticationMethod: [null, Validators.required],
      connectionSecurity: [null, Validators.required],
      ignoreCert: [null],
      acceptCert: [null],
      certificate: [null],
    });
    this.testEmailForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit(): void {
    this.form?.markAllAsTouched();
    this.fetchLoading = true;
    this.service.getEmailConfig().subscribe({
      next: res => {
        this.fetchLoading = false;
        this.form.patchValue(res);
        this._resetCertControls();
      },
      complete: () => (this.fetchLoading = false),
    });
    this.form?.controls.address.valueChanges.subscribe(() => {
      this._resetCertControls();
    });
  }

  openTestMailDialog(content: TemplateRef<any>): void {
    this._isTestingMod = true;
    this.dialog.open(content, { minWidth: 400, disableClose: true });
  }

  testEmailAddress(): void {
    if (this.testEmailForm.valid) {
      this.testEmailLoading.set(true);
      this._mapFormValuesToServerObject();
      this.service
        .testEmailSenderConfig(this.testEmailForm.value.email, this.form.value)
        .subscribe({
          next: () => {
            // this._modalService.dismissAllModal();
            this.toast.open(this.tr.instant('TestEmailSentSuccessfully'), 'success');
          },
          error: (err: ErrorDisplay) => {
            this._handleConnectionError(err, true);
          },
          complete: () => {
            this.testEmailLoading.set(false);
            this._isTestingMod = false;
            this.testEmailForm.controls.email.reset();
          },
        });
    }
  }

  /** when click on submit button first test email address
   * if not problem in testing update email configs
   * if received problem in testing email open confirm modal and get confirm from user
   */
  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.value.ignoreCert) {
      this._updateConfig();
    } else {
      this._connectionTestBeforeUpdate();
    }
  }

  /** retry update email configuration or test email address with accept certification  */
  _acceptCertificate(): void {
    this.form.controls.acceptCert.patchValue(true);
    this.form.controls.certificate.patchValue(this._certificateInfo);
    this._isTestingMod ? this.testEmailAddress() : this._updateConfig();
  }

  /** it called before save any syslog servers and test connection */
  private _connectionTestBeforeUpdate(): void {
    this.submitLoading.set(true);
    this.service.testEmailSenderConfig(this.testEmailForm.value.email, this.form.value).subscribe({
      next: () => {
        this._updateConfig();
      },
      error: (err: ErrorDisplay) => {
        this._resetCertControls();
        this._handleConnectionError(err);
        this.submitLoading.set(false);
      },
      complete: () => {
        this.submitLoading.set(false);
      },
    });
  }

  /** it reset certification form controls */
  private _resetCertControls(): void {
    this.form.controls.acceptCert.patchValue(null);
    this.form.controls.certificate.patchValue(null);
  }

  /** handle connection errors when saving syslog server */
  private _handleConnectionError(err: any, testMail = false): void {
    if (err.certificateError) {
      this._previousCertificate = err.expectedCert;
      this._certificateInfo = err.actualCert;
      this.dialog.open(this.certModal!);
    } else if (err.serverDown && !testMail) {
      this._openConfirmModal();
    }
  }

  /** mapping selectors values */
  private _mapFormValuesToServerObject(): void {
    this.form.controls.authenticationMethod.patchValue(
      this.form.value.authenticationMethod?.label ?? this.form.value.authenticationMethod
    );
    this.form.controls.connectionSecurity.patchValue(
      this.form.value.connectionSecurity?.label ?? this.form.value.connectionSecurity
    );
  }

  /** update email configuration */
  private _updateConfig(): void {
    this.submitLoading.set(true);
    this._mapFormValuesToServerObject();
    this.service.updateEmailConfig(this.form.value).subscribe({
      next: () => {
        this.toast.open(
          this.tr.instant('toast.save', { title: this.tr.instant('menu.wina_setting.email') }),
          'success'
        );
      },
      complete: () => {
        this.submitLoading.set(false);
      },
    });
  }

  /** open new confirmation modal when server shutdown and get confirm from user */
  private _openConfirmModal(): void {
    this.confirm
      .confirm('', this.tr.instant('pages.wina_setting.email.email_connection_test'))
      .pipe(tap(() => this._updateConfig()));
  }
}
