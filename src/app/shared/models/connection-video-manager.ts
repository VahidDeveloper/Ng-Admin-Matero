import { Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, first, map, switchMap, takeLast, takeWhile, tap } from 'rxjs/operators';

import { ConnectionVideoSection } from './connection-video-section';
import { SavedAbsoluteFrameInfo, SectionDownloadCompleteEvent } from '@shared/interfaces';
import { WinaRestUrls } from './wina-rest-urls';
import Guacamole from '@assistivlabs/guacamole-common-js';

/**
 * it is set in the library but here you can change it to the value you want.
 */
Guacamole.sectionEstimatedChars = 5e6;

/**
 * connection video's interface to enable playing the video and handling its events.
 */
export class ConnectionVideoManager {
  /**
   * CONSTRUCTOR
   */
  constructor(videoId: string, tunnelUuid: string) {
    this.videoId = videoId;
    this.tunnelUuid = tunnelUuid;
    const recordingUrl: string = WinaRestUrls.getTargetFileURL(videoId);
    this._playbackTunnel = new Guacamole.SessionRecording._PlaybackTunnel();
    this._playbackClient = new Guacamole.Client(this._playbackTunnel);
    this.tunnel = new Guacamole.StaticHTTPTunnel(recordingUrl);
    const recordingDisplay = this._playbackClient.getDisplay();
    recordingDisplay.onresize = (width: number, height: number) => {
      this.onVideoResize.next({
        width,
        height,
      });
    };
    this.recordingDisplay = recordingDisplay;
  }

  /**
   * section characters gotten from server have to be less than this value.
   */
  static get maximumTolerableSectionChars(): number {
    return 2 * Guacamole.sectionEstimatedChars;
  }

  /**
   * the video id
   */
  readonly videoId: string;
  /**
   * tunnel's uuid
   */
  readonly tunnelUuid: string;
  /**
   * frames stored in server brief information.
   * note that the absolute frames are not stored here because they are large.
   * only frame's index, time and similar things are stored in this list for each frame.
   */
  savedFramesBriefInfo: Partial<SavedAbsoluteFrameInfo>[] = [];
  /**
   * the video's display. by adding this to DOM, video would be shown.
   * it is of type Guacamole.Display. The typescript class will be added in the future.
   */
  readonly recordingDisplay: Readonly<any>;
  /**
   * we can pause, play, ... the video via this object.
   * Note that, this instance would be changed each time section is changed.
   */
  recording: any;
  /**
   * first section's start time.
   * at first it is null but after getting the first section, this should get value appropriately.
   * It is vital for partitioning the videos.
   */
  firstSectionStartEpoch?: number;
  /**
   * contains current video section's information such as start-frame, startTime and etc.
   * Note that, this instance would be changed each time section is changed.
   */
  currentVideoSection = new ConnectionVideoSection(0, 0, 0);
  /**
   * when the video's size is changed, this event occurs.
   */
  readonly onVideoResize: Subject<{ width: number; height: number }> = new Subject<{
    width: number;
    height: number;
  }>();
  /**
   * for each seek, this event occurs. it occurs frequently specially when the video is playing.
   */
  readonly onSeek: Subject<number> = new Subject<number>();
  /**
   * the downloading is done chunk by chunk and for each chunk, this event occurs.
   */
  readonly onDownloadProgress: Subject<number> = new Subject<number>();
  /**
   * when video contents for desired section is downloaded completely, this event occurs.
   */
  readonly onDownloadComplete: Subject<SectionDownloadCompleteEvent> =
    new Subject<SectionDownloadCompleteEvent>();
  /**
   * when reaching to the end of section, this event occurs which contains section's last absolute frame.
   * the gotten frame is used to show the next section independently.
   */
  readonly onSectionEnd: Subject<any> = new Subject<any>();
  /**
   * it is used to get display of the video.
   * guac type: Guacamole.Client
   */
  private readonly _playbackClient: Readonly<any>;
  /**
   * it is used in combination with _playbackClient to create SessionRecording instance
   * guac type: Guacamole.SessionRecording._PlaybackTunnel
   */
  private readonly _playbackTunnel: Readonly<any>;
  /**
   * the tunnel to connect to remote-machine to get video's contents.
   * guac type: Guacamole.StaticHTTPTunnel
   */
  private readonly tunnel: any;
  /**
   * the id for seeking process.
   * When jumping to a target time manually, a process starts. this id is associated with that process.
   * to guarantee that new processes kill previous processes, we use this id.
   */
  private _seekerId?: symbol;

  /**
   * it would return true if the targetTime is in the range of current section.
   */
  isInSectionRange(targetTime: number): boolean {
    return (
      targetTime >= this.currentVideoSection.startTime &&
      targetTime <= (this.currentVideoSection.endTime ?? 0)
    );
  }

  /**
   * it would seek to target time LOCATED IN section.
   * when we call this function, we are sure that targetTime is among current video section.
   * after it reached to the targetTime, it would flush the display so that the pending instructions for display becomes executed.
   * so when subscribing to this function and receive a sucess response, we are sure that the display is sync with targetTime.
   */
  seekToTargetTimeInSectionAndFlush(targetTime: number): Observable<boolean> {
    const movingProcess = new Subject<boolean>();
    this.recording.seek(targetTime - this.currentVideoSection.startTime, () => {
      this.recordingDisplay.flush(() => {
        movingProcess.next(true);
        movingProcess.complete();
      });
    });
    return movingProcess.asObservable();
  }

  /**
   * it would seek to the end of current section.
   * the received data is the absolute frame of the next section.
   * note that in calculating endOfVideoTime, we add 10000 just for assurance that onSectionEnd would occur.
   * In fact, endOfVideoTime should be greater than section's duration so that onSectionEnd event occur.
   */
  seekToTheEndOfSection(): Observable<any> {
    if (
      this.currentVideoSection.endIndex === this.currentVideoSection.startIndex ||
      this.currentVideoSection.endTime == null
    ) {
      // when endIndex and startIndex are equal, it means that the current section has nothing. it may occur in rare cases
      // for example, if you want to seek to a point in video which is more than total video time, this may happen.
      return throwError('Cannot seek more because this section has nothing more to seek');
    }
    const observable = this.onSectionEnd.pipe(first());
    const endOfVideoTime: number =
      this.currentVideoSection.endTime - this.currentVideoSection.startTime + 10000;
    this.recording.seek(endOfVideoTime, () => {
      // nothing special should be done
    });
    return observable;
  }

  /**
   * it would seek to then end of current section and then start the next section.
   */
  seekTillTheStartOfNextSection(): Observable<void> {
    return this.seekToTheEndOfSection().pipe(
      switchMap((frame: any) => this.startTheNextSection(frame))
    );
  }

  /**
   * it would seek to the nearest time before target time based on current section.
   * if targetTime is in current section, it would easily seek to targetTime.
   * if targetTime is before current section, it should start from the beginning.
   * if targetTime is after current section, it should seek to the end of current section and start the next section.
   */
  seekToNearestTimeBeforeTargetTime(targetTime: number): Observable<boolean> {
    if (this.isInSectionRange(targetTime)) {
      // => it is in current section
      return this.seekToTargetTimeInSectionAndFlush(targetTime).pipe(map(() => true));
    } else if (targetTime < this.currentVideoSection.startTime || targetTime === 0) {
      return this.startFromTheBeginning().pipe(map(() => false));
    } else {
      return this.seekTillTheStartOfNextSection().pipe(map(() => false));
    }
  }

  /**
   * it would do the process of seeking until reaching to the targetTime.
   * it would repeat subscribing to seekToNearestTimeBeforeTargetTime function until reaching to our desired targetTime.
   * when we get true from seekToNearestTimeBeforeTargetTime, it means that we have reached to the destination.
   */
  seekTillReachToTargetTime(targetTime: number): Observable<boolean> {
    const repeatSubject = new ReplaySubject();
    repeatSubject.next(null); // to start the process.
    const seekerId = Symbol('seekerId');
    this._seekerId = seekerId;
    return repeatSubject.pipe(
      switchMap(() => this.seekToNearestTimeBeforeTargetTime(targetTime)),
      takeWhile(() => this._seekerId === seekerId),
      tap((seekDone: boolean) => {
        if (seekDone) {
          repeatSubject.complete();
        } else {
          repeatSubject.next(null);
        }
      }),
      catchError(error => {
        repeatSubject.complete();
        throw error;
      }),
      takeLast(1)
    );
  }

  /**
   * function to start the next section based on the start frame.
   */
  startTheNextSection(sectionStartFrame: any): Observable<void> {
    const sectionStartTime: number = sectionStartFrame.timestamp - this.firstSectionStartEpoch!;
    const sectionStartIndex: number | undefined = this.currentVideoSection.startIndex;
    this.currentVideoSection = new ConnectionVideoSection(
      sectionStartFrame,
      sectionStartTime,
      sectionStartIndex
    );
    return this._startCurrentSection();
  }

  /**
   * function to start the first video section
   */
  startFromTheBeginning(): Observable<void> {
    this.currentVideoSection = new ConnectionVideoSection(null, 0, 0);
    return this._startCurrentSection();
  }

  /**
   * it would start a new section based on saved frame information gotten from server.
   */
  startSectionBasedOnSavedFrame(savedAbsoluteFrameInfo: SavedAbsoluteFrameInfo): Observable<void> {
    const sectionStartTime: number = savedAbsoluteFrameInfo.time - this.firstSectionStartEpoch!;
    const sectionStartIndex: number = savedAbsoluteFrameInfo.index;
    this.currentVideoSection = new ConnectionVideoSection(
      JSON.parse(savedAbsoluteFrameInfo.frame),
      sectionStartTime,
      sectionStartIndex
    );
    return this._startCurrentSection();
  }

  /**
   * it would start getting current section's information and provide an interface to manage the section
   * both _startFromTheBeginning and _startTheNextSection use this function to start their desired section.
   * the subscription would finish only when the section is downloaded completely.
   */
  private _startCurrentSection(): Observable<void> {
    const downloadingProcess = new Subject<void>();
    this._killPreviousSectionRemainedItems();
    this.recording = new Guacamole.SessionRecording(
      this.tunnel,
      this._playbackTunnel,
      this._playbackClient
    );
    // Begin downloading the recording
    const numberOfCharsToDownload = this._getNumberOfCharsToDownload();
    this.recording.connect(
      null,
      this.currentVideoSection.startIndex,
      this.currentVideoSection.startIndex + numberOfCharsToDownload,
      this.currentVideoSection.firstFrame
    );
    // using rxjs data stream to handle video seeking:
    this.recording.onseek = (millis: number) => {
      this.onSeek.next(this.currentVideoSection.startTime + millis);
    };
    // using rxjs data stream to handle download progress:
    this.recording.onprogress = (millis: number) => {
      this.onDownloadProgress.next(this.currentVideoSection.startTime + millis);
    };
    this.recording.onLastAbsoluteFrame = (newFrame: any) => {
      this.onSectionEnd.next(newFrame);
    };
    this.tunnel.afterGettingDesiredStr = (
      numberOfReceivedCharacters: number,
      startEpoch: number,
      endEpoch: number
    ) => {
      this._completeCurrentSectionInfo(numberOfReceivedCharacters, startEpoch, endEpoch);
      this.onDownloadComplete.next({
        numberOfReceivedCharacters,
        startEpoch,
        endEpoch,
      });
      if (numberOfReceivedCharacters === 0) {
        downloadingProcess.error(
          'Cannot start new section because there is a problem in downloading it'
        );
      } else {
        downloadingProcess.next();
        downloadingProcess.complete();
      }
    };
    return downloadingProcess.asObservable();
  }

  /**
   * it would prepare the environment to start current section.
   * it would disconnect from previous section's recording and things like that.
   * also, if it finds out that we want to show the first section, it would remove all layers in display.
   */
  private _killPreviousSectionRemainedItems(): void {
    if (this.recording != null) {
      this.recording.disconnect();
      delete this.recording.onseek;
      delete this.recording.onprogress;
      delete this.recording.onLastAbsoluteFrame;
      if (this.currentVideoSection.startIndex === 0) {
        // remove all layers
        this._playbackClient.importState({
          currentState: 0,
          currentTimestamp: 0,
          layers: {},
        });
      }
    }
  }

  /**
   * it would complete current section information:
   * based on arguments, it would find out the value of endIndex and endTime properties.
   */
  private _completeCurrentSectionInfo(
    numberOfReceivedCharacters: number,
    startEpoch: number,
    endEpoch: number
  ): void {
    if (this.firstSectionStartEpoch == null) {
      this.firstSectionStartEpoch = startEpoch;
    }
    const currentVideoSection: ConnectionVideoSection = this.currentVideoSection;
    currentVideoSection.endIndex = currentVideoSection.startIndex + numberOfReceivedCharacters;
    currentVideoSection.endTime = currentVideoSection.startTime + (endEpoch - startEpoch);
  }

  /**
   * it would discover the best number of characters to download for current section.
   * in default it would be startIndex + Guacamole.sectionEstimatedChars but
   * if _getNumOfCharsToDownloadBasedOnSavedFrames finds a better number, we use that instead.
   */
  private _getNumberOfCharsToDownload(): number {
    return Math.max(
      this._getNumOfCharsToDownloadBasedOnSavedFrames(),
      Guacamole.sectionEstimatedChars
    );
  }

  /**
   * Based on saved-frames, it would discover the best number of characters to download for current section.
   * if it couldn't find an appropriate number, it would return -1.
   */
  private _getNumOfCharsToDownloadBasedOnSavedFrames(): number {
    const currentSectionStartIndex: number = this.currentVideoSection.startIndex;
    const charsNumToDownload = this.savedFramesBriefInfo
      .map((item: Partial<SavedAbsoluteFrameInfo>) => item.index)
      .filter(
        (value: number | undefined) =>
          value !== undefined &&
          value > currentSectionStartIndex &&
          value - currentSectionStartIndex <= ConnectionVideoManager.maximumTolerableSectionChars
      )
      .pop();
    return charsNumToDownload ? charsNumToDownload - currentSectionStartIndex : -1;
  }
}
