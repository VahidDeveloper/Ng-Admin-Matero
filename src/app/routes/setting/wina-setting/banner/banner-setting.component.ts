import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService, BannerSettingService } from '@shared/services';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { BannerSetting } from '@shared/interfaces';
import { BreadcrumbComponent } from '@shared/components';

/**
 * a component to configure banner-display which would be shown whenever the user log into the system.
 */
@Component({
  selector: 'app-banner-setting',
  templateUrl: './banner-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    BreadcrumbComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressBar,
    MatProgressSpinner,
    ReactiveFormsModule,
    TranslatePipe,
    MatCheckbox,
    MatError,
    NgIf,
    MatTooltip,
    QuillEditorComponent,
  ],
})
export class BannerComponent implements OnInit {
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  service = inject(BannerSettingService);

  form: FormGroup;
  /** Observable to track loading state of submit action */
  submitLoading$ = new BehaviorSubject<boolean>(false);

  /** Observable to track loading state for fetching banner settings */
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      enabled: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      showWebTimeout: [null, Validators.required],
      showConnectionTimeout: [null, Validators.required],
      loginWarning: [null],
    });
  }

  ngOnInit(): void {
    this.isLoading$.next(true);
    this.service
      .getBannerSetting()
      .subscribe({
        next: (res: BannerSetting) => {
          this.form.patchValue(res);
        },
      })
      .add(() => {
        this.isLoading$.next(false);
      });
  }

  submitChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this._updateSetting();
  }

  private _updateSetting(): void {
    this.submitLoading$.next(true);
    this.service
      .updateBannerSetting(this.form.value)
      .subscribe({
        next: () => {
          this.toast.open(
            this.tr.instant('toast.save', { title: this.tr.instant('menu.wina_setting.banner') }),
            'success'
          );
        },
      })
      .add(() => {
        this.submitLoading$.next(false);
      });
  }
}
