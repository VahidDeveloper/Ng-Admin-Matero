import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MonitoringService } from '../_services/monitoring.service';
import { DOCUMENT } from '@angular/common';
import { MonitoringTokenService } from '../_services/monitoring-token.service';
import { MonitoringToken } from '../_models/monitoring-token';
import { MonitoringRefreshTokenService } from '../_services/monitoring-refresh-token.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created to show all monitoring,s apis
 */
@Component({
  selector: 'app-monitoring-list',
  templateUrl: './monitoring-list.component.html',
  styleUrls: ['./monitoring-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringListComponent implements OnInit {
  /**
   * list of apis
   */
  _row: any[] = [];
  /**
   * current user token
   */
  _currentToken: string | undefined;
  /**
   * list operation
   */
  _operations: readonly any[] = [
    {
      description: this._translatorService.instant('Copy'),
      icon: 'icon-Copy-00',
      color: 'info',
      actionFn: (item: any) => {
        this.copyToClipboard(item.label);
      },
    },
  ];
  /**
   * a flag to show loading on get
   */
  _isLoading = false;
  /**
   * a flag to show loading on post request
   */
  _postLoading = false;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * to get access to clipboard API.
   */
  private _navigator: Navigator | undefined;
  /**
   * base api url
   */
  private readonly baseUrl = 'https://192.168.112.121';

  constructor(
    private _monitoringService: MonitoringService,
    private _monitoringTokenService: MonitoringTokenService,
    private _monitoringRefreshTokenService: MonitoringRefreshTokenService,
    private _cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    private _translatorService: TranslateService
  ) {
    this._navigator = this._document.defaultView?.navigator;
  }

  ngOnInit(): void {
    this._getToken();
  }

  /**
   * to refresh token
   */
  refreshToken() {
    this._postLoading = true;
    this._monitoringRefreshTokenService
      .save({} as MonitoringToken)
      .subscribe(
        (res: MonitoringToken) => {
          this._currentToken = res.token;
          this._getList();
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('refreshMonitoringTokenError')
          );
        }
      )
      .add(() => {
        this._postLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * it would change the local clipboard to the specified clipboard via clipboard service
   */
  copyToClipboard(data: string): void {
    this._navigator?.clipboard.writeText(data).then();
  }

  /**
   * to get all monitoring apis
   */
  private _getList() {
    this._isLoading = true;
    this._monitoringService
      .getAll()
      .subscribe(
        (res: string[]) => {
          this._row = res.map(item => {
            return {
              label: this.baseUrl + item,
            };
          });
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredDuringMonitoringApiList')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * to get current user token
   */
  private _getToken() {
    this._isLoading = true;
    this._monitoringTokenService
      .getData()
      .subscribe(
        (res: MonitoringToken) => {
          this._currentToken = res.token;
          this._getList();
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredDuringCurrentUserToken')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }
}
