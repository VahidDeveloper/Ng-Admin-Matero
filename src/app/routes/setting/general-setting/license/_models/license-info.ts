/** a model for wina licenses information */
export interface LicenseInfo {
  activationCode: string;
  maxConnections: number;
  maxConcurrentSessions: number;
  machineId: string;
  expiryDate: number;
}
