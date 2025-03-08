import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable, of } from 'rxjs';

import { ConfirmDialogService, SessionTimeoutPolicy, ToastService } from '@shared';
import { LoginConstraintConfigService } from './login-constraint-config.service';
import { SessionTimoutPolicyService } from './session-timout-policy.service';
import { LoginConstraint } from '../types/login-constraint';

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
          tap({
            next: (res: LoginConstraint) => {
              this.patchState({ loginConfig: res, isLoading: false });
            },
          }),
          catchError(() => EMPTY)
        )
      ),
      catchError(() => EMPTY),
      finalize(() => {
        this.patchState({ isLoading: false });
      })
    )
  );

  readonly setLoginConfig = this.effect((trigger$: Observable<LoginConstraint>) => {
    return trigger$.pipe(
      switchMap((config: LoginConstraint) => {
        if (config) {
          // If the user submits the form, proceed with the update
          this.patchState({ isLoading: true });
          return this.loginConfigApi.saveConstraint(config).pipe(
            tap(() => {
              this.toast.open(
                this.tr.instant('toast.create', {
                  title: this.tr.instant('pages.settign.certificate.title'),
                }),
                'success'
              );
            }),
            catchError(e => {
              this.patchState({ isLoading: false });
              return EMPTY;
            })
          );
        } else {
          return EMPTY; // If the user cancels the dialog, do nothing
        }
      })
    );
  });

  readonly getSessionConfig = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.sessionApi.getSetting().pipe(
          tap({
            next: (res: SessionTimeoutPolicy) => {
              this.patchState({ sessionConfig: res });
            },
          }),
          catchError(() => EMPTY)
        )
      ),
      catchError(() => EMPTY),
      finalize(() => {
        this.patchState({ isLoading: false });
      })
    )
  );

  readonly setSessionConfig = this.effect<SessionTimeoutPolicy>(
    (trigger$: Observable<SessionTimeoutPolicy>) =>
      trigger$.pipe(
        switchMap(formValue => {
          this.patchState({ postLoading: true });

          return this.sessionApi.updateSetting(formValue).pipe(
            tap({
              next: () => {
                this.toast.open(
                  this.tr.instant('toast.submit', {
                    title: this.tr.instant('pages.settign.certificate.self_signed'),
                  }),
                  'success'
                );
              },
            }),
            finalize(() => {
              this.patchState({ postLoading: false }); // Stop loading after the API call completes
            })
          );
        })
      )
  );
}
