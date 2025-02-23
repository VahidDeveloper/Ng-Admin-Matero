import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, BannerSettingService, BannerSetting } from '@shared';

/**
 * a component to configure banner-display which would be shown whenever the user log into the systme.
 */
@Component({
  selector: 'app-banner-setting',
  templateUrl: './banner-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent implements OnInit {
  /** list of all possible errors in the page */
  _allPossibleErrors = new Map<string, string>();
  /** create form for session timeout setting */
  _form: FormGroup;
  /** when true, loading would be shown on submit button */
  _updateLoading = false;
  /** when true, loading would be shown */
  _isLoading = false;

  constructor(
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _bannerSettingService: BannerSettingService,
    private _translatorService: TranslateService
  ) {
    this._form = _fb.group({
      enabled: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      showWebTimeout: [null, Validators.required],
      showConnectionTimeout: [null, Validators.required],
      loginWarning: [null],
    });
  }

  ngOnInit(): void {
    this._getBannerSetting();
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
      this._toastService.open(this._translatorService.instant('InvalidForm'), 'warning');
    }
  }

  /** it would get banner config from server to be shown on the form */
  private _getBannerSetting(): void {
    this._isLoading = true;
    this._bannerSettingService
      .getBannerSetting()
      .subscribe({
        next: (res: BannerSetting) => {
          this._form.patchValue(res);
        },
        error: err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileGettingBannerDisplaySetting')
          );
        },
      })
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** it would update banner-display setting based on the form */
  private _updateSetting(): void {
    this._updateLoading = true;
    this._bannerSettingService
      .updateBannerSetting(this._form.value)
      .subscribe({
        next: () => {
          this._toastService.open(
            this._translatorService.instant('BannerDisplaySettingHasBeenUpdatedSuccessfully'),
            'success'
          );
        },
        error: error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredWhileUpdatingBannerDisplaySetting')
          );
        },
      })
      .add(() => {
        this._cdr.markForCheck();
        this._updateLoading = false;
      });
  }
}
