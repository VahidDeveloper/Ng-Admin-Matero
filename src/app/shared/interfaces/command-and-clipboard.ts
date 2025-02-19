/**
 * used for inherited policies from parent objects
 * in this view every connection is child of a remote machine and every remote machine may be child of a remote machine group
 */
export interface Inherited {
  /**
   * id of parent which the policy is inherited from
   */
  id: number;
  /**
   * which parent remote machine (host) or group
   */
  inheritedFrom: 'host' | 'group';
  /**
   * name of parent which the policy is inherited from
   */
  name: string;
}

/**
 * command which is inherited
 */
export interface InheritedCommand extends Inherited {
  commandId: number;
  command: string;
}

/**
 * saved command groups which is inherited
 */
export interface InheritedCommandGroup extends Inherited {
  group: string;
}

/**
 * clipboard pattern which is inherited
 */
export interface InheritedClipboardPattern extends Inherited {
  clipboardId: number;
  pattern: string;
}
