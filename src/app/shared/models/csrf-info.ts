/**
 * csrf info is stored here. it is used when establishing remote-connection and also in our interceptor for http requests.
 */
/**
 * csrf info is stored here. it is used when establishing remote-connection and also in our interceptor for http requests.
 */
interface csrfInfo {
  csrf: string | undefined;
  csrfHeader: string | undefined;
  /**
   * it is the encryption of csrf by wina's public key. it is used to establish remote connections via the web-socket.
   */
  encryptedCsrf: string | undefined;
}

export const csrfInfo: csrfInfo = {
  csrf: undefined,
  csrfHeader: undefined,
  /**
   * it is the encryption of csrf by wina's public key. it is used to establish remote connections via the web-socket.
   */
  encryptedCsrf: undefined,
};
