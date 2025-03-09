import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { VideoConversionTimeService } from './_services/video-conversion-time.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay } from '@shared';

/**
 * this component is created for test sms
 */
@Component({
  selector: 'app-video-conversion-time',
  templateUrl: './video-conversion-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoConversionTimeComponent implements OnInit {
  _form: FormGroup | undefined;
  _allPossibleErrors = new Map<string, string>();
  _isLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _conversionTimeSettingService: VideoConversionTimeService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._form = this._fb.group({
      cronExpression: [null, [Validators.required]],
      maxDurationMinutes: [null, [Validators.required]],
    });
    this.getEncoderConfig();
  }

  private getEncoderConfig() {
    this._conversionTimeSettingService.getEncoderConfig().subscribe((res: any) => {
      if (res) {
        this._form?.patchValue(res);
      }
    });
  }

  submit() {
    if (this._form?.invalid) {
      this._form?.markAllAsTouched();
      return;
    }
    this._isLoading = true;
    this._conversionTimeSettingService.setEncoderConfig(this._form?.value).subscribe({
      next: () => {
        this._toastService.open(
          this._translatorService.instant('TheRequestWasSuccessfullySubmitted'),
          'success'
        );
        this._isLoading = false;
        this._cdr.markForCheck();
      },
      error: (err: ErrorDisplay) => {
        this._allPossibleErrors.set(
          err?.location,
          this._translatorService.instant('An Error Has Occurred')
        );
        this._isLoading = false;
        this._cdr.markForCheck();
      },
    });
  }
}
