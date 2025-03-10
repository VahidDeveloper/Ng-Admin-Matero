import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, finalize, Observable } from 'rxjs';

import { ConfirmDialogService, ToastService } from '@shared';
import { ClearStoragePolicyService } from './clear-storage-policy.service';
import { ClearStorageResponse } from '../types/clear-storage-response';

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
            this.toast.open(this.tr.instant('pages.setting.session.login_submit'), 'success');
          }),
          finalize(() => {
            this.patchState({ postLoading: false });
          })
        );
      })
    );
  });
}
