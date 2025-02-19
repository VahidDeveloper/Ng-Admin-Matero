/**
 * the user's brief information.
 * For example when the user login into system, the user's information would be sent from server in this format.
 */
import { UserRole } from '@shared/enums';

export class UserBriefInfo {
  /**
   * username which is unique
   */
  username: string;
  /**
   * this name is shown on screen.
   */
  displayName: string | undefined;
  /**
   * the user's image which is used on top side of the system.
   */
  userImage: string | undefined;
  /**
   * user's role
   */
  role: UserRole;

  constructor(username: string, role: UserRole) {
    this.username = username;
    this.role = role;
  }
}
