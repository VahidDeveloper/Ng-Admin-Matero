import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LicenseService } from './_services/license.service';
import { LicenseInfo } from './_models/license-info';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared';

/**
 * a component for wina license management
 */
@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseComponent implements OnInit {
  @ViewChild('inputBox') private _inputBox: ElementRef | undefined;
  /** shown activation code filed when the license has been registered once */
  hasActivationCode = false;
  /** license inputs form */
  form: FormGroup;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /** show loading bar when register new license */
  _submitLoading = false;
  /** show loading bar when get license information */
  _isLoading = false;
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
  constructor(
    private _service: LicenseService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    private _toast: ToastService,
    private _translatorService: TranslateService
  ) {
    this._navigator = this._document.defaultView?.navigator;
    this._window = _document.defaultView;
    this.form = _fb.group({
      activationCode: [{ value: null, disabled: true }],
      machineId: [{ value: null, disabled: true }],
      licenseText: [null, Validators.required],
      licenseFile: [null],
    });
  }

  ngOnInit(): void {
    this._getLicenseInfo();
  }

  /**
   * it would change the local clipboard to the specified clipboard via clipboard service
   */
  copyToClipboard(inputName?: string): void {
    inputName
      ? this._navigator?.clipboard.writeText(this.form.controls.activationCode.value).then()
      : this._navigator?.clipboard.writeText(this.form.controls.machineId.value).then();
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
    this._updateLicense();
  }

  /**
   * it get uploaded file content
   * @param data:string
   */
  onUploadFile(data: string): void {
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

  /**
   * it get license information
   */
  private _getLicenseInfo(): void {
    this._isLoading = true;
    this._service
      .getLicenceInfo()
      .subscribe(
        res => {
          this.form.patchValue(res);
          res.activationCode ? (this.hasActivationCode = true) : (this.hasActivationCode = false);
          this._patchActivationCode(res.activationCode);
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('licenseInfoError')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** patch activation code value to the input box */
  private _patchActivationCode(value: string): void {
    setTimeout(() => {
      const codes = value.split('-');
      this._inputBox?.nativeElement.childNodes.forEach((input: any, index: number) => {
        input.value = [codes[index - 1]];
      });
    });
  }

  /** update wina license */
  private _updateLicense(): void {
    this._submitLoading = true;
    this._service
      .registerLicense(this.form.value.licenseText)
      .subscribe(
        (res: LicenseInfo) => {
          this._patchActivationCode(res.activationCode);
          this._toast.open(
            this._translatorService.instant('WinaLicenseSuccessfullyUpdated'),
            'success'
          );
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('NewLicenseRegisterError')
          );
        }
      )
      .add(() => {
        this._submitLoading = false;
        this._cdr.markForCheck();
      });
  }
}
