import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { catchError, filter, first, takeUntil, tap, timeout } from 'rxjs/operators';

import { FileHelper } from '@shared/utils';
import { WinaRestUrls, ConnectionVideoManager } from '@shared/models';
import { SavedAbsoluteFrameInfo, SectionDownloadCompleteEvent } from '@shared/interfaces';
import { ConnectionVideoService } from '@shared/services';
import { ReadableVideoTimePipe } from '../../_pipes/readable-video-time.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * a component which shows connection's video.
 */
@Component({
  selector: 'app-connection-video-player',
  standalone: true,
  templateUrl: './connection-video-player.component.html',
  styleUrl: './connection-video-player.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReadableVideoTimePipe,
    TranslatePipe,
  ],
  providers: [ConnectionVideoService],
})
export class ConnectionVideoPlayerComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * unique video id used to get video's contents from server.
   */
  @Input() videoId!: string;
  /**
   * unique video id used to get video's contents from server.
   */
  @Input() videoUrl!: string;
  /**
   * tunnel's uuid
   */
  @Input() tunnelUuid!: string;
  /**
   * epoch which the connection is established
   */
  @Input() connectTime!: number;
  /**
   * epoch which the connection is disconnected.
   * NOTE that currently, we do not handle -1 value and we assume that the connection was previously disconnected.
   */
  @Input() disconnectTime!: number;
  /**
   * jump to a point in the video
   */
  @Input() forcedVideoPoint!: number;
  /**
   * making forcedVideoPoint a two-way binding input.
   * after seeking to this forcedVideoPoint, the user may change videoPoint. In this case, forcedVideoPoint should become null
   * if we do not do this, this scenario won't work properly:
   * 1. the user choose the time 4-minute in search-box => forcedVideoPoint becomes 4 minute.
   * 2. the user, then, play the video => videoPoint is no longer 4 minute
   * 3. the user, gain, chooses the time 4-minute in search-box  => forcedVideoPoint becomes 4 minute.
   * if we do not change forcedVideoPoint to null in case 2, the case 3 won't work properly
   * because the component won't detect changes in forcedVideoPoint,
   */
  @Output() forcedVideoPointChange = new EventEmitter<number>();
  /**
   * if it is true, the video is playing. Otherwise, it is not playing.
   */
  isVideoPlaying = false;
  /**
   * video's total duration in milli seconds.
   */
  totalVideoDurationTillNow = 0;
  /**
   * video's current time
   */
  currentPlaybackTime = 0;
  /**
   * whether to show the playback-speed options menu or not.
   */
  showPlaybackSpeedMenu = false;
  /**
   * all possible playback speed.
   */
  playbackSpeedOptions: readonly number[] = [16, 12, 8, 4, 3, 2, 1];
  /**
   * current video speed
   */
  currentPlaybackSpeed = 1;
  /**
   * connection-video interface that can be used to manage video-playing
   */
  connectionVideoManager: ConnectionVideoManager | undefined;
  /**
   * whether jumping is in progress or not.
   * when the user manually seek to a target time, jumping starts.
   */
  isJumping = false;
  /** flag for indicating when component is busy with fetching data */
  _downloadLoading!: boolean;
  /**
   * global window object injected via Angular.
   */
  private _window: Window;
  /**
   * video's width without considering scale (when scale is 1)
   */
  private _videoWidthWithoutScale!: number;
  /**
   * video's height without considering scale (when scale is 1)
   */
  private _videoHeightWithoutScale!: number;
  /**
   * if it is true, it means that the remote-connection has not terminated and the user is still interacting with it.
   * in this case, totalDuration should be updated during execution.
   */
  private _stillConnectedToRemote!: boolean;
  /**
   * for unsubscribe for memory leak
   */
  private _onDestroy = new Subject<void>();
  /**
   * if true, at least one section of the video is downloaded completely.
   */
  private _atLeastOneSectionDownloaded = false;
  /**
   * subscription to download stream to find out the first download time.
   */
  private _downloadSubscription: Subscription | undefined;
  /**
   * the build display would be appended to this template.
   */
  @ViewChild('displayContainer', { static: true })
  private _displayContainer!: ElementRef;
  /**
   * the cloned canvas would be appended to this template.
   * only when jumping is in progress, cloned canvas would be shown.
   */
  @ViewChild('clonedCanvasContainer', { static: true })
  private _clonedCanvasContainer!: ElementRef;
  /**
   * the slider display. for each seek, its width would increase to show the progress in playback
   */
  @ViewChild('sliderDisplay', { static: true })
  private _sliderDisplay!: ElementRef;
  /**
   * video content would be gotten chunk by chunk. this slider shows how much time remains to get the whole content.
   */
  @ViewChild('sliderProgress', { static: true })
  private _sliderProgress!: ElementRef;
  /**
   * the slider's background
   */
  @ViewChild('sliderBackground', { static: true })
  private _sliderBackground!: ElementRef;
  fullVideoUrl = '';

  /**
   * CONSTRUCTOR
   */
  constructor(
    private _connectionVideoService: ConnectionVideoService,
    private _renderer: Renderer2,
    @Inject(DOCUMENT) document: Document
  ) {
    this._window = document.defaultView!;
  }

  /**
   * if forcedVideoPoint is changed, we have to seek to that point in video.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.forcedVideoPoint && changes.forcedVideoPoint.currentValue != null) {
      const videoPointChanges =
        changes.forcedVideoPoint.currentValue !== changes.forcedVideoPoint.previousValue;
      const videoPointFirstChange = changes.forcedVideoPoint.isFirstChange();
      if (videoPointChanges && !videoPointFirstChange) {
        // videoPointFirstChange is handled in ngOnInit
        this._seekToForcedVideoPointWhenPossible();
      }
    }
  }

  /**
   * all the initiations are done here.
   */
  ngOnInit(): void {
    if (!this.videoUrl) {
      this.loadOldPlayer();
    } else {
      this.fullVideoUrl = `${WinaRestUrls.getFileUrl}/${this.videoUrl}`;
    }
  }

  private loadOldPlayer() {
    this._stillConnectedToRemote = this.disconnectTime === -1;
    this.totalVideoDurationTillNow = this.findTotalVideoDurationTillNow();
    this.connectionVideoManager = new ConnectionVideoManager(this.videoId, this.tunnelUuid);
    this._renderer.appendChild(
      this._displayContainer.nativeElement,
      this.connectionVideoManager?.recordingDisplay.getElement()
    );
    this.connectionVideoManager?.startFromTheBeginning();
    this._getAllSavedFramesFromServer();
    this._handleVideoResize();
    this._handleBrowserResize();
    this._handleSeek();
    this._handleDownloadProgress();
    this._handleDownloadComplete();
    this._handleEndOfSection();
    if (this.forcedVideoPoint != null) {
      this._seekToForcedVideoPointWhenPossible();
    }
  }

  /**
   * it would return video's duration till now.
   */
  findTotalVideoDurationTillNow(): number {
    if (this.disconnectTime !== -1) {
      return this.disconnectTime - this.connectTime;
    } else {
      return this._connectionVideoService.getServerTime() - this.connectTime;
    }
  }

  /**
   * it would complete onDestory subject to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * either pause or play the video based on the value of isVideoPlaying
   */
  pauseOrPlayTheVideo(): void {
    if (!this.isVideoPlaying) {
      this.playTheVideo();
    } else {
      this.pauseTheVideo();
    }
  }

  /**
   * it would play the video.
   * If we are at the end of the video, it would first seek to the beginning of the video and then play the video.
   */
  playTheVideo(): void {
    if (this._isAtTheEndOfTheVideo()) {
      // => we are at the end of the video
      this.seekToTargetTime(0).subscribe(() => {
        this.connectionVideoManager?.recording.play();
      });
    } else {
      this.connectionVideoManager?.recording.play();
    }
    this.isVideoPlaying = true;
  }

  /**
   * it would pause the video
   */
  pauseTheVideo(): void {
    this.connectionVideoManager?.recording.pause();
    this.isVideoPlaying = false;
  }

  /**
   * it would stop the playback by seeking to the beginning of the video.
   */
  stopThePlayback(): void {
    this.seekToTargetTime(0).subscribe(() => {
      this.pauseTheVideo();
    });
  }

  /**
   * it is called when the user clicks on the video's slider.
   * In this case, we should seek to the point specified by the mouse.
   */
  sliderOnClick(event: MouseEvent): void {
    if (this.isJumping) {
      // current jumping process should be finished
      return;
    }
    const targetTime =
      (event.offsetX / this._sliderBackground.nativeElement.offsetWidth) *
      this.totalVideoDurationTillNow;
    this.seekToTargetTime(targetTime).subscribe();
  }

  /**
   * it would set playback's speed based on the specified number.
   */
  setPlaybackSpeed(speed: number): void {
    this.currentPlaybackSpeed = speed;
    const isVideoPlaying = this.isVideoPlaying;
    this.pauseTheVideo();
    this.connectionVideoManager?.recording.setPlaybackSpeed(speed);
    if (isVideoPlaying) {
      this.playTheVideo();
    }
  }

  /**
   * it would toggle playback-speed-selection's menu
   */
  togglePlaybackSpeedMenu(): void {
    this.showPlaybackSpeedMenu = !this.showPlaybackSpeedMenu;
  }

  /**
   * it would hide playback-speed-selection's menu
   */
  hidePlaybackSpeedMenu(): void {
    this.showPlaybackSpeedMenu = false;
  }

  /**
   * it would seek to target time
   */
  seekToTargetTime(targetTime: number): Observable<null> {
    const width: number =
      (targetTime * this._sliderBackground.nativeElement.offsetWidth) /
      this.totalVideoDurationTillNow;
    this._renderer.setStyle(this._sliderDisplay.nativeElement, 'width', width + 'px');
    this.isJumping = true;
    this._showStaticClonedCanvas();
    return this._connectionVideoService
      .seekToTargetTime(targetTime, this.connectionVideoManager!)
      .pipe(
        tap(() => {
          this.isJumping = false;
          this._hideStaticClonedCanvas();
          this.connectionVideoManager?.onSeek.next(targetTime);
          this.setPlaybackSpeed(this.currentPlaybackSpeed);
          this._scaleTheVideo(this._videoWidthWithoutScale, this._videoHeightWithoutScale);
        }),
        catchError(error => {
          this.isJumping = false;
          this._hideStaticClonedCanvas();
          this.connectionVideoManager?.onSeek.next(
            this.connectionVideoManager?.currentVideoSection.startTime
          );
          this.setPlaybackSpeed(this.currentPlaybackSpeed);
          this._scaleTheVideo(this._videoWidthWithoutScale, this._videoHeightWithoutScale);
          throw error;
        })
      );
  }

  onDownloadVideoClick() {
    this._downloadLoading = true;
    FileHelper.downloadFileByUrl(
      `${this.videoId}.mp4`,
      `${WinaRestUrls.getFileUrl}/${this.videoUrl}`,
      () => {
        this._downloadLoading = false;
      }
    );
  }

  /**
   * it would seek to forcedVideoPoint at the right time.
   * the seeking should be done when the first section is downloaded completely.
   */
  private _seekToForcedVideoPointWhenPossible(): void {
    if (this._downloadSubscription) {
      this._downloadSubscription.unsubscribe();
    }
    if (this._atLeastOneSectionDownloaded) {
      // => we can call seekToTargetTime right away
      this.seekToTargetTime(this.forcedVideoPoint).subscribe();
    } else {
      // => even the first section's info has not gotten yet => we have to wait until it is gotten.
      this._downloadSubscription = this.connectionVideoManager?.onDownloadComplete
        .pipe(first(), timeout(5000))
        .subscribe(() => {
          this.seekToTargetTime(this.forcedVideoPoint).subscribe();
        });
    }
  }

  /**
   * it would hide the cloned canvas container by setting its display to none.
   */
  private _hideClonedElement(): void {
    this._renderer.setStyle(this._clonedCanvasContainer.nativeElement, 'display', 'none');
  }

  /**
   * it would show the cloned canvas container by setting its display to block.
   */
  private _showClonedElement(): void {
    this._renderer.setStyle(this._clonedCanvasContainer.nativeElement, 'display', 'block');
  }

  /**
   * it would move main display to a far place which is not visible.
   * NOTE that if you set display to none, there would be an enormous delay in seeking.
   * maybe it is because it is harder for guac to update display when display is none.
   */
  private _moveMainDisplayToFarFarAway(): void {
    this._renderer.setStyle(this._displayContainer.nativeElement, 'position', 'absolute');
    this._renderer.setStyle(this._displayContainer.nativeElement, 'left', '-10000px');
    this._renderer.setStyle(this._displayContainer.nativeElement, 'top', '-10000px');
  }

  /**
   * it would place the main display to its previous position.
   */
  private _revertMainDisplayPosition(): void {
    this._renderer.setStyle(this._displayContainer.nativeElement, 'position', 'relative');
    this._renderer.setStyle(this._displayContainer.nativeElement, 'left', 'unset');
    this._renderer.setStyle(this._displayContainer.nativeElement, 'top', 'unset');
  }

  /**
   * it would show static cloned canvas as a replace for the main display.
   * it is done when seeking is in process and in this case we want that the main display changes would not be visible
   * when the seeking is done completely, the main display should be shown by calling _hideStaticClonedCanvas function.
   */
  private _showStaticClonedCanvas(): void {
    this._showClonedElement();
    this._moveMainDisplayToFarFarAway();
    const canvas = this.connectionVideoManager?.recordingDisplay.flatten();
    const scale = this.connectionVideoManager?.recordingDisplay.getScale();
    this._renderer.setStyle(canvas, 'transform-origin', '0px 0px');
    this._renderer.setStyle(canvas, 'transform', 'scale(' + scale + ',' + scale + ')');
    this._renderer.appendChild(this._clonedCanvasContainer.nativeElement, canvas);
    this._putChildElementToCenter(
      this._clonedCanvasContainer.nativeElement,
      this._clonedCanvasContainer.nativeElement.children[0]
    );
  }

  /**
   * it would hide static cloned canvas and show the main display.
   */
  private _hideStaticClonedCanvas(): void {
    this._renderer.removeChild(
      this._clonedCanvasContainer.nativeElement,
      this._clonedCanvasContainer.nativeElement.children[0]
    );
    this._hideClonedElement();
    this._revertMainDisplayPosition();
  }

  /**
   * it would get all saved frames information from server. it would not get the absolute frame itself.
   * we do not show loading for this.
   * with this information, seeking can be done much better.
   * for example, when seeking to time t, the nearest absoluteFrame would be gotten and placed in a new section.
   * by using savedFramesBriefInfo array, we can set section's endIndex in a way that cover the target time t.
   */
  private _getAllSavedFramesFromServer(): void {
    if (this.connectionVideoManager) {
      this._connectionVideoService
        .getAllSavedVideoFrames(this.connectionVideoManager.tunnelUuid)
        .subscribe((framesList: Partial<SavedAbsoluteFrameInfo>[]) => {
          if (this.connectionVideoManager) {
            this.connectionVideoManager.savedFramesBriefInfo = framesList;
          }
        });
    }
  }

  /**
   * it would handle video-resize event. Note that, this resize is associated with the video.
   * For example, in ssh connection, when you resize the connection, a new resolution is set for this connection =>
   * in its video, the size of video is changed during those times but it's not pleasant to change the container's size =>
   * So in this case, we scale the video so as to be inside the container.
   */
  private _handleVideoResize(): void {
    this.connectionVideoManager?.onVideoResize
      .pipe(takeUntil(this._onDestroy))
      .subscribe(({ width, height }: { width: number; height: number }) => {
        this._scaleTheVideo(width, height);
      });
  }

  /**
   * it would handle browser resize. In this case, the video's size should be changed.
   */
  private _handleBrowserResize(): void {
    fromEvent(this._window, 'resize')
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._scaleTheVideo(this._videoWidthWithoutScale, this._videoHeightWithoutScale);
      });
  }

  /**
   * it would scale the video to fit in the container. it also places the video in the center of the container.
   */
  private _scaleTheVideo(videoWidthWithoutScale: number, videoHeightWithoutScale: number): void {
    if (!videoWidthWithoutScale) {
      return;
    }
    this._videoWidthWithoutScale = videoWidthWithoutScale;
    this._videoHeightWithoutScale = videoHeightWithoutScale;
    const containerBoundingRect: DOMRect =
      this._displayContainer.nativeElement.getBoundingClientRect();
    let scaleValue = Math.min(
      containerBoundingRect.width / videoWidthWithoutScale,
      containerBoundingRect.height / videoHeightWithoutScale
    );
    if (scaleValue <= 2 && scaleValue > 0.98) {
      // in this case, it is better to show the video in its highest quality (scale = 1).
      scaleValue = 1; // showing the video in its actual dimensions which has the highest quality.
    }
    /*
       Scale display to fit width of container.
       We wanted the display do not overflow from its container so we use Math.min function to choose the minimum scale.
    */
    this.connectionVideoManager?.recordingDisplay.scale(scaleValue);
    this._putChildElementToCenter(
      this._displayContainer.nativeElement,
      this._displayContainer.nativeElement.children[0]
    );
  }

  /**
   * it would put the child element to the center (both vertically and horizontally) of parent element
   * via setting an appropriate margin-left and margin-top.
   */
  private _putChildElementToCenter(parentElement: HTMLElement, childElement: HTMLElement): void {
    const containerBoundingRect: DOMRect = parentElement.getBoundingClientRect();
    const childBoundingRect: DOMRect = childElement.getBoundingClientRect();
    const marginLeft = (containerBoundingRect.width - childBoundingRect.width) / 2;
    const marginTop = (containerBoundingRect.height - childBoundingRect.height) / 2;
    this._renderer.setStyle(childElement, 'margin-left', marginLeft + 'px');
    this._renderer.setStyle(childElement, 'margin-top', marginTop + 'px');
  }

  /**
   * This function handles seek event. This event occurs frequently specially when the video is playing.
   * it would update the slider and playback time to be in accordance with current seek.
   */
  private _handleSeek(): void {
    this.connectionVideoManager?.onSeek
      .pipe(
        filter(() => !this.isJumping), // when jumping, this event is managed somewhere else and it shouldn't be managed here.
        takeUntil(this._onDestroy)
      )
      .subscribe((millis: number) => {
        this.currentPlaybackTime = millis;
        if (this.forcedVideoPoint != null && this.forcedVideoPoint !== millis) {
          // => current time is different from forcedVideoPoint => it should become null
          // if you want to change or remove this, do it with caution
          this.forcedVideoPointChange.emit(undefined);
        }
        const proportion = this.currentPlaybackTime / this.totalVideoDurationTillNow;
        this._renderer.setStyle(this._sliderDisplay.nativeElement, 'width', proportion * 100 + '%');
        if (proportion === 1) {
          // => reaches the end of the video
          this.connectionVideoManager?.recording.pause();
          this.isVideoPlaying = false;
        }
      });
  }

  /**
   * it would handle download-progress event.
   * In fact, the download process is done chunk by chunk. Whenever a new chunk is downloaded, this event occurs.
   * The gotten value is number of milli-seconds received from video.
   */
  private _handleDownloadProgress(): void {
    this.connectionVideoManager?.onDownloadProgress
      .pipe(takeUntil(this._onDestroy))
      .subscribe((millis: number) => {
        this.totalVideoDurationTillNow = Math.max(millis, this.totalVideoDurationTillNow);
        const proportion = millis / this.totalVideoDurationTillNow;
        this._renderer.setStyle(
          this._sliderProgress.nativeElement,
          'width',
          proportion * 100 + '%'
        );
      });
  }

  /**
   * handling download-complete event.
   */
  private _handleDownloadComplete(): void {
    this.connectionVideoManager?.onDownloadComplete
      .pipe(takeUntil(this._onDestroy))
      .subscribe((downloadCompleteEvent: SectionDownloadCompleteEvent) => {
        this._atLeastOneSectionDownloaded = true;
        if (
          this._stillConnectedToRemote &&
          downloadCompleteEvent.numberOfReceivedCharacters === 0
        ) {
          this._stillConnectedToRemote = false;
          this._getAllSavedFramesFromServer();
        }
        this.setPlaybackSpeed(this.currentPlaybackSpeed);
      });
  }

  /**
   * it would handle the end of the section => next section should be shown.
   * In other words, when the user reaches to the last part of the section, this event occurs.
   * the absolute frame associated with the last part of the section is given in this event
   * so we can start the next section with this frame independently.
   */
  private _handleEndOfSection(): void {
    this.connectionVideoManager?.onSectionEnd
      .pipe(
        tap(() => this._connectionVideoService.saveFrameInfoIfUseful(this.connectionVideoManager!)),
        filter(() => !this.isJumping), // when jumping, this event is managed somewhere else and it shouldn't be managed here.
        takeUntil(this._onDestroy)
      )
      .subscribe((frame: any) => {
        if (!this._isAtTheEndOfTheVideo()) {
          this.connectionVideoManager?.startTheNextSection(frame);
        }
      });
  }

  /**
   * it would return true if we are at the end of the video.
   */
  private _isAtTheEndOfTheVideo(): boolean {
    return (
      !this._stillConnectedToRemote && this.currentPlaybackTime === this.totalVideoDurationTillNow
    );
  }
}
