import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SessionTimoutPolicyService, ToastService } from '@shared/services';
import { TranslateService } from '@ngx-translate/core';

/** mange session timeout policy */
@Component({
  selector: 'app-session-timeout-policy',
  templateUrl: './session-timeout-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTimeoutPolicyComponent implements OnInit {
  /**
   * for showing alert for each possible error on manage session timeout policy
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /** create form for session timeout setting */
  _form: FormGroup;
  /** loading indicator for update  session timeout setting */
  _updateLoading: boolean | undefined;
  /** loading indicator for get session timeout setting */
  _isLoading: boolean | undefined;

  constructor(
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _sessionTimoutPolicyService: SessionTimoutPolicyService,
    private _translatorService: TranslateService
  ) {
    this._form = _fb.group({
      webTimeoutMinutes: [null, Validators.required],
      connectionTimeoutMinutes: [null, Validators.required],
      connectionTimeoutEnabled: [false],
    });
  }

  ngOnInit(): void {
    this._getSessionConfig();
  }

  /** it gets session timeout policy settings */
  private _getSessionConfig(): void {
    this._isLoading = true;
    this._sessionTimoutPolicyService
      .getSetting()
      .subscribe(
        res => {
          this._form.patchValue(res);
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringGetSessionTimeoutSetting')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * if session timeout form is valid
   * update session timeout setting
   */
  saveChanges(): void {
    if (this._form.valid) {
      this._updateSetting();
    } else {
      this._form.markAllAsTouched();
      this._toastService.open(this._translatorService.instant('InvalidForm'), 'succes');
    }
  }

  /** it should be update session timeout policy setting */
  private _updateSetting(): void {
    this._updateLoading = true;
    this._sessionTimoutPolicyService
      .updateSetting(this._form.value)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('SessionTimeoutSettingUpdatedSuccessfully'),
            'success'
          );
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringUpdateSessionTimeoutSetting')
          );
        }
      )
      .add(() => {
        this._cdr.markForCheck();
        this._updateLoading = false;
      });
  }
}
