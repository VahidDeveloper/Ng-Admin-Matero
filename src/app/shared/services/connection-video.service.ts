import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConnectionFramesService } from './connection-frames.service';
import { ConnectionVideoManager } from '@shared/models';
import { SavedAbsoluteFrameInfo } from '@shared/interfaces';

/**
 * a service to handle operations associated with a connection's video.
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionVideoService {
  /**
   * CONSTRUCTOR
   */
  constructor(private _connectionFramesService: ConnectionFramesService) {}

  /**
   * this is a temporary function to return server time. for now, it just return Date.now()
   * but in the future, server time would be stored in a state in core module.
   * at that time, this function should be removed.
   */
  getServerTime(): number {
    return Date.now();
  }

  /**
   * it would seek to target time.
   * to reach this goal, it may traverse multiple sections.
   */
  seekToTargetTime(
    targetTime: number,
    connectionVideoManager: ConnectionVideoManager
  ): Observable<null> {
    return this.setSectionToStartSeeking(targetTime, connectionVideoManager).pipe(
      switchMap(() => connectionVideoManager.seekTillReachToTargetTime(targetTime)),
      map(() => null)
    );
  }

  /**
   * it would get nearest frame to target time from server if this action is useful.
   * it would return the gotten frame or it would return null if it is not a good idea to receive such frame.
   * For example, if the targetTime is located in the current section, getting saved frame is useless
   * because we can seek from current section.
   */
  setSectionToStartSeeking(
    targetTime: number,
    connectionVideoManager: ConnectionVideoManager
  ): Observable<void | null> {
    if (connectionVideoManager.isInSectionRange(targetTime)) {
      // => it is not a good idea to get saved frame
      return of(null);
    } else {
      return this._connectionFramesService
        .getAbsoluteFrameNearestToTargetEpoch(
          connectionVideoManager.tunnelUuid,
          (connectionVideoManager.firstSectionStartEpoch ?? 0) + parseInt(targetTime + '', 10),
          connectionVideoManager.videoId
        )
        .pipe(
          switchMap((savedAbsoluteFrameInfo: SavedAbsoluteFrameInfo) => {
            return connectionVideoManager.startSectionBasedOnSavedFrame(savedAbsoluteFrameInfo);
          }),
          catchError(() => of(null)) // => cannot get desired frame
        );
    }
  }

  /**
   *
   * it would get absolute video frames saved in server.
   */
  getAllSavedVideoFrames(id: string): Observable<Partial<SavedAbsoluteFrameInfo>[]> {
    return this._connectionFramesService.getAllSavedVideoFrames(id);
  }

  /**
   * it would save frame's information if it is a useful operation.
   */
  saveFrameInfoIfUseful(connectionVideoManager: ConnectionVideoManager): void {
    return this._connectionFramesService.saveFrameInfoIfUseful(connectionVideoManager);
  }
}
