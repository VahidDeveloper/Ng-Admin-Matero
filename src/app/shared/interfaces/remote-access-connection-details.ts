import { ConnectionSetting } from '@shared/models';
import { ConnectionStatusType, DisconnectionCauseType } from '../types/filter-types';

/**
 * remote access connection details gotten from server.
 */
export interface RemoteAccessConnectionDetails {
  connectTime: number;
  /**
   * if it is -1, it means that the connection is not disconnected.
   */
  disconnectTime: number;
  /**
   * whether the user is still connected to remote-machine or not.
   */
  stillWorking: boolean;
  /**
   * whether establishing connection was successful, failed or denied.
   */
  remoteConnectType: ConnectionStatusType;
  /**
   * the username of the user who connected to the remote-machine.
   */
  username: string;
  /**
   * the ldapServer of the user who connected to the remote-machine.
   */
  ldapServer: string;
  /**
   * the displayName of the user who connected to the remote-machine.
   */
  displayName: string;
  /**
   * the username of the user which closes the connection.
   */
  closeUsername: string;
  tunnelUuid: string;
  /**
   * connection's parameters
   */
  connectionParameters: ConnectionSetting;
  protocol: string;
  /**
   * whether the user was admin or not
   */
  adminUser: boolean;
  /**
   * the connected remote machine's address.
   */
  address: string;
  /**
   * the connected remote machine's name.
   */
  hostname: string;
  /**
   * the connected remote machine's operating system.
   */
  os: string;
  sessionId: string;
  /**
   * the user's ip address.
   */
  clientIp: string;
  /**
   * the web browser can be found from this member.
   */
  agent: string;
  type: string;
  /**
   * whether the user download anything during the connection.
   */
  hasDownload: boolean;
  /**
   * whether the user upload anything during the connection.
   */
  hasUpload: boolean;
  /**
   * the reason for which the connection was disconnected.
   */
  disconnectCause: DisconnectionCauseType;
  /**
   * only for terminal service protocol
   */
  applicationName: string;
  /**
   * only for terminal service protocol
   */
  applicationLabel: string;
  /**
   * if true, at least one interactive connection was established during the connectin.
   */
  hasInteractive: boolean;
  /**
   * if true, it would be a transparent connection (connection was not made in wina by monitored via wina)
   */
  transparent: boolean;
  /**
   * whether the user entered termination-command or not.
   */
  terminationCommand: boolean;
  /**
   * connection's error code if existed in string.
   * it is something like this '0x0200' which is a hexadecimal number in string.
   */
  connectionError?: string;
}
