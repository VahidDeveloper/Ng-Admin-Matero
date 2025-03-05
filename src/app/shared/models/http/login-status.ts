import { UserBriefInfo } from '@shared/models';

/**
 * the format of first-level login REST's output.
 */
export interface LoginStatus {
  /**
   * whether the user successfully logged into the system.
   */
  loggedIn: boolean;
  /**
   * it is used for http and web-socket requests.
   */
  csrfToken: string;
  /**
   * it is used for http and web-socket requests.
   */
  csrfHeader: string;
  /**
   * user's information who has just logged into system.
   */
  userInfo: UserBriefInfo;
}
