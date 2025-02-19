import { IpAddress } from '@shared/models';

/**
 * a temporary func for converting server object to client and vise versa
 */
export function convertIpAddress(serverIpList: IpAddress[]): IpAddress[] {
  return serverIpList.map(ip => ({
    id: ip.id,
    hostId: ip.hostId,
    ipAddress: ip.ipAddress,
    primary: ip.primary,
    hasConnections: ip.hasConnections,
  }));
}

export function convertIpAddressToServer(clientIpAddresses: IpAddress[] | undefined): any {
  return clientIpAddresses?.map(ip => ({
    id: ip.id,
    hostId: ip.hostId,
    ipAddr: ip.ipAddress,
    primary: !!ip.primary,
  }));
}
