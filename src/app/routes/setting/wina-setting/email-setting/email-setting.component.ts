import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmailSettingService } from './_services/email-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay, InputRegex } from '@shared';

/**
 * a class for set and update email config
 * test email address before set it
 */
@Component({
  selector: 'app-email-setting',
  templateUrl: './email-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSettingComponent implements OnInit {
  @ViewChild('certModal')
  certModal!: TemplateRef<any>;
  @ViewChild('testMailModal')
  testMailModal!: TemplateRef<any>;

  /**
   * for showing alert for each possible error on change email setting
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * for showing alert for each possible error on test email address
   * the keys will be gotten from service
   */
  _allPossibleTestEmailErrors = new Map<string, string>();
  /** create form for set email configs */
  _form!: FormGroup;
  /** create form for test email address */
  _testEmailForm: FormGroup;
  /** loading indicator for update email config service */
  _updateLoading!: boolean;
  /** loading indicator for test email address */
  _testEmailLoading!: boolean;
  /** loading indicator for get email configs */
  _getEmailConfigLoading!: boolean;
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

  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _service: EmailSettingService,
    private _translatorService: TranslateService
  ) {
    this._generateForm();
    this._testEmailForm = _fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit(): void {
    this._form?.markAllAsTouched();
    this._getEmailConfigLoading = true;
    this._service.getEmailConfig().subscribe(
      res => {
        this._getEmailConfigLoading = false;
        this._form.patchValue(res);
        this._resetCertControls();
        this._cdr.markForCheck();
      },
      error => {
        this._getEmailConfigLoading = false;
        this._allPossibleErrors.set(
          error.location,
          this._translatorService.instant('savedEmailSettingsError')
        );
        this._cdr.markForCheck();
      }
    );
    this._form?.controls.address.valueChanges.subscribe(() => {
      this._resetCertControls();
    });
  }

  /** when click on submit button first test email address
   * if not problem in testing update email configs
   * if received problem in testing email open confirm modal and get confirm from user
   */
  saveChanges(): void {
    if (this._form.valid) {
      if (this._form.value.ignoreCert) {
        this._updateConfig();
      } else {
        this._connectionTestBeforeUpdate();
      }
    } else {
      this._form.markAllAsTouched();
      this._toastService.open(this._translatorService.instant('InvalidForm'), 'warning');
    }
  }

  /** it test email address */
  testEmail(): void {
    if (this._testEmailForm.valid) {
      this._testEmailLoading = true;
      this._mapFormValuesToServerObject();
      this._service
        .testEmailSenderConfig(this._testEmailForm.value.email, this._form.value)
        .subscribe(
          () => {
            // this._modalService.dismissAllModal();
            this._toastService.open(
              this._translatorService.instant('TestEmailSentSuccessfully'),
              'success'
            );
          },
          (err: ErrorDisplay) => {
            this._handleConnectionError(err, true);
          }
        )
        .add(() => {
          this._testEmailLoading = false;
          this._cdr.markForCheck();
        });
    }
  }

  /** open new bootstrap modal and get email address from user for test email address */
  openCertModal(content: TemplateRef<any>): void {
    // this._modalService.showModal(content, {
    //   submitBtnLabel: this._translatorService.instant('YesAcceptIt'),
    //   backdrop: false,
    // });
  }

  /** open new bootstrap modal and get email address from user for test email address */
  openTestMailModal(content: TemplateRef<any>): void {
    this._isTestingMod = true;
    // this._modalService
    //   .showModal(content, {
    //     submitBtnLabel: this._translatorService.instant('YesTestIt'),
    //     backdrop: false,
    //   })
    //   .subscribe(
    //     () => {},
    //     () => {}
    //   )
    //   .add(() => {
    //     this._cdr.markForCheck();
    //     this._isTestingMod = false;
    //     this._testEmailForm.controls.email.reset();
    //   });
  }

  /** retry update email configuration or test email address with accept certification  */
  _acceptCertificate(): void {
    this._form.controls.acceptCert.patchValue(true);
    this._form.controls.certificate.patchValue(this._certificateInfo);
    this._isTestingMod ? this.testEmail() : this._updateConfig();
  }

  /** it called before save any syslog servers and test connection */
  private _connectionTestBeforeUpdate(): void {
    this._updateLoading = true;
    this._service
      .testEmailSenderConfig(this._testEmailForm.value.email, this._form.value)
      .subscribe(
        () => {
          this._updateConfig();
        },
        (err: ErrorDisplay) => {
          this._resetCertControls();
          this._handleConnectionError(err);
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** it reset certification form controls */
  private _resetCertControls(): void {
    this._form.controls.acceptCert.patchValue(null);
    this._form.controls.certificate.patchValue(null);
  }

  /** handle connection errors when saving syslog server */
  private _handleConnectionError(err: any, testMail = false): void {
    if (err.certificateError) {
      this._previousCertificate = err.expectedCert;
      this._certificateInfo = err.actualCert;
      this.openCertModal(this.certModal);
    } else if (err.serverDown && !testMail) {
      this._openConfirmModal();
    } else {
      this._allPossibleTestEmailErrors.set(
        err.location,
        this._translatorService.instant('certificateError2')
      );
    }
    this._cdr.markForCheck();
  }

  /** generate new instance of formGroup with form builder form for set email configs */
  private _generateForm(): void {
    this._form = this._fb.group({
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
  }

  /** mapping selectors values */
  private _mapFormValuesToServerObject(): void {
    this._form.controls.authenticationMethod.patchValue(
      this._form.value.authenticationMethod?.label ?? this._form.value.authenticationMethod
    );
    this._form.controls.connectionSecurity.patchValue(
      this._form.value.connectionSecurity?.label ?? this._form.value.connectionSecurity
    );
  }

  /** update email configuration */
  private _updateConfig(): void {
    this._updateLoading = true;
    this._mapFormValuesToServerObject();
    this._service
      .updateEmailConfig(this._form.value)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('EmailSettingsUpdatedSuccessfully'),
            'success'
          );
        },
        err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('emailConfigUpdateError')
          );
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
        // this._modalService.dismissAllModal();
      });
  }

  /** open new confirmation modal when server shutdown and get confirm from user */
  private _openConfirmModal(): void {
    // const config: ConfirmationModalConfigs = {
    //   title: this._translatorService.instant('EmailConnectionTest'),
    //   submitLabel: this._translatorService.instant('YesSaveIt'),
    // };
    // this._confirmationModal
    //   .openTextual(this._translatorService.instant('serverShutdownError'), config)
    //   .subscribe(() => {
    //     this._updateConfig();
    //   });
  }
}
