import { InteractiveInfo } from './interactive-info';

/**
 * active connection table data
 */
export interface LiveConnectionInfo {
  /**
   * remote machine ip address
   */
  address: string;
  /**
   * Browser user uses
   */
  agent: string;
  /**
   * in terminal service label of application
   */
  applicationLabel?: string;
  /**
   * in terminal service name of application
   */
  applicationName?: string;
  clientIp: string;
  /**
   * connection configuration id
   */
  connId: number;
  connectTime: number;
  connectionName: string;
  /**
   * user display name
   */
  displayName: string;
  hostId: number;
  hostname: string;
  /**
   * connection instance id. it will be used to monitor user activity in connection in real time
   */
  id: string;
  /**
   * interactive type , when more than one user is connected to remote machine using the same connection instance
   */
  interactiveInformation: InteractiveInfo;

  ldapServer: string;
  os: string;
  port: string;
  /**
   * type of protocol
   */
  protocol: string;
  /**
   * user is not connected using wina. he is using some other application, but wina monitors it transparently
   */
  transparent: boolean;
  username: string;
  usernameWithLdapServer?: string;
  uuid: string;
}
