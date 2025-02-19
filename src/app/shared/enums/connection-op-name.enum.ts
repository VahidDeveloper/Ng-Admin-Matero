/**
 * this enum is created for OperationType of Remote Machine Connections
 */

export enum ConnectionOpNameEnum {
  /**
   * remove connection
   */
  Remove = 'Remove',
  /**
   * EditConnection
   */
  EditConnection = 'EditConnection',
  /**
   * Check connection port reachability`
   */
  Reachability = 'Reachability',
  /**
   * set connection as a default connection
   */
  DefaultConnection = 'DefaultConnection',

  ConnectToRemoteMachine = 'ConnectToRemoteMachine',
}
