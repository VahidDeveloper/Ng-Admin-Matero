import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, ObservableInput, of, OperatorFunction } from 'rxjs';

import { ForbiddenCommandsService } from './forbidden-commands.service';
import { ClipboardPatternsService } from './clipboard-patterns.service';
import { GenericCrudService } from './generic-crud.service';
import {
  RemoteMachine,
  RemoteMachineExtended,
  ListServerResponse,
  ForbiddenRemoteCommand,
  PortConnection,
  DefaultConnection,
  UserOtp,
  SetOtp,
  OtpDestination,
  RemoteCategory,
} from '@shared/interfaces';
import {
  WinaRestUrls,
  ConnectionSetting,
  FilterRemoteMachines,
  ListServerRequest,
  WinaRestApiError,
} from '@shared/models';
import { convertIpAddress, convertIpAddressToServer } from '@shared/utils';

/** its a service to provide data fetching for remote machines */
@Injectable({
  providedIn: 'root',
})
export class RemoteMachineService extends GenericCrudService<RemoteMachine> {
  /** latest remote-machines-list would be stored here */
  private _cachedRemoteMachinesList: RemoteMachineExtended[] | undefined;
  /** return latest remote-machines-list stored in the service */
  get cachedRemoteMachinesList(): RemoteMachineExtended[] | undefined {
    return this._cachedRemoteMachinesList;
  }

  constructor(
    protected _http: HttpClient,
    private _clipboardPatternsService: ClipboardPatternsService,
    private _forbiddenCommandsService: ForbiddenCommandsService
  ) {
    super(_http, WinaRestUrls.remoteMachine());
  }

  /**
   * it will extend RemoteMachine to RemoteMachineExtended by adding RemoteMachineService and concatenatedCategories fields
   * to remote machine object
   */
  private static extendRemoteMachine(rm: RemoteMachine): RemoteMachineExtended {
    let hasDefaultConnection = false;
    // todo the bottom line should be removed after server applied some changes
    rm.connections = rm.connections.map((connection: ConnectionSetting) => {
      connection.isDefault =
        connection.id === rm.defaultConnectionId &&
        connection.primarySetting.protocol?.toLowerCase() ===
          rm.defaultConnectionType?.toLowerCase();
      if (connection.isDefault) {
        hasDefaultConnection = true;
      }
      return connection;
    });
    // this part is setting first connection if there was not default connection sat before
    if (!hasDefaultConnection) {
      if (rm.connections?.length > 0) {
        rm.connections[0].isDefault = true;
      }
    }
    rm.ipAddresses = convertIpAddress(rm.ipAddresses);
    const primaryIpAddress = rm.ipAddresses ? rm.ipAddresses.find(i => i.primary)?.ipAddress : null;
    const concatenatedCategories = rm.categories ? rm.categories.map(c => c.name).join(' ,') : null;
    return { ...rm, primaryIpAddress, concatenatedCategories } as RemoteMachineExtended;
  }

  /** this method will convert remote machines object into the servers desired one */
  private static _getServerProperRemoteMachine(
    rm: Partial<RemoteMachineExtended>,
    isEditing: boolean
  ): Partial<RemoteMachineExtended> {
    return {
      os: rm.os,
      hostname: rm.hostname,
      categories: rm.categories ? rm.categories.map(c => c.id) : ([] as any),
      ipAddresses: convertIpAddressToServer(rm.ipAddresses),
      ...(isEditing && { id: rm.id }), // it will insert 'id' if we are editing remote machine
    };
  }

  /** it will fetch list of remote machines */
  getRemoteMachines(
    filter: FilterRemoteMachines,
    listServerRequest: ListServerRequest
  ): Observable<ListServerResponse<RemoteMachineExtended>> {
    const sendObj = {
      ...filter?.getServerObject(),
      ...listServerRequest?.getServerObject(),
    };
    /**
     * in all api the property queryWord is used but in remoteMachine List  searchWord is used!! and it should be fixed by backend
     */
    if (sendObj.queryWord) {
      sendObj.searchWord = sendObj.queryWord;
    }
    return super.advanceSearch(sendObj).pipe(
      map((i: ListServerResponse<RemoteMachine>) => ({
        ...i,
        results: i.results.map((rm: RemoteMachine) => RemoteMachineService.extendRemoteMachine(rm)),
      })),
      tap((data: ListServerResponse<RemoteMachineExtended>) => {
        this._cachedRemoteMachinesList = data.results;
      })
    );
  }

  /** it will fetch list of remote machines */
  getRemoteMachine(remoteMachineId: number): Observable<RemoteMachineExtended> {
    return super.getById(remoteMachineId).pipe(
      map((rm: RemoteMachine) => {
        rm.connections.sort(
          (a: ConnectionSetting, b: ConnectionSetting) =>
            a.primarySetting.protocol?.localeCompare(b.primarySetting.protocol!) || b.id! - a.id!
        );
        return RemoteMachineService.extendRemoteMachine(rm);
      }) as OperatorFunction<RemoteMachine | RemoteMachine[], RemoteMachineExtended>
    );
  }

  /**
   * it would find remote-machine based on the specified id.
   * first of all, it would try to find it locally
   * if not found, it would send a request to server to return its info
   */
  findRemoteMachineLocallyIfPossible(remoteMachineId: number): Observable<RemoteMachineExtended> {
    const foundRemoteMachine = this.cachedRemoteMachinesList?.find(
      (remoteMachineExtended: RemoteMachineExtended) => remoteMachineExtended.id === remoteMachineId
    );
    return foundRemoteMachine ? of(foundRemoteMachine) : this.getRemoteMachine(remoteMachineId);
  }

  /** it will remove list of specified remote machines */
  removeRemoteMachines(remotes: RemoteMachineExtended[]): Observable<Partial<RemoteMachine>> {
    const desiredRemotes = remotes.map(({ id, hostname }: RemoteMachineExtended) => ({
      id,
      hostname,
    })) as RemoteMachineExtended[];
    return super.deleteAll(desiredRemotes);
  }

  /**
   * this method will add or edit a remote machines with its "forbidden commands" and "clipboard patterns" configurations.
   * NOTE in adding remote machine it will initially create the remote machines itself then it will do 2 concurrent async calls
   * ["edit remote machine", "edit patterns", "edit forbidden commands"]
   * NOTE in editing remote machine it will do 3 concurrent async calls ["edit remote machine", "edit patterns", "edit forbidden commands"]
   * @returns it will return an array which includes:
   * [0] remote machine
   * [1] forbidden commands
   * [2] and patterns which is list of string
   * @example [new RemoteMachineExtended(), new ForbiddenRemoteCommand(), ['pattern 1']]
   */
  addEditRemoteMachine(
    rm: RemoteMachineExtended,
    commands: ForbiddenRemoteCommand,
    patterns: string[],
    isEditing: boolean
  ): Observable<(RemoteMachineExtended | ForbiddenRemoteCommand | string[] | WinaRestApiError)[]> {
    if (isEditing) {
      const sources = [
        this.editRemoteMachines([rm]),
        ...this._combineExistingSources(rm, commands, patterns),
      ];
      return forkJoin(sources);
    } else {
      return this.addRemoteMachines([rm]).pipe(
        mergeMap((newRemote: RemoteMachineExtended) => {
          const sources = [
            //:TODO: newRemote type
            // of(newRemote[0]), // include answer of adding remote machine (newRemote) to final response
            of(newRemote), // include answer of adding remote machine (newRemote) to final response
            ...this._combineExistingSources(newRemote, commands, patterns),
          ];
          return forkJoin(sources);
        }) as OperatorFunction<RemoteMachineExtended | WinaRestApiError, any[]>
      );
    }
  }

  /** it will add list of remote machines */
  addRemoteMachines(
    remoteMachines: Partial<RemoteMachineExtended>[]
  ): Observable<RemoteMachineExtended | WinaRestApiError> {
    const sendingList = remoteMachines.map((rm: Partial<RemoteMachineExtended>) =>
      RemoteMachineService._getServerProperRemoteMachine(rm, false)
    ) as unknown as RemoteMachine;
    //:TODO: check type
    return super.save(sendingList).pipe(
      map((rm: RemoteMachine) => RemoteMachineService.extendRemoteMachine(rm)),
      catchError((error: any) => of(error.errors[0]))
    );
  }

  /** it will edit list of remote machines */
  editRemoteMachines(
    remoteMachines: Partial<RemoteMachineExtended>[]
  ): Observable<RemoteMachineExtended | WinaRestApiError> {
    const sendingList = remoteMachines.map((rm: Partial<RemoteMachineExtended>) =>
      RemoteMachineService._getServerProperRemoteMachine(rm, true)
    ) as unknown as RemoteMachine;
    //:TODO: check type
    return super.update(sendingList).pipe(
      map((rm: RemoteMachine) => RemoteMachineService.extendRemoteMachine(rm)),
      catchError((error: any) => of(error.errors[0]))
    );
  }

  /** it will check port connection status*/
  checkPortConnection(connectionId: number): Observable<PortConnection> {
    return this._http.get<PortConnection>(WinaRestUrls.checkPortConnection(connectionId));
  }

  /**
   * it would ping the specified ip-address
   */
  pingIpAddress(ipAddr: string): Observable<number> {
    return this._http.post<number>(WinaRestUrls.pingURL(), { ipAddr });
  }

  /**
   * it would set a connection to default connection
   */
  addDefaultConnection(body: DefaultConnection): Observable<boolean> {
    return this._http.put<boolean>(WinaRestUrls.addDefaultConnection(), body);
  }

  /**
   * is would get all user for otp request
   */
  getUserListOtpRequest(hostId: number): Observable<UserOtp> {
    return this._http.get<UserOtp>(WinaRestUrls.getUserListOtpRequest(hostId), {});
  }

  /**
   * set otp request
   */
  setOtpRequest(body: SetOtp[]): Observable<Partial<OtpDestination>> {
    return this._http.post<Partial<OtpDestination>>(WinaRestUrls.setOtpRequest(), body);
  }

  /**
   * it will combine "forbidden commands" and "clipboard patterns" sources of remote machine
   * based on if each of them exist the method will create sources list
   */
  private _combineExistingSources(
    remoteMachine: RemoteMachineExtended,
    commands: ForbiddenRemoteCommand,
    patterns: string[]
  ): ObservableInput<any>[] {
    const sources: ObservableInput<any>[] = [];
    if (commands) {
      sources.push(
        this._forbiddenCommandsService.editRemotesForbiddenCommands(
          commands,
          remoteMachine.id,
          'host'
        )
      );
    }
    if (patterns) {
      sources.push(
        this._clipboardPatternsService.editRemotesClipboardPatterns(
          patterns,
          remoteMachine.id,
          'host'
        )
      );
    }
    return sources;
  }
}
