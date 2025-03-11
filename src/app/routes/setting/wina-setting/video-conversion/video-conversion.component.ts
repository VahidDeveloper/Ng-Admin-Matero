import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { ToastService } from '@shared/services';
import { VideoConversionTime } from './types/video-conversion-time';
import { VideoConversionTimeService } from './services/video-conversion-time.service';

/**
 * this component is created for test sms
 */
@Component({
  templateUrl: './video-conversion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgIf,
    TranslatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    MatTooltip,
    MatProgressBar,
    MatFabButton,
    MatProgressSpinner,
  ],
})
export class VideoConversionComponent implements OnInit {
  tr = inject(TranslateService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  service = inject(VideoConversionTimeService);
  form: FormGroup;
  isLoading = false;
  /** using signal for detect changes and update UI */
  submitLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      cronExpression: [null, [Validators.required]],
      maxDurationMinutes: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.service.getData().subscribe({
      next: (res: VideoConversionTime) => {
        this.form.patchValue(res);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitLoading.set(true);
    this.service.save(this.form?.value).subscribe({
      next: () => {
        this.toast.open(
          this.tr.instant('toast.save', {
            title: this.tr.instant('menu.wina_setting.video_conversion'),
          }),
          'success'
        );
      },
      complete: () => {
        this.submitLoading.set(false);
      },
    });
  }
}
