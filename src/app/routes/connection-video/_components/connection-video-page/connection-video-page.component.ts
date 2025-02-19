import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { RemoteAccessDetailsService } from '@shared/services';
import {
  ListServerResponse,
  RemoteAccessDetails,
  SessionSearchFoundTextsDetails,
} from '@shared/interfaces';
import { ConnectionVideoPlayerComponent } from '../connection-video-player/connection-video-player.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoSearchHorizontalTimelineComponent } from '@shared/components';

/**
 * it is a TEST component just to show connection's video.
 * in url, tunnel's id should be specified to get its details from server and extract videoId.
 * Like remote-connection-page, this component will be DELETED later.
 * you can test these ids:
 * 82d413cc-9af3-4fab-bfd7-8b44d6842720
 * 64b998f1-ced2-404e-8025-483cba65f4d1
 */
@Component({
  standalone: true,
  selector: 'app-connection-video-page',
  templateUrl: './connection-video-page.component.html',
  styleUrl: './connection-video-page.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    ConnectionVideoPlayerComponent,
    VideoSearchHorizontalTimelineComponent,
  ],
})
export class ConnectionVideoPageComponent implements OnInit, OnDestroy {
  /** result of session search by found texts details */
  _results: SessionSearchFoundTextsDetails[] = [];
  /** result of session search by found texts details */
  _selectedSessionVideoTime = 0;
  /**
   * video's id gotten from server.
   */
  _videoId: string | undefined;
  /**
   * Video's url gotten from server.
   */
  _videoUrl!: string;
  /**
   * search input for searching in video
   */
  _searchInput!: string;
  /**
   * tunnel's uuid
   */
  _tunnelUuid!: string;
  /**
   * video's start time
   */
  _connectTime!: number;
  /**
   * video's full time
   */
  _videoTime!: { start: number; end: number };
  /**
   * video's end time
   */
  _disconnectTime!: number;
  /**
   * whether connection's video has been saved or not.
   */
  _connectionVideoIsSaved: any;
  /** flag for indicating when component is busy with fetching data */
  _searchLoading!: boolean;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();

  /**
   * to unsubscribe subscriptions, _onDestroy is used.
   */
  private _onDestroy: Subject<any> = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _remoteAccessDetailsService: RemoteAccessDetailsService,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    const searchParam = this._route.snapshot.queryParams.searchParam;
    const params = this._route.snapshot.params;
    this._selectedSessionVideoTime = !isNaN(params.forcedVideoPoint)
      ? parseInt(params.orcedVideoPoint, 10)
      : 0;
    this._tunnelUuid = params.id;
    this._searchInput = searchParam;
    if (searchParam) {
      this.findBySearchParam();
    }
    this._getDetails();
  }

  ngOnDestroy(): void {
    this._onDestroy.next(null);
    this._onDestroy.complete();
  }

  /** it get session search video result by search param input */
  findBySearchParam(): void {
    if (this._searchInput.length > 2) {
      this._searchLoading = true;
      this._remoteAccessDetailsService
        .getVideoResult(this._searchInput, this._tunnelUuid)
        .subscribe(
          (data: ListServerResponse<SessionSearchFoundTextsDetails>) => {
            this._results = [...data.results];
            this._searchLoading = false;
          },
          (err: { location: string }) => {
            this._searchLoading = false;
            this._allPossibleErrors.set(
              err.location,
              this._translatorService.instant('AnErrorOccurredDuringFetchSessionSearchVideoResult')
            );
          }
        );
    } else {
      // show minlength warning toast
    }
  }

  /** it pass selected session video time to video player component */
  selectItem(data: SessionSearchFoundTextsDetails): void {
    this._selectedSessionVideoTime = data.videoTime;
  }

  /**
   * it will get video
   */
  private _getDetails(): void {
    this._remoteAccessDetailsService
      .getRemoteAccessDetails(this._tunnelUuid)
      .subscribe((data: RemoteAccessDetails) => {
        const connectionPrimarySetting = data?.details?.connectionParameters?.primarySetting;
        this._connectionVideoIsSaved = connectionPrimarySetting?.videoRecordEnabled;
        this._videoId = data?.recording?.rawVideoFile;
        this._videoUrl = data?.recording?.videoFile;
        this._connectTime = data?.details?.connectTime;
        this._disconnectTime = data?.details?.disconnectTime;
        this._videoTime = {
          start: this._connectTime,
          end: this._disconnectTime,
        };
        // we assume the connection is disconnected. (it is a test component)
      });
  }
}
