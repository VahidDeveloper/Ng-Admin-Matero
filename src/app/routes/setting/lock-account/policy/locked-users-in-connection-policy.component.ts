import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LockPolicy } from '../_models/lock-policy';

import { LockedUsersInConnectionService } from '../_services/locked-users-in-connection.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared';

/**
 * this component is created to set policy for locked user in a connection
 */
@Component({
  selector: 'app-locked-users-in-connection-policy',
  templateUrl: './locked-users-in-connection-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedUsersInConnectionPolicyComponent implements OnInit {
  /**
   * from group controls
   */
  _form: FormGroup;

  /**
   * for showing alert for each possible error on get blocked users
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * flag for indicating when component is post data
   */
  _isLoading = false;
  /**
   * a flag to show loading to get default block data
   */
  _fetchLoading = false;

  constructor(
    _fb: FormBuilder,
    private _BlockedUsersService: LockedUsersInConnectionService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {
    this._form = _fb.group({
      active: [false],
      lockTimeMinutes: [null, Validators.required],
      maxFailedAttempts: [null, Validators.required],
      resetTimeMinutes: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._getDefaultBlockPolicy();
  }

  /**
   * send policy config to server
   * base on active control
   * if it is active other field should be filled
   * so form is invalid until user fill its
   * if it is not active other field should not be filled
   * and form is valid
   */
  submit() {
    if (this._form.value.active && this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    this._isLoading = true;
    this._BlockedUsersService
      .setLockPolicy(this._form.value)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('UserAccountLockSettingsCompletedSuccessfully'),
            'success'
          );
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileCreatingTheAccountLockSettings')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * get default block policy to patch form
   */
  private _getDefaultBlockPolicy() {
    this._fetchLoading = true;
    this._BlockedUsersService
      .getDefaultLockPolicy()
      .subscribe(
        (res: LockPolicy) => {
          this._form.patchValue(res);
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('blockPolicyError')
          );
        }
      )
      .add(() => {
        this._fetchLoading = false;
        this._cdr.detectChanges();
      });
  }
}
