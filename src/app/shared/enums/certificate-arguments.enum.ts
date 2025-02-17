/**
 * arguments associated with rdp certificate.
 * in rdp connection, when certificate error occurs, these arguments with their values are sent via web-socket.
 * we would show the value of these parameters in a modal so that the user decide whether to connect to remote-machine or not.
 */
export enum CertificateArguments {
  Fingerprint = 'fingerprint',
  CommonName = 'commonName',
  Subject = 'subject',
  Issuer = 'issuer',
}
