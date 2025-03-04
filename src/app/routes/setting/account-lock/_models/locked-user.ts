/**
 * this model use to show blocked users in a connection
 */
export interface LockedUser {
  connectionId: string;
  displayName: string;
  hostId: number;
  hostName: string;
  ipAddress: string;
  ldapServer: string;
  os: string;
  protocol: string;
  remoteAdmin: boolean;
  username: string;
  connectionName: string;
}
