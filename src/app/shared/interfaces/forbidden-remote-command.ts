/**
 * class ForbiddenRemoteCommand for manage type of commands and commandGroups
 */
import { CommandSetting } from './command-setting';

export interface ForbiddenRemoteCommand {
  /**
   * list of command
   */
  commands: string[];
  /**
   * forbidden command groups
   */
  commandGroups: CommandSetting[];
}
