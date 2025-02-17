import { IpAddress } from '@shared/models';

/**
 * a temporary func for converting server object to client and vise versa
 */
export function convertIpAddress(serverIpList: any[]): IpAddress[] {
  return serverIpList.map(ip => ({
    id: ip.id,
    hostId: ip.hostId,
    ipAddress: ip.ipAddr,
    primary: ip.primary,
    hasConnections: ip.hasConnections,
  }));
}

export function convertIpAddressToServer(clientIpAddresses: IpAddress[]): any {
  return clientIpAddresses.map(ip => ({
    id: ip.id,
    hostId: ip.hostId,
    ipAddr: ip.ipAddress,
    primary: !!ip.primary,
  }));
}
