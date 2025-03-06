/**
 * a model to handle ssl certificate policy
 */
export interface SslPolicy {
  crlUpdateIntervalDays: number;
  rejectSelfSignedCert: boolean;
  tlsParameterHardening: boolean;
}
