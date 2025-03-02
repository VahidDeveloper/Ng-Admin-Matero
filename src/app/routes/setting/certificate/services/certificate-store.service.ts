import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable, of } from 'rxjs';

import { SslPolicy } from '../_models/ssl-policy';
import { CACertificate } from '../_models/CA-certificate';
import { ConfirmDialogComponent } from '@shared/components';
import { ConfirmDialogService, ToastService } from '@shared';
import { CaCertificateService } from './ca-certificate.service';
import { SslCertificateService } from './ssl-certificate.service';

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
  constructor(private dialog: MatDialog) {
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

  // Effect to load token and then list
  readonly loadList = this.effect<void>(trigger$ =>
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

  readonly deleteCert = this.effect((cert$: Observable<CACertificate>) => {
    const openConfirmDialog = () => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Delete Project',
          message: 'Are you sure you want to delete this project? This action cannot be undone.',
        },
      });

      return dialogRef.afterClosed();
    };

    return cert$.pipe(
      switchMap(cert =>
        openConfirmDialog().pipe(
          switchMap(confirmed => {
            if (confirmed) {
              this.patchState({ postLoading: true });
              return this.caService.deleteCaCertificate(cert).pipe(
                tap(() => this.loadList()), // Reload the list after delete
                catchError(() => {
                  this.patchState({ postLoading: false });
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

  readonly submitForm = this.effect<any>((trigger$: Observable<any>) =>
    trigger$.pipe(
      // Only set loading state to true when the confirmation dialog is triggered
      switchMap(({ formValue, confirm }) => {
        if (confirm) {
          // If confirm is true, show the confirmation dialog
          return this.confirm
            .confirm(
              this.tr.instant('pages.setting.certificate.self-signed'),
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
                          this.tr.instant('NewSSLConfigCreatedSuccessfully'),
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
                this.toast.open(this.tr.instant('NewSSLConfigCreatedSuccessfully'), 'success');
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
