import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, finalize, Observable } from 'rxjs';

import { LoginConstraint } from '../types/login-constraint';
import { SessionTimoutPolicyService } from './session-timout-policy.service';
import { LoginConstraintConfigService } from './login-constraint-config.service';
import { ConfirmDialogService, SessionTimeoutPolicy, ToastService } from '@shared';

export interface SessionState {
  loginConfig: LoginConstraint | undefined;
  sessionConfig: SessionTimeoutPolicy | undefined;
  isLoading: boolean;
  postLoading: boolean;
}

@Injectable()
export class SessionStore extends ComponentStore<SessionState> {
  loginConfigApi = inject(LoginConstraintConfigService);
  sessionApi = inject(SessionTimoutPolicyService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      loginConfig: undefined,
      sessionConfig: undefined,
      isLoading: false,
      postLoading: false,
    });
  }

  readonly getLoginConfig = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.loginConfigApi.getConstraint().pipe(
          tap((res: LoginConstraint) => {
            this.patchState({ loginConfig: res, isLoading: false });
          }),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    )
  );

  readonly setLoginConfig = this.effect((trigger$: Observable<LoginConstraint>) => {
    return trigger$.pipe(
      switchMap((config: LoginConstraint) => {
        this.patchState({ postLoading: true });
        return this.loginConfigApi.saveConstraint(config).pipe(
          tap(() => {
            this.toast.open(this.tr.instant('pages.setting.session.login_submit'), 'success');
          }),
          finalize(() => {
            this.patchState({ postLoading: false });
          })
        );
      })
    );
  });

  readonly getSessionConfig = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.sessionApi.getSetting().pipe(
          tap((res: SessionTimeoutPolicy) => {
            this.patchState({ sessionConfig: res });
          }),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    )
  );

  readonly setSessionConfig = this.effect<SessionTimeoutPolicy>(
    (trigger$: Observable<SessionTimeoutPolicy>) =>
      trigger$.pipe(
        switchMap(formValue => {
          this.patchState({ postLoading: true });

          return this.sessionApi.updateSetting(formValue).pipe(
            tap(() => {
              this.toast.open(this.tr.instant('pages.setting.session.session_submit'), 'success');
            }),
            finalize(() => {
              this.patchState({ postLoading: false });
            })
          );
        })
      )
  );
}
