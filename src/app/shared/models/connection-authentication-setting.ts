import { ConnectionSecurity } from '@shared/enums';

export class ConnectionAuthenticationSetting {
  /**
   * if true when user try to connect the password will be gotten from him
   */
  askPassword = false;
  security: ConnectionSecurity | undefined;
  /**
   * if true when user try to connect the username will be gotten from him
   */
  askUsername = false;
  authenticationType: any = 'connectionSetting';
  domain?: string;
  username?: string;
  password?: string;
  ignoreCert = false;
  /**
   * when authentication type is "storedCredentials" is used
   */
  selectedCredential?: any;
  /**
   * it is used in ssh connection for extra security
   */
  hostKey?: string;
  /**
   * whether ignoring key-hash or not. used for ssh-connections.
   */
  ignoreKeyHash?: boolean;
}
