import { IpAddress, ConnectionSetting } from '@shared/models';
import { RemoteCategory } from './remote-category';
import { ConnectionType } from '@shared/enums';
import { OperatingSystemType } from '@shared/types';

/**
 * a remote machine information.
 */
export interface RemoteMachine {
  /**
   * id of remote machine
   */
  id: number;
  /**
   * name of remote machine
   */
  hostname: string;
  /**
   * ip addresses related to remote machine
   */
  ipAddresses: IpAddress[];
  /**
   * type of remotes os
   */
  os: OperatingSystemType;
  /**
   * related Tiyam id if exists
   */
  tiyamId: number;
  /**
   * type of remote category
   */
  categories: RemoteCategory[];
  /**
   * remotes connections
   */
  connections: ConnectionSetting[];
  /**
   * default connection id
   */
  defaultConnectionId: number;
  /**
   * default connection type.
   * it is added just to distinguish sshX connections from ssh connections.
   */
  defaultConnectionType?: ConnectionType;
  /**
   * if it has agent or not
   */
  hasAgent: boolean;
}
