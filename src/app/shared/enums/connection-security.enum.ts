/**
 * security protocol for connection authentication setting
 * usually just for rdp and terminal serviced
 */
export enum ConnectionSecurity {
  RDP = 'rdp',
  NLA = 'nla',
  TLS = 'tls',
  Any = 'any',
}
