import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { InputRegex } from '@shared/models';
import { FormValidators } from '@shared/models/form-validators';
import { UserPasswordService, ToastService, LoginConstraintConfigService } from '@shared/services';

/**
 * a component to reset users' or current user's password
 */
@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetUserPasswordComponent implements OnInit {
  /** if true, current user's password should be changed. */
  @Input() currentUser: boolean | undefined;
  /** our target username. Note that if currentUser is true, there is no need to send this input */
  @Input() username: string | undefined;
  /** when we need to close the form, this event would be emitted */
  @Output() closeForm = new EventEmitter<void>();
  /** when setting or deleting operation is done successfully, this event would be emitted */
  @Output() successFn = new EventEmitter<void>();
  /** form info to enable setting a token for user */
  _form: FormGroup | undefined;
  /** all server errors in this page would be placed here. */
  _allPossibleErrors = new Map<string, string>();
  /** description for InputRegex.password error messages */
  _acceptedPatternsDescription = {
    [String(InputRegex.password)]: this.tr.instant('acceptedPatternsDescription'),
  };
  /** if true, loading would be shown */
  _isLoading: boolean | undefined;

  constructor(
    private _userPasswordService: UserPasswordService,
    private tr: TranslateService,
    private _toastService: ToastService,
    private _loginConstraintConfigService: LoginConstraintConfigService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._generateForm();
    // there is no need for showing loading
    this._loginConstraintConfigService.getConstraint().subscribe(({ minPassLength }) => {
      this._form?.controls.newPassword.addValidators(Validators.minLength(minPassLength));
    });
  }

  /**
   * if the form is valid, its information would be sent to server to set token for the user
   */
  submitForm(): void {
    if (this._form?.valid) {
      this._doResetPassword();
    } else {
      this._form?.markAllAsTouched();
      this._cdr.markForCheck();
    }
  }

  /**
   * it would reset the password
   * if currentUser is true, it would change current user's password.
   * otherwise, it would change the specified user's password.
   */
  private _doResetPassword(): void {
    this._isLoading = true;
    const setter = this.currentUser
      ? this._userPasswordService.resetCurrentUserPassword(
          this._form?.value.oldPassword,
          this._form?.value.newPassword
        )
      : this._userPasswordService.save({
          ...this._form?.value,
          username: this.username,
        });
    setter.subscribe({
      next: () => {
        this._toastService.open(this.tr.instant('UserPasswordIsSuccessfullyChanged'), 'success');
        this.successFn.emit();
      },
      error: (err: any) => {
        this._allPossibleErrors.set(err.location, this.tr.instant('changingUserPasswordError'));
      },
      complete: () => {
        this._isLoading = false;
        this._cdr.markForCheck();
      },
    });
  }

  /** generate our desired form */
  private _generateForm(): void {
    if (this.currentUser) {
      this._form = this._fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.pattern(InputRegex.password)]],
      });
    } else {
      this._form = this._fb.group({
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(InputRegex.password),
            FormValidators._passwordsEquality('newPasswordRepeat'),
          ],
        ],
        newPasswordRepeat: [
          '',
          [
            Validators.required,
            Validators.pattern(InputRegex.password),
            FormValidators._passwordsEquality('newPassword'),
          ],
        ],
      });
    }
  }
}
