/**
 * csrf info is stored here. it is used when establishing remote-connection and also in our interceptor for http requests.
 */
export const csrfInfo = {
  csrf: null,
  csrfHeader: null,
  /**
   * it is the encryption of csrf by wina's public key. it is used to establish remote connections via the web-socket.
   */
  encryptedCsrf: null,
};
