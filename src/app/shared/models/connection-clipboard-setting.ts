/**
 * connection clipboard setting
 */
export class ConnectionClipboardSetting {
  /**
   * if true user can copy text from remote machine to its local clipboard
   */
  copyFromRemote: boolean | undefined;
  /**
   * if true user can paste text from its local clipboard to remote machine
   */
  pasteToRemote: boolean | undefined;
  /**
   * forbidden patterns in regex
   */
  forbiddenClipboardPatterns: string[] | undefined;
  /**
   * log transferred clipboards
   */
  logClipboard: boolean | undefined;
  /**
   * if true clipboards which constant forbiddenClipboardPattens will be blocked
   */
  blockForbiddenClipboards: boolean | undefined;
}
