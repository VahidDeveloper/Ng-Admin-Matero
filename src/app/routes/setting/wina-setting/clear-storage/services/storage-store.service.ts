import { FormGroup } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, finalize, Observable } from 'rxjs';

import { ConfirmDialogService, ToastService } from '@shared/services';
import { ClearStorageResponse } from '../types/clear-storage-response';
import { ClearStoragePolicyService } from './clear-storage-policy.service';

export interface StorageState {
  config: ClearStorageResponse | undefined;
  isLoading: boolean;
  postLoading: boolean;
}

@Injectable()
export class StorageStore extends ComponentStore<StorageState> {
  apiService = inject(ClearStoragePolicyService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);

  constructor() {
    super({
      config: undefined,
      isLoading: false,
      postLoading: false,
    });
  }

  readonly getConfig = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.apiService.getStoragePolicyConfig().pipe(
          tap((res: ClearStorageResponse) => {
            this.patchState({ config: res, isLoading: false });
          }),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    )
  );

  readonly setConfig = this.effect((trigger$: Observable<ClearStorageResponse>) => {
    return trigger$.pipe(
      switchMap((config: ClearStorageResponse) => {
        this.patchState({ postLoading: true });
        return this.apiService.putStoragePolicyConfig(config).pipe(
          tap(() => {
            this.toast.open(
              this.tr.instant('toast.save', {
                title: this.tr.instant('menu.wina_setting.storage'),
              }),
              'success'
            );
          }),
          finalize(() => {
            this.patchState({ postLoading: false });
          })
        );
      })
    );
  });

  readonly toggleEliminationControls = this.effect<{
    formGroup: FormGroup;
    warningGroup: FormGroup;
    isEnabled: boolean;
  }>(trigger$ =>
    trigger$.pipe(
      tap(({ formGroup, warningGroup, isEnabled }) => {
        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.get(key);
          if (key !== 'enabled' && key !== 'mountPoint') {
            isEnabled ? control?.enable() : control?.disable();
          }
        });

        this.toggleWarningControls({ warningGroup, isEnabled: false });

        if (isEnabled) {
          warningGroup.get('enabled')?.enable();
        }
      })
    )
  );

  readonly toggleWarningControls = this.effect<{ warningGroup: FormGroup; isEnabled: boolean }>(
    trigger$ =>
      trigger$.pipe(
        tap(({ warningGroup, isEnabled }) => {
          Object.keys(warningGroup.controls).forEach(key => {
            if (key !== 'enabled') {
              isEnabled ? warningGroup.get(key)?.enable() : warningGroup.get(key)?.disable();
            }
          });
        })
      )
  );
}
