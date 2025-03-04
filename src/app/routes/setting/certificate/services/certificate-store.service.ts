import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable, of } from 'rxjs';

import { SslPolicy } from '../_models/ssl-policy';
import { CACertificate } from '../_models/CA-certificate';
import { ConfirmDialogService, ToastService } from '@shared';
import { CaCertificateService } from './ca-certificate.service';
import { SslCertificateService } from './ssl-certificate.service';
import { AddCAComponent } from '../components/ca/add/add.component';

export interface CACertificateState {
  list: CACertificate[];
  sslConfig: SslPolicy | undefined;
  token?: string;
  count?: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class CertificateStore extends ComponentStore<CACertificateState> {
  caService = inject(CaCertificateService);
  sslCertService = inject(SslCertificateService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);
  constructor() {
    super({
      list: [],
      sslConfig: undefined,
      count: 0,
      token: undefined,
      isLoading: false,
      postLoading: false,
      searchTerm: '',
    });
  }

  readonly setSearchTerm = this.updater<string>((state, searchTerm) => ({
    ...state,
    searchTerm,
  }));

  readonly filteredRow$ = this.select(this.state$, state => {
    if (!state.searchTerm) {
      return state.list;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.list.filter(item => item.name.toLowerCase().includes(lowerQuery));
  });

  readonly getCa = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.caService.getCaCertificate().pipe(
          tap({
            next: (res: CACertificate[]) => {
              this.patchState({ list: res, count: res.length, isLoading: false });
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

  readonly addCa = this.effect(trigger$ => {
    const openEditDialog = () => {
      const dialogRef = this.dialog.open(AddCAComponent, {
        minWidth: '600px',
        disableClose: true,
      });

      return dialogRef.afterClosed();
    };

    return trigger$.pipe(
      switchMap(() =>
        openEditDialog().pipe(
          switchMap((newCert: CACertificate) => {
            if (newCert) {
              // If the user submits the form, proceed with the update
              this.patchState({ isLoading: true });
              return this.caService.addCaCertificate(newCert).pipe(
                tap(() => {
                  this.toast.open(
                    this.tr.instant('toast.create', {
                      title: this.tr.instant('pages.settign.certificate.title'),
                      name: newCert.name,
                    }),
                    'success'
                  );
                  this.getCa();
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
        )
      )
    );
  });

  readonly deleteCa = this.effect((cert$: Observable<CACertificate>) => {
    return cert$.pipe(
      switchMap(cert =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('confirms.delete', { name: cert.name })
          )
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.caService.deleteCaCertificate(cert).pipe(
                  tap(() => this.getCa()), // Reload the list after delete
                  catchError(() => {
                    this.patchState({ isLoading: false });
                    return EMPTY;
                  })
                );
              } else {
                return EMPTY;
              }
            })
          )
      )
    );
  });

  readonly getTLSConfig = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.sslCertService.getDefaultPolicy().pipe(
          tap({
            next: (res: SslPolicy) => {
              this.patchState({ sslConfig: res });
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

  readonly setTLSConfig = this.effect<any>((trigger$: Observable<any>) =>
    trigger$.pipe(
      // Only set loading state to true when the confirmation dialog is triggered
      switchMap(({ formValue, confirm }) => {
        if (confirm) {
          // If confirm is true, show the confirmation dialog
          return this.confirm
            .confirm(
              this.tr.instant('pages.setting.certificate.self_signed'),
              this.tr.instant('pages.setting.certificate.self_sign_confirm')
            )
            .pipe(
              switchMap((confirmed: boolean) => {
                if (confirmed) {
                  // If confirmed, show loading state
                  this.patchState({ postLoading: true });

                  // Call the API
                  return this.sslCertService.addSSlConfig(formValue).pipe(
                    tap({
                      next: () => {
                        this.toast.open(
                          this.tr.instant('toast.submit', {
                            title: this.tr.instant('pages.setting.certificate.self_signed'),
                            name: formValue.name,
                          }),
                          'success'
                        );
                      },
                    }),
                    finalize(() => {
                      this.patchState({ postLoading: false }); // Stop loading after the API call completes
                    })
                  );
                }

                return EMPTY;
              })
            );
        } else {
          this.patchState({ postLoading: true });
          return this.sslCertService.addSSlConfig(formValue).pipe(
            tap({
              next: () => {
                this.toast.open(
                  this.tr.instant('toast.submit', {
                    title: this.tr.instant('pages.setting.certificate.self_signed'),
                    name: formValue.name,
                  }),
                  'success'
                );
              },
            }),
            finalize(() => {
              this.patchState({ postLoading: false }); // Stop loading after the API call completes
            })
          );
        }
      })
    )
  );
}
