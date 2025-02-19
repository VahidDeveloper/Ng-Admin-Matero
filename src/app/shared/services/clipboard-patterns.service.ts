import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WinaRestApiError, WinaRestUrls } from '@shared/models';

/** it will provide clipboard patterns needs for data transfer with server */
@Injectable({
  providedIn: 'root',
})
export class ClipboardPatternsService {
  /** CONSTRUCTOR */
  constructor(private _http: HttpClient) {}

  /** it will fetch remotes clipboard patterns */
  getRemotesClipboardPatterns(remoteId: number, remoteType: string): Observable<string[]> {
    const sendObj = { remoteId, remoteType };
    return this._http
      .post<any>(WinaRestUrls.getRemotesClipboardPatternsURL(), sendObj)
      .pipe(map(i => i.patterns));
  }

  /** it will fetch list of remotes clipboard patterns */
  editRemotesClipboardPatterns(
    patterns: string[],
    remoteId: number | undefined,
    remoteType: string
  ): Observable<string[] | WinaRestApiError> {
    const sendObj = { remoteId, remoteType, patterns };
    return this._http.post<any>(WinaRestUrls.editRemotesClipboardPatternsURL(), sendObj).pipe(
      map(i => i.patterns),
      catchError((error: any) => of(error.errors[0]))
    );
  }
}
