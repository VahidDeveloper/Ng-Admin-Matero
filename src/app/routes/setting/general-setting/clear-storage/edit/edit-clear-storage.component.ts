import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClearStoragePolicyService } from '../_services/clear-storage-policy.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClearStorageResponse } from '../_models/clear-storage-response';
import { DiskBaseElimination } from '../_models/disk-base-elimination';
import { TimeBaseElimination } from '../_models/time-base-elimination';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay } from '@shared';
import { ClearStoragePolicyByPercentComponent } from './by-percent/clear-storage-policy-by-percent.component';
import { ClearStoragePolicyByTimeComponent } from './by-time/clear-storage-policy-by-time.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-clear-storage',
  templateUrl: './edit-clear-storage.component.html',
  styleUrls: ['./edit-clear-storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    ClearStoragePolicyByTimeComponent,
    ClearStoragePolicyByPercentComponent,
  ],
})
export class EditClearStorageComponent implements OnInit {
  /**
   * create form for test sms
   */
  _form: FormGroup;
  /**
   * is loading
   */
  _isLoading = false;
  /**
   * load default data
   */
  _dataLoading = false;
  /**
   * disk base elimination
   */
  diskBaseElimination: DiskBaseElimination | undefined;
  /**
   * time base elimination
   */
  timeBaseElimination: TimeBaseElimination | undefined;
  /**
   * for showing alert for each possible error on fetch data
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();

  constructor(
    private _clearStoragePolicyService: ClearStoragePolicyService,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {
    this._form = this._fb.group({});
  }

  ngOnInit(): void {
    this._getElimination();
  }

  submit() {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    this._isLoading = true;
    this._clearStoragePolicyService
      .putStoragePolicyConfig(this._form.getRawValue())
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('ClearDiskStorageSettingsSuccess'),
            'success'
          );
          this.backToList();
        },
        (err: ErrorDisplay) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('storageEstimationError')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * back to list page
   */
  backToList() {
    this._router.navigate(['..'], { relativeTo: this._activatedRoute }).then();
  }

  /**
   * this method get data of elimination base time and storage
   */
  private _getElimination(): void {
    this._dataLoading = true;
    this._clearStoragePolicyService
      .getStoragePolicyConfig()
      .subscribe(
        (data: ClearStorageResponse) => {
          this.diskBaseElimination = data.diskBaseElimination;
          this.timeBaseElimination = data.timeBaseElimination;
        },
        (err: ErrorDisplay) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('gettingEliminationStorageError')
          );
        }
      )
      .add(() => {
        this._dataLoading = false;
        this._cdr.markForCheck();
      });
  }
}
