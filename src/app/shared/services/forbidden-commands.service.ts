import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ForbiddenRemoteCommand } from '@shared/interfaces';
import { WinaRestUrls, WinaRestApiError } from '@shared/models';

/** it will provide forbidden commands needs for data transfer with server */
@Injectable({
  providedIn: 'root',
})
export class ForbiddenCommandsService {
  /** CONSTRUCTOR */
  constructor(private _http: HttpClient) {}

  /** it will fetch remotes forbidden commands. */
  getRemotesForbiddenCommands(
    remoteId: number,
    remoteType: string
  ): Observable<ForbiddenRemoteCommand> {
    const sendObj = { remoteId, remoteType };
    return this._http
      .post<any>(WinaRestUrls.getRemotesForbiddenCommandsURL(), sendObj)
      .pipe(map(i => ({ commandGroups: i.templates, commands: i.commands })));
  }

  /** it will fetch list of remote forbidden commands */
  editRemotesForbiddenCommands(
    forbiddenCommands: ForbiddenRemoteCommand,
    remoteId: number | undefined,
    remoteType: string
  ): Observable<ForbiddenRemoteCommand | WinaRestApiError> {
    const sendObj = {
      remoteId,
      remoteType,
      commands: forbiddenCommands.commands,
      templateIds: forbiddenCommands.commandGroups?.map(t => t.id),
    };
    return this._http.post<any>(WinaRestUrls.editRemotesForbiddenCommandsURL(), sendObj).pipe(
      map(i => ({ commandGroups: i.templates, commands: i.commands })),
      catchError((error: any) => of(error.errors[0]))
    );
  }
}
