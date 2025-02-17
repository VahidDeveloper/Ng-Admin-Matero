export enum ForbiddenCommandAction {
  /**
   * no action will be taken
   */
  None = 'none',
  /**
   * The command will be executed and will be logged
   */
  Log = 'log',
  /**
   * The command won't be executed and the connections will be terminated; also this will be logged
   */
  Terminate = 'terminate',
}
