import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectionType } from '@shared/enums';
import {
  RemoteMachine,
  InheritedClipboardPattern,
  InheritedCommand,
  InheritedCommandGroup,
  RemoteApplication,
} from '@shared/interfaces';
import { ConnectionSetting, WinaRestUrls } from '@shared/models';
import { convertIpAddress } from '@shared/utils';
import { GenericCrudService } from '../generic-crud.service';

/**
 * to manage all connection setting operation
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionSettingService extends GenericCrudService<ConnectionSetting> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.connection());
  }

  /**
   * get single connection information.
   * if connection not found in remote machine connections it will return null in connection part of result
   */
  getConnectionInfo(
    remoteMachineId: number,
    connectionId: number
  ): Observable<{
    machine: Partial<RemoteMachine>;
    connection: ConnectionSetting;
    inherited: {
      forbiddenClipboardPatterns: InheritedClipboardPattern[];
      forbiddenCommands: InheritedCommand[];
      forbiddenCommandGroups: InheritedCommandGroup[];
    };
  }> {
    return this._http.get(WinaRestUrls.getSingleConnectionInfoURL(remoteMachineId)).pipe(
      map((allConnectionsInfo: any) => {
        const connectionInfo: ConnectionSetting = allConnectionsInfo.connections.find(
          (c: any) => c.id === connectionId
        );
        return {
          machine: {
            hostname: allConnectionsInfo.hostname,
            ipAddresses: convertIpAddress(allConnectionsInfo.ipAddresses),
            id: allConnectionsInfo.id,
          },
          connection: connectionInfo,
          inherited: {
            forbiddenClipboardPatterns: allConnectionsInfo.forbidden.clipboardPatterns,
            forbiddenCommands: allConnectionsInfo.forbidden.commands,
            forbiddenCommandGroups: allConnectionsInfo.forbidden.commandGroups,
          },
        };
      })
    );
  }

  /**
   * save changes to server
   * if id is zero it will call edit otherwise it will call all
   * @param setting connection setting information
   */
  saveConnectionInfo(setting: ConnectionSetting) {
    setting = { ...setting };
    if (setting.primarySetting.protocol === ConnectionType.TerminalService) {
      setting.applications = setting.applications?.slice(); // => we do not opt to change the original array
      setting.applications?.forEach((item: RemoteApplication) => {
        item.connectionId = setting.id; // i think it would be better if server would not get this value, it is redundant.
        // if item.image has value it means that the user has chosen a new image. otherwise, previous image depected by imageId is used.
        // note that server does not want the first portion of the stream like data:image/png;base64, which is why we slice the image:
        item.image = item.image ? item.image.slice(item.image.indexOf(',') + 1) : undefined;
      });
    }
    if (setting.id === 0) {
      delete setting.id;
      return this.save(setting);
    } else {
      return this.update(setting);
    }
  }
}
