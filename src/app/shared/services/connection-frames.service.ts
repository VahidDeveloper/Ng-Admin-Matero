import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SavedAbsoluteFrameInfo } from '@shared/interfaces';
import { WinaRestUrls, ConnectionVideoManager } from '@shared/models';

/**
 * it is defined in guacamole library.
 */
declare let Guacamole: any;

/**
 * service to retrieve and manipulate connection frames information via server.
 * these frames are only useful for playing connection's video.
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionFramesService {
  /**
   * CONSTRUCTOR
   */
  constructor(private _http: HttpClient) {}

  /**
   * it would get an absolute frame nearest to target time from server.
   * note that this frame is definitely before the targetEpoch.
   */
  getAbsoluteFrameNearestToTargetEpoch(
    tunnelUuid: string,
    targetEpoch: number,
    filePath: string
  ): Observable<SavedAbsoluteFrameInfo> {
    const sendObj = {
      tunnelUuid,
      time: targetEpoch,
      filePath,
    };
    return this._http.post<SavedAbsoluteFrameInfo>(
      WinaRestUrls.getAbsoluteFrameByTimeURL(),
      sendObj
    );
  }

  /**
   * it would save the specified absolute frames to server so next time, we get them to reduce seeking processing time.
   */
  saveFrameInfo(
    tunnelUuid: string | undefined,
    frame: any,
    index: number | undefined,
    estimatedIndex: number | undefined,
    time: number | undefined
  ): Observable<boolean> {
    const sendObj = {
      tunnelUuid,
      sectionMaxCharacters: Guacamole.sectionEstimatedChars,
      frames: [
        {
          frame: JSON.stringify(frame),
          index,
          estimatedIndex,
          time,
        },
      ],
    };
    return this._http.post<boolean>(WinaRestUrls.saveAbsoluteFrameURL(), sendObj);
  }

  /**
   * it would get absolute video frames saved in server.
   * Note that this REST does not return the absolute frame but its other information such as index and time
   * because the absolute frames are large.
   */
  getAllSavedVideoFrames(tunnelUuid: string): Observable<Partial<SavedAbsoluteFrameInfo>[]> {
    return this._http
      .get<
        Partial<SavedAbsoluteFrameInfo>[]
      >(WinaRestUrls.getAllSavedVideoFramesInfoURL(tunnelUuid))
      .pipe(map(this.sortSavedFramesList));
  }

  /**
   * it would save frame's information if it is a useful operation.
   * If the frame is near at least one frame, it would not a good idea to save that frame
   * However, if the server has unlimited memory, it would be a good idea to save all frames even when they are near each other.
   * but because of restrictions, it is better to save those frames that are more necessary.
   */
  saveFrameInfoIfUseful(connectionVideoManager: ConnectionVideoManager): void {
    if (this._isSavingCurrentFrameUseful(connectionVideoManager)) {
      const frameInfo: Partial<SavedAbsoluteFrameInfo> = {
        tunnelUuid: connectionVideoManager.tunnelUuid,
        frame: connectionVideoManager.currentVideoSection.firstFrame,
        estimatedIndex: connectionVideoManager.currentVideoSection.startIndex, // should be null but now, server doesn't work without it
        index: connectionVideoManager.currentVideoSection.startIndex,
        time:
          (connectionVideoManager.firstSectionStartEpoch ?? 0) +
          connectionVideoManager.currentVideoSection.startTime,
      };
      this.saveFrameInfo(
        frameInfo.tunnelUuid,
        frameInfo.frame,
        frameInfo.index,
        frameInfo.estimatedIndex,
        frameInfo.time
      ).subscribe(() => {
        connectionVideoManager.savedFramesBriefInfo.push({
          ...frameInfo,
          frame: undefined,
        }); // => this frame will play a role in our decision to save new frames
        connectionVideoManager.savedFramesBriefInfo = this.sortSavedFramesList(
          connectionVideoManager.savedFramesBriefInfo
        );
      });
    }
  }

  /**
   * it would sort saved frames based on the value index from low to high.
   */
  sortSavedFramesList(
    framesList: Partial<SavedAbsoluteFrameInfo>[]
  ): Partial<SavedAbsoluteFrameInfo>[] {
    return framesList.sort(
      (a: Partial<SavedAbsoluteFrameInfo>, b: Partial<SavedAbsoluteFrameInfo>) => {
        if (a.index == null || b.index == null) {
          return 0;
        }
        return a.index < b.index ? -1 : 1;
      }
    );
  }

  /**
   * it would decide whether it is a good idea to save current frame or not.
   * If the frame is near at least one frame, it would not a good idea to save that frame
   * Note that, if any of saved frames' index property is null, we can not decide whether to save current frame or not
   * it is happened when the server has not calculated the accurate index yet.
   * in this case, false is returned so as not to save current frame.
   */
  private _isSavingCurrentFrameUseful(connectionVideoManager: ConnectionVideoManager): boolean {
    const currentFrameStartIndex: number = connectionVideoManager.currentVideoSection.startIndex;
    const itemTooNearToCurrentFrame: Partial<SavedAbsoluteFrameInfo | undefined> =
      connectionVideoManager.savedFramesBriefInfo.find(
        (item: Partial<SavedAbsoluteFrameInfo>) =>
          item.index == null ||
          Math.abs(item.index - currentFrameStartIndex) <= Guacamole.sectionEstimatedChars / 2
      );
    return itemTooNearToCurrentFrame == null; // if we couldn't find such item, it means that all frames are far from current frame.
  }
}
