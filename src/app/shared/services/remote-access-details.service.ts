import { Observable, share } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  SessionSearchFoundTextsDetails,
  RemoteAccessDetails,
  ListServerResponse,
} from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * a service which does operations associated with remote-access details.
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteAccessDetailsService {
  constructor(private _http: HttpClient) {}

  /**
   * it would get remote-access details from server.
   * @param id the tunnel's id.
   */
  getRemoteAccessDetails(id: string): Observable<RemoteAccessDetails> {
    return this._http.get<RemoteAccessDetails>(WinaRestUrls.remoteAccessDetailsUrl + '/' + id);
  }

  /**
   * it would get remote-access video detail from server.
   * @param searchText user search params
   * @param tunnelUuid session id
   */
  getVideoResult(
    searchText: string,
    tunnelUuid: string
  ): Observable<ListServerResponse<SessionSearchFoundTextsDetails>> {
    const serverObj = {
      limit: 100,
      multiple: 0,
      searchText,
      tunnelUuid,
      textInput: [
        'sessionText',
        'forbiddenCommand',
        'copyToRemote',
        'pasteFromRemote',
        'keyLog',
        'blockedPasteFromRemote',
        'blockedCopyToRemote',
      ],
    };
    return this._http.post<ListServerResponse<SessionSearchFoundTextsDetails>>(
      WinaRestUrls.SessionSearchResultsURL(),
      serverObj
    );
  }
}
