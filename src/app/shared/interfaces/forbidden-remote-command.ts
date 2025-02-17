/**
 * class ForbiddenRemoteCommand for manage type of commands and commandGroups
 */
import { CommandSettingModel } from './command-setting';

export interface ForbiddenRemoteCommand {
  /**
   * list of command
   */
  commands: string[];
  /**
   * forbidden command groups
   */
  commandGroups: CommandSettingModel[];
}
