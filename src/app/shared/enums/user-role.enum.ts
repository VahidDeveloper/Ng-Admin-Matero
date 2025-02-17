/**
 * the logged-in user's role.
 */
export enum UserRole {
  /**
   * it has whole accessibility
   */
  RemoteAdmin = 'REMOTE_ADMIN',
  /**
   * it is a regular user with low accessibility
   */
  RemoteUser = 'REMOTE_USER',
  /**
   * user with medium accessibility. admin of at least one group.
   */
  GroupAdmin = 'GROUP_ADMIN',
}
