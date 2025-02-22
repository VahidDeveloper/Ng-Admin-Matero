/**
 * a class to manage remote machines agent
 */
export interface Agent {
  guid: number | undefined;
  hostId: number;
  hostIpAddress: string;
  computerName: string;
  ipAddresses: string[];
  macAddresses: string[];
  usernames: string[];
  os: string;
  clientVersion: string;
  registered: boolean;
}
