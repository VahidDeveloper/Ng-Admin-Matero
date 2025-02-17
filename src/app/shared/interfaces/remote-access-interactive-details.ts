/**
 * interactive details of the remote-access
 */
export interface RemoteAccessInteractiveDetails {
  /**
   * time of establishing interactive connection
   */
  connectTime: number;
  /**
   * time of disconnecting from it. if it is -1, it means the user is still connected in interactive mode.
   */
  disconnectTime: number;
  /**
   * the displayName of the user that interact with the connection to monitor it.
   */
  displayName: string;
  /**
   * the ldapServer of the user that interact with the connection to monitor it.
   */
  ldapServer: string;
  /**
   * the username of the user that interact with the connection to monitor it.
   */
  username: string;
}
