import { finalize } from 'rxjs';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFabButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { InputRegex } from '@shared/models';
import { ToastService } from '@shared/services';
import { SmsSettingService } from './services/sms-setting.service';

/**
 * this component is created for test sms
 */
@Component({
  selector: 'app-sms',
  templateUrl: './sms-setting.component.html',
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
    MatFabButton,
    MatProgressSpinner,
  ],
})
export class SmsSettingComponent implements OnInit {
  tr = inject(TranslateService);
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  service = inject(SmsSettingService);
  form: FormGroup;
  submitLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      phoneNumber: [null, [Validators.required, Validators.pattern(InputRegex.phoneNumber)]],
    });
  }

  ngOnInit(): void {}

  /**
   * submit form value to server
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitLoading.set(true);
    this.service
      .smsTest(this.form?.value)
      .pipe(finalize(() => this.submitLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.open(
            this.tr.instant('toast.save', {
              title: this.tr.instant('menu.wina_setting.video_conversion'),
            }),
            'success'
          );
        },
      });
  }
}
