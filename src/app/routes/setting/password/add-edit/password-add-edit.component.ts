import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormValidators, StoredPassword, StoredPasswordService, ToastService } from '@shared';

@Component({
  selector: 'app-password-add-edit',
  templateUrl: './password-add-edit.component.html',
  styleUrls: ['./password-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordAddEditComponent implements OnInit, OnChanges {
  /** selected password from list */
  @Input() selectedPassword: StoredPassword | undefined;
  @Input() isPersonalPage: boolean | undefined;
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
      username: [null, Validators.required],
      password: [null, [Validators.required, FormValidators._passwordsEquality('repeatPassword')]],
      repeatPassword: [null, [Validators.required, FormValidators._passwordsEquality('password')]],
      domain: [null],
      identifierKey: [null],
    });
    this._cdr.markForCheck();
  }

  /**
   * @param changes:SimpleChanges if is changed selectedPassword new value patch to form
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPassword.currentValue !== changes.selectedPassword.previousValue) {
      this._form.patchValue(changes.selectedPassword.currentValue);
    }
  }

  ngOnInit() {
    if (this._form.value.id) {
      this._form.controls.password.clearValidators();
      this._form.controls.repeatPassword.clearValidators();
    }
  }

  /**
   * fire when click on modal submit button
   */
  onSaveModal(): void {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    delete this._form.value.repeatPassword;
    this._form.value.id
      ? this._updatePassword(this._form.value)
      : this._saveNewPassword(this._form.value);
  }

  /**
   * it will update selected password
   * @param data:PasswordSettingModel
   */
  private _saveNewPassword(data: StoredPassword): void {
    this._isLoading = true;
    this._storedPasswordService
      .addEditStoredPassword(this.isPersonalPage!, data)
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
   * @param data:PasswordSettingModel
   */
  private _updatePassword(data: StoredPassword): void {
    this._storedPasswordService
      .addEditStoredPassword(this.isPersonalPage!, data)
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
}
