/**
 * connection forbidden command setting
 */
import { ForbiddenCommandAction } from '@shared/enums';

export class ConnectionForbiddenCommandsSetting {
  /**
   * what action should be done if forbidden command execution requested
   * none : do nothing
   * log: only log
   * terminate: close the connection
   */
  actionOnForbiddenCommandDetection: ForbiddenCommandAction = ForbiddenCommandAction.None;
  /**
   * forbidden commands
   */
  commands: string[] = [];
  /**
   * forbidden command groups
   */
  commandGroups: number[] = [];
  /**
   * if forbidden command execution requested send a notification to admin
   */
  notificationEnabled = false;
  /**
   * if actionOnForbiddenCommandDetection is on 'terminate' and this flag is true
   * the user's access to connection will be banned and after completing a workflow he will be un banned
   */
  forbiddenCommandWorkflowEnabled = false;
}
