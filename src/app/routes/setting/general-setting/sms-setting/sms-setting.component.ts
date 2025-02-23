import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmsSettingService } from './_services/sms-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay, InputRegex } from '@shared';

/**
 * this component is created for test sms
 */
@Component({
  selector: 'app-sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsSettingComponent implements OnInit {
  /**
   * create form for test sms
   */
  _form: FormGroup | undefined;

  /**
   * for showing alert for each possible error on test sms setting
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * show loading on submit form
   */
  _isLoading = false;
  constructor(
    private _fb: FormBuilder,
    private _smsSettingService: SmsSettingService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._form = this._fb.group({
      phoneNumber: [null, [Validators.required, Validators.pattern(InputRegex.phoneNumber)]],
    });
  }

  /**
   * submit form value to server
   */
  submit() {
    if (this._form?.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    this._isLoading = true;
    this._smsSettingService.smsTest(this._form?.value).subscribe(
      () => {
        this._toastService.open(
          `${this._translatorService.instant('testSmsSuccess')} ${this._form?.value.phoneNumber}.`,
          'success'
        );
        this._isLoading = false;
        this._cdr.markForCheck();
      },
      (err: ErrorDisplay) => {
        this._allPossibleErrors.set(err.location, this._translatorService.instant('testSmsError'));
        this._isLoading = false;
        this._cdr.markForCheck();
      }
    );
  }
}
