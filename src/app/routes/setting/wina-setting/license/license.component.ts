import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@shared/services';
import { FileUploadComponent } from '@components';
import { LicenseInfo } from './types/license-info';
import { LicenseService } from './services/license.service';
import { BreadcrumbComponent } from '@shared/components';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';

/**
 * a component for wina license management
 */
@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatGridListModule,
    MatChipsModule,
    FileUploadComponent,
    BreadcrumbComponent,
    MatProgressSpinner,
    MatProgressBar,
  ],
})
export class LicenseComponent implements AfterViewInit {
  fb = inject(FormBuilder);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  service = inject(LicenseService);

  @ViewChild('inputBox') private _inputBox: ElementRef | undefined;

  /** license inputs form */
  form: FormGroup;
  /** Observable to track loading state of submit action */
  submitLoading$ = new BehaviorSubject<boolean>(false);

  /** Observable to track loading state for fetching license info */
  isLoading$ = new BehaviorSubject<boolean>(false);
  /**
   * to get access to clipboard API.
   */
  private _navigator: Navigator | undefined;
  /**
   * window object to change route.
   */
  private _window: Window | null;

  /**
   * CONSTRUCTOR
   */
  constructor(@Inject(DOCUMENT) private _document: Document) {
    this._navigator = this._document.defaultView?.navigator;
    this._window = _document.defaultView;
    this.form = this.fb.group({
      activationCode: [{ value: null, disabled: true }],
      machineId: [{ value: null, disabled: true }],
      licenseText: [null, Validators.required],
      licenseFile: [null],
    });
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.service
      .getLicenceInfo()
      .subscribe({
        next: res => {
          this.form.patchValue(res);
          this._patchActivationCode(res.activationCode);
        },
      })
      .add(() => {
        this.isLoading$.next(false);
      });
  }

  /**
   * it would change the local clipboard to the specified clipboard via clipboard service
   */
  copyToClipboard(): void {
    this._navigator?.clipboard.writeText(this.form.controls.activationCode.value).then();
  }

  /**
   * it call when submit button clicked
   * and update license if form is valid
   */
  submitChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitLoading$.next(true);
    this.service
      .registerLicense(this.form.value.licenseText)
      .subscribe({
        next: (res: LicenseInfo) => {
          this._patchActivationCode(res.activationCode);
          this.toast.open(
            this.tr.instant('toast.save', { title: this.tr.instant('menu.wina_setting.license') }),
            'success'
          );
        },
      })
      .add(() => {
        this.submitLoading$.next(false);
      });
  }

  onUploadFile(data: any): void {
    let val = null;
    if (data) {
      val = this._base64ToString(data);
    }
    this.form.controls.licenseText.patchValue(val?.trim());
  }

  /**
   * it convert encoded base64 string value to string value
   * @param str
   */
  private _base64ToString(str: string): string | null {
    const encodedStr = str.split('base64,')[1];
    if (!this._window) return null;
    return this._window.atob(encodedStr)!;
  }

  /** patch activation code value to the input box */
  private _patchActivationCode(value: string): void {
    const codes = value.split('-');
    this._inputBox?.nativeElement.childNodes.forEach((input: any, index: number) => {
      input.value = [codes[index]];
    });
  }
}
