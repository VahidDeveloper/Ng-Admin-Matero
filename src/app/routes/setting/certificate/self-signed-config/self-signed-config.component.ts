import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SslPolicy } from './_models/ssl-policy';
import { SslCertificateService } from './_services/ssl-certificate.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared';
/**
 * this component is create to set ssl certificate config
 */

@Component({
  selector: 'app-self-signed-config',
  templateUrl: './self-signed-config.component.html',
  styleUrls: ['./self-signed-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelfSignedConfigComponent implements OnInit {
  /**
   * create form for test sms
   */
  _form: FormGroup;

  /**
   * for showing alert for each possible error on test sms setting
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * show loading on submit form
   */
  _isLoading: boolean | undefined;
  /**
   * a flag to show loading on get data
   */
  _isDataLoading: boolean | undefined;

  constructor(
    private _fb: FormBuilder,
    private _sslCertificateService: SslCertificateService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {
    this._form = _fb.group({
      rejectSelfSignedCert: [false],
      tlsParameterHardening: [true],
      crlUpdateIntervalDays: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._getDefaultSSlPolicy();
  }

  /**
   * submit form value to server
   */
  submit() {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    if (this._form.value.rejectSelfSignedCert) {
      const message = this._translatorService.instant('selfSignInfo');
    } else {
      this._execute();
    }
  }

  /**
   * to post form value to api
   */
  private _execute() {
    this._isLoading = true;
    this._cdr.detectChanges();
    this._sslCertificateService
      .addSSlConfig(this._form.value)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('NewSSLConfigCreatedSuccessfully'),
            'success'
          );
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileAddSSLConfig')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * to get default ssl config
   */
  private _getDefaultSSlPolicy() {
    this._isDataLoading = true;
    this._sslCertificateService
      .getDefaultPolicy()
      .subscribe(
        (res: SslPolicy) => {
          this._form.patchValue(res);
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileGetDefaultSSLConfig')
          );
        }
      )
      .add(() => {
        this._isDataLoading = false;
        this._cdr.detectChanges();
      });
  }
}
