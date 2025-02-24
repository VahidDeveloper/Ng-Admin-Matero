import { InputRegex } from '@shared/models';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationalPassword, StoredPasswordService, ToastService } from '@shared';

@Component({
  selector: 'app-organizational-password-add-edit',
  templateUrl: './organizational-password-add-edit.component.html',
  styleUrls: ['./organizational-password-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalPasswordAddEditComponent implements OnInit, OnChanges {
  /** selected password from list */
  @Input() selectedPassword: OrganizationalPassword | undefined;
  /** Password inputs form */
  _form: FormGroup;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors: Record<string, string> = {};
  /**
   * loading indicator when submit modal
   */
  _isLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _storedPasswordService: StoredPasswordService,
    private _toast: ToastService,
    private _translatorService: TranslateService
  ) {
    this._form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      address: [null, [Validators.required, Validators.pattern(InputRegex.uriPattern)]],
      token: [null, Validators.required],
      readonly: [false],
      ssl: [false],
      certificate: [null],
    });
  }

  /**
   * @param changes:SimpleChanges if is changed selectedPassword new value patch to form
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPassword.currentValue !== changes.selectedPassword.previousValue) {
      this._form?.patchValue(changes.selectedPassword.currentValue);
      this._form?.value.id && this._tokenValidation();
      this._cdr.markForCheck();
    }
  }

  ngOnInit() {}

  /**
   * fire when click on modal submit button
   */
  onSaveModal(): void {
    if (this._form?.invalid) {
      this._form?.markAllAsTouched();
      return;
    }
    this._form?.value.id
      ? this._updatePassword(this._form?.value)
      : this._saveNewPassword(this._form?.value);
  }

  /**
   * fire when ssl switch changes
   * @param event:boolean
   */
  onSslChange(event: any): void {
    if (event.target.checked) {
      this._form?.get('certificate')?.setValidators([Validators.required]);
      this._form?.get('certificate')?.enable();
    } else {
      this._form?.get('certificate')?.removeValidators([Validators.required]);
      this._form?.get('certificate')?.disable();
      this._form?.patchValue({ certificate: '' });
    }
    this._form?.get('certificate')?.updateValueAndValidity();
    this._cdr.markForCheck();
  }

  /**
   * it will save password
   * @param data:OrganizationalPassword
   */
  private _saveNewPassword(data: OrganizationalPassword): void {
    this._isLoading = true;
    this._storedPasswordService
      .addOrganizationalPassword(data)
      .subscribe(
        res => {
          this._toast.open(
            this._translatorService.instant('AddedNewPasswordSuccessfully'),
            'success'
          );
          // this._modalService.closeActiveModal(res);
        },
        error => {
          this._allPossibleErrors[error.location] = this._translatorService.instant(
            'AnErrorOccurredDuringWhenSavePassword'
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * it will update selected password
   * @param data:OrganizationalPassword
   */
  private _updatePassword(data: OrganizationalPassword): void {
    this._storedPasswordService
      .editOrganizationalPassword(data)
      .subscribe(
        res => {
          this._toast.open(
            this._translatorService.instant('UpdateSelectedPasswordSuccessfully'),
            'success'
          );
          // this._modalService.closeActiveModal(res);
        },
        error => {
          this._allPossibleErrors[error.location] = this._translatorService.instant(
            'AnErrorOccurredDuringWhenSavePassword'
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * it will update token validation, active or di-active on add or edit mode
   */
  private _tokenValidation(): void {
    this._form?.get('token')?.removeValidators([Validators.required]);
    this._form?.get('token')?.updateValueAndValidity();
  }
}
