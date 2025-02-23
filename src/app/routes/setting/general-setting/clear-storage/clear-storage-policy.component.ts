import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ClearStoragePolicyService } from './_services/clear-storage-policy.service';
import { DiskBaseElimination } from './_models/disk-base-elimination';
import { TimeBaseElimination } from './_models/time-base-elimination';
import { ClearStorageResponse } from './_models/clear-storage-response';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDisplay, KeyWithCustomTemplate } from '@shared';

/**
 * component to show list of storage elimination policy
 */
@Component({
  selector: 'app-clear-storage-policy',
  templateUrl: './clear-storage-policy.component.html',
  styleUrls: ['./clear-storage-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearStoragePolicyComponent implements OnInit {
  /**
   * list of key for use key value list
   */
  listOfKeys!: KeyWithCustomTemplate[];
  /**
   * another list of keys
   */
  listOfKeysNext!: KeyWithCustomTemplate[];
  /**
   * is loading
   */
  _isLoading = false;
  /**
   * disk base elimination
   */
  diskBaseElimination!: DiskBaseElimination;
  /**
   * time base elimination
   */
  timeBaseElimination!: TimeBaseElimination;
  /**
   * for showing alert for each possible error on fetch data
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * delete file item in the list
   */
  @ViewChild('deleteFile', { static: true })
  private _deleteFile!: TemplateRef<any>;

  constructor(
    private _clearStorage: ClearStoragePolicyService,
    private _ref: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._setKeys();
    this._getElimination();
  }

  /**
   * go to edit page to edit policy
   */
  goToEditPage() {
    this._router.navigate(['edit'], { relativeTo: this._activatedRoute }).then();
  }

  /**
   * this method get data of elimination base time and storage
   */
  private _getElimination(): void {
    this._isLoading = true;
    this._clearStorage
      .getStoragePolicyConfig()
      .subscribe(
        (data: ClearStorageResponse) => {
          this.diskBaseElimination = data.diskBaseElimination;
          this.timeBaseElimination = data.timeBaseElimination;
        },
        (err: ErrorDisplay) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileGetEliminationStorage')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._ref.markForCheck();
      });
  }

  /**
   * set keys to show in list
   */
  private _setKeys() {
    this.listOfKeys = [
      {
        key: 'mountPoint',
        keyToDisplay: this._translatorService.instant('MountPoint'),
      },
      {
        key: 'enabled',
        keyToDisplay: this._translatorService.instant('enabledInfo'),
        customTemplate: this._deleteFile,
        withoutDefaultClass: true,
      },
      {
        key: 'lowerBound',
        keyToDisplay: this._translatorService.instant('MinimumAcceptableStorageUsagePercent'),
      },
      {
        key: 'upperBound',
        keyToDisplay: this._translatorService.instant('MaximumAcceptableStorageUsagePercent'),
      },
    ];
    this.listOfKeysNext = [
      {
        key: 'enabled',
        keyToDisplay: this._translatorService.instant('DeleteByFileCreationTime'),
        customTemplate: this._deleteFile,
        withoutDefaultClass: true,
      },
      {
        key: 'elapsedInSeconds',
        keyToDisplay: this._translatorService.instant('NumberOfDaysFilesWillBeKept'),
      },
    ];
  }
}
