/**
 * All REST urls should be put here and all services should use this class to get their desired REST url.
 */

export class WinaRestUrls {
  static readonly restBaseUrl = '/rest/';
  static readonly restNewBaseUrl = '/api/v1/';

  /** new URL to authenticate the user */
  static jwtAuthenticateURL(): string {
    return this.restNewBaseUrl + 'auth/login';
  }

  /** url to reset jwt token */
  static resetJwtTokenURL(): string {
    return this.restNewBaseUrl + 'auth/refresh';
  }

  /** it would destroy jwt-token so it would no longer authorize the user to access the resources */
  static destroyJwtTokenURL(): string {
    return this.restNewBaseUrl + 'auth/logout';
  }

  /**
   * REST url used in login to check validity of username and password.
   */
  static get firstLevelLoginURL(): string {
    return this.restBaseUrl + 'login/wina/validate';
  }

  /**
   * REST url used in login to get captcha image.
   */
  static get loginCaptchaURL(): string {
    return this.restBaseUrl + 'login/captcha/load';
  }

  /**
   * REST url used in login to regenerate otp code and send it to user.
   */
  static get loginOtpGenerateURL(): string {
    return this.restBaseUrl + 'login/otp/generate';
  }

  /**
   * REST url used in login to check otp-validity.
   */
  static get loginOtpValidateURL(): string {
    return this.restBaseUrl + 'login/otp/validate';
  }

  /**
   * REST url which returns user's login state, for example, wheter the user is logged or not.
   */
  static get loginStateURL(): string {
    return this.restBaseUrl + 'login/wina/state';
  }

  /**
   * REST url used in login to check token.
   */
  static get checkTokenURL(): string {
    return this.restBaseUrl + 'login/token/validate';
  }

  /**
   * REST url which log the user out of the system.
   */
  static logoutURL(): string {
    return this.restBaseUrl + 'auth/logout';
  }

  /**
   * change user role api
   */
  static changeRole(isAdmin: boolean): string {
    if (isAdmin) {
      return this.restBaseUrl + 'remote/roles/admins/remove';
    }
    return this.restBaseUrl + 'remote/roles/admins/add';
  }

  /**
   * enable OTP
   */
  static enableOTP(): string {
    return this.restBaseUrl + 'login/otp/enable/admin';
  }

  /**
   * disable OTP
   */
  static disableOTP(): string {
    return this.restBaseUrl + 'login/otp/disable/admin';
  }

  /**
   * lock user Rest api
   */
  static lockUser(): string {
    return this.restBaseUrl + 'lockout/lock';
  }

  /**
   * unlock user
   */
  static unlockUser(): string {
    return this.restBaseUrl + 'lockout/unlock';
  }

  /**
   * get specific user information
   */
  static getSingleUserInfo(): string {
    return this.restBaseUrl + 'remote/permissions/user';
  }

  /**
   * URL related to personal vault's list.
   */
  static personalVaultURL(): string {
    return this.restNewBaseUrl + 'vaults/user';
  }

  /**
   * URL related to connection vault list.
   */
  static connectionVaultURL(): string {
    return this.restNewBaseUrl + 'vaults/wina';
  }

  /**
   * rest for getting users list
   */
  static usersListURL(ldapServerName: string): string {
    const convertedServerName = window
      .btoa(ldapServerName)
      .replace(/\//g, '-')
      .replace(/\+/g, '_')
      .replace(/=/g, '~');
    return this.restBaseUrl + 'remote/permissions/users/' + convertedServerName;
  }

  /**
   * URL related to getting list of remotes forbidden commands.
   */
  static getRemotesForbiddenCommandsURL(): string {
    return this.restBaseUrl + 'remote/forbidden/commands/get';
  }

  /**
   * URL related to editing remote forbidden commands.
   */
  static editRemotesForbiddenCommandsURL(): string {
    return this.restBaseUrl + 'remote/forbidden/commands/put';
  }

  /**
   * URL related to getting list of remotes clipboard patterns.
   */
  static getRemotesClipboardPatternsURL(): string {
    return this.restBaseUrl + 'clipboard/patterns/get';
  }

  /**
   * URL related to editing remote clipboard patterns.
   */
  static editRemotesClipboardPatternsURL(): string {
    return this.restBaseUrl + 'clipboard/patterns/put';
  }

  /**
   * REST url which returns users' activities list
   */
  static get userActivitiesURL(): string {
    return this.restBaseUrl + 'reports/admin/detailed/timeline/list';
  }

  /**
   * REST url which returns session-search results.
   */
  static get commandSearchResultsURL(): string {
    return this.restBaseUrl + 'remote/reports/tunnel/text/search';
  }

  /**
   * REST url which returns online-users
   */
  static get onlineUsersURL(): string {
    return this.restBaseUrl + 'reports/admin/detailed/authentication/users/actives';
  }

  /**
   * REST url which returns brief information about users
   */
  static usersListBrief(): string {
    return this.restBaseUrl + 'remote/permissions/users/brief';
  }

  /**
   * REST url which returns a single remote machine information
   */
  static remoteMachineURL(remoteMachineId: number): string {
    return this.restBaseUrl + `remote/hosts/${remoteMachineId}`;
  }

  /**
   * REST url which returns multiple remote machines information
   */
  static remoteMachinesURL(): string {
    return this.restBaseUrl + 'remote/hosts/search/advanced';
  }

  /**
   * REST url which returns list of ldap servers
   */
  static ldapServerList(): string {
    return this.restBaseUrl + 'ldap/servers/list';
  }

  /**
   * REST url which returns remote-accesses
   */
  static get remoteAccessUrl(): string {
    return this.restBaseUrl + 'reports/admin/detailed/remote/timeline/list';
  }

  /**
   * REST url which returns remote-accesses
   */
  static get remoteAccessDetailsUrl(): string {
    return this.restBaseUrl + 'remote/reports/tunnel/details';
  }

  /**
   * URL related to wina-login constraint.
   */
  static winaLoginConstraint(): string {
    return this.restBaseUrl + 'account/security/load';
  }

  /**
   * save login constraint
   */
  static winaSaveLoginConstraint(): string {
    return this.restNewBaseUrl + 'account-security';
  }

  /**
   * url to get generated file from server.
   * the file's id should be appended beside this url to download the target file.
   */
  static get getFileUrl(): string {
    return this.restBaseUrl + 'remote/filemanager/getfile';
  }

  /**
   * Rest url for get file transfer report data
   */
  static get fileTransferReport(): string {
    return this.restBaseUrl + 'remote/reports/tunnel/filetransfer/list';
  }

  /**
   * user login report service
   */
  static get userLoginReportService(): string {
    return this.restBaseUrl + 'reports/admin/detailed/authentication/list';
  }

  /**
   * export timeline-report to excel url
   */
  static get exportRemoteAccessReportURL(): string {
    return this.restBaseUrl + 'reports/export/remote-timeline';
  }

  /**
   * export timeline-report to excel url
   */
  static get exportLoginToSystemReportURL(): string {
    return this.restBaseUrl + 'reports/export/authentication';
  }

  /**
   * export timeline-report to excel url
   */
  static get exportTransferredFilesReportURL(): string {
    return this.restBaseUrl + 'reports/export/file-transfer';
  }

  /**
   * remove list of remotes url
   */
  static removeRemotesURL(): string {
    return this.restBaseUrl + 'remote/hosts/delete';
  }

  /**
   * url to download tunnel's keylog report.
   */
  static keyLogReportURL(): string {
    return this.restBaseUrl + 'remote/reports/tunnel/keylog';
  }

  /**
   * get all connections of a remote machine but service will use one of it until a special rest created for it
   */
  static getSingleConnectionInfoURL(remoteMachineId: number): string {
    return this.restBaseUrl + 'remote/hosts/' + remoteMachineId;
  }

  /**
   * used to delete a connection of a remote machine
   */
  static connectionDeleteURL(): string {
    return this.restNewBaseUrl + 'connections';
  }

  /**
   * base of image
   */
  static imageBaseURL(): string {
    return this.restBaseUrl + 'pictures/get';
  }

  /**
   * url to get time to elimination the session
   */
  static eliminationSession(): string {
    return this.restBaseUrl + 'remote/session/file/elimination/config/get';
  }

  /**
   * url to put elimination the session
   */
  static putEliminationSession(): string {
    return this.restBaseUrl + 'remote/session/file/elimination/config/put';
  }

  /**
   * url to get the specified file
   */
  static getTargetFileURL(fileId: string): string {
    return this.getFileUrl + '/' + fileId;
  }

  /**
   * url to get nearest absolute frame by time
   */
  static getAbsoluteFrameByTimeURL(): string {
    return this.restBaseUrl + 'remote/video/frames/get/bytime';
  }

  /**
   * url to save absolute frames
   */
  static saveAbsoluteFrameURL(): string {
    return this.restBaseUrl + 'remote/video/frames/save';
  }

  /**
   * url to save absolute frames
   */
  static getAllSavedVideoFramesInfoURL(tunnelUuid: string): string {
    return this.restBaseUrl + 'remote/video/frames/list' + '/' + tunnelUuid;
  }

  /** rest for downloading remotes file system. */
  static connectionDownloadFileURL(
    tunnel: any,
    streamIndex: string,
    filename: string,
    token: string
  ): string {
    return (
      this.restBaseUrl +
      'remote/filemanager/tunnels/' +
      tunnel +
      '/streams/' +
      streamIndex +
      '/' +
      filename +
      '?token=' +
      token
    );
  }

  /**
   * url to user's public key for encryption.
   */
  static userPublicKeyURL(): string {
    return this.restBaseUrl + 'encryption/key/public';
  }

  /** it get syslog servers list" */
  static getSyslogServers(): string {
    return this.restBaseUrl + 'remote/syslog/servers/list';
  }

  /** it delete syslog server with id */
  static deleteSyslogServers(): string {
    return this.restBaseUrl + 'remote/syslog/servers/delete';
  }

  /** it update syslog server with id */
  static updateSyslogServers(): string {
    return this.restBaseUrl + 'remote/syslog/servers/put';
  }

  /** it test syslog server address */
  static testSyslogServers(): string {
    return this.restBaseUrl + 'remote/syslog/servers/check';
  }

  /** it get syslog server categories list */
  static getSyslogCategories(): string {
    return this.restBaseUrl + 'remote/syslog/servers/categories/list';
  }

  /**
   * REST url which returns session-search results with tunnel id.
   */
  static SessionSearchResultsURL(): string {
    return this.restBaseUrl + 'remote/reports/tunnel/text/search/single';
  }

  /**
   * REST url which returns otp email config url.
   */
  static getEmailConfig(): string {
    return this.restBaseUrl + 'remote/otp/mail/config/get';
  }

  /**
   * REST url which returns update otp email config url.
   */
  static updateEmailConfig(): string {
    return this.restBaseUrl + 'remote/otp/mail/config/set';
  }

  /**
   * REST url which returns test otp email address url.
   */
  static testEmailAddress(): string {
    return this.restBaseUrl + 'remote/otp/mail/test';
  }

  /**
   * it would ping an ip.
   */
  static pingURL(): string {
    return this.restBaseUrl + 'monitoring/icmp/ping';
  }

  /**
   * it would get user-preference information.
   */
  static getUserPreferencesURL(): string {
    return this.restBaseUrl + 'ldap/users/preferences/load';
  }

  /**
   * it would set user-preference.
   */
  static setUserPreferencesURL(): string {
    return this.restBaseUrl + 'ldap/users/preferences/save';
  }

  /**
   * rest url to check port connection base on connectionId
   */
  static checkPortConnection(connectionId: number): string {
    return this.restBaseUrl + `monitoring/port/check/${connectionId}`;
  }

  /**
   * rest url list of commands
   */
  static getCommands(): string {
    return this.restBaseUrl + `command/templates/all`;
  }

  /**
   * rest url for delete command
   */
  static deleteCommand(): string {
    return this.restBaseUrl + `command/templates/delete`;
  }

  /**
   * rest url for add or edit command
   */
  static addOrEditCommand(): string {
    return this.restBaseUrl + `command/templates/put`;
  }

  /**
   * get list of user for otp request
   */
  static getUserListOtpRequest(hostId: number): string {
    return this.restBaseUrl + `remote/otp/user/list/${hostId}`;
  }

  /**
   * set otp request
   */
  static setOtpRequest(): string {
    return this.restBaseUrl + `remote/otp/set`;
  }

  /**
   * rest url for say server an user has active connection
   */
  static timeCurrent(): string {
    return this.restBaseUrl + `time/current`;
  }

  /** it get ldap servers list" */
  static getLdapServers(): string {
    return this.restBaseUrl + 'ldap/servers/config/list';
  }

  /** it delete ldap server with id */
  static deleteLdapServers(): string {
    return this.restBaseUrl + 'ldap/servers/config/delete';
  }

  /** it update ldap server with id */
  static updateLdapServers(): string {
    return this.restBaseUrl + 'ldap/servers/config/put';
  }

  /** it test ldap server address */
  static testLdapServers(): string {
    return this.restBaseUrl + 'ldap/servers/connection/check';
  }

  /** it test sms */
  static testSms(): string {
    return this.restBaseUrl + 'remote/otp/sms/test';
  }

  /** it get application license information url */
  static getAppLicenseInfo(): string {
    return this.restBaseUrl + 'license';
  }

  /** it set new license url */
  static setAppLicense(): string {
    return this.restBaseUrl + 'license/register';
  }

  /**
   * it will get remote connections list
   */
  static getConnectionsLog(): string {
    return this.restBaseUrl + 'reports/console/login/list';
  }

  /** get all CA certificate of remote machines */
  static getCaCertificateList(): string {
    return this.restBaseUrl + 'config/ssl/ca/list';
  }

  /** add CA certificate */
  static addCaCertificate(): string {
    return this.restBaseUrl + 'config/ssl/ca/add';
  }

  /** delete CA certificate */
  static deleteCaCertificate(): string {
    return this.restBaseUrl + 'config/ssl/ca/delete';
  }

  /**
   * it will get default ssl policy
   */
  static getDefaultSSlPolicy(): string {
    return this.restBaseUrl + 'config/ssl/policy/get';
  }

  /**
   * it will add new ssl policy
   */
  static addSSlPolicy(): string {
    return this.restBaseUrl + 'config/ssl/policy/put';
  }

  /** get all wina versions url */
  static WinaVersions(): string {
    return this.restBaseUrl + 'wina/versions/list';
  }

  /** get all wina versions url */
  static RegisterWinaVersion(): string {
    return this.restBaseUrl + 'wina/versions/upload';
  }

  /** deploy wina versions url */
  static deployWinaVersion(): string {
    return this.restBaseUrl + 'wina/versions/deploy';
  }

  /** delete wina versions url */
  static deleteWinaVersion(): string {
    return this.restBaseUrl + 'wina/versions/delete';
  }

  /**
   * it will get CSR Certificate
   */
  static getCSRCertificate(): string {
    return this.restBaseUrl + 'config/ssl/csr/get';
  }

  /**
   * it will add new CSR Certificate
   */
  static addCSRCertificate(): string {
    return this.restBaseUrl + 'config/ssl/csr/generate';
  }

  /**
   * it will delete CSR Certificate
   */
  static deleteCSRCertificate(): string {
    return this.restBaseUrl + 'config/ssl/csr/delete';
  }

  /**
   * it will completed CSR certificate
   */
  static completeCSRCertificate(): string {
    return this.restBaseUrl + 'config/ssl/csr/complete';
  }

  /**
   * it will add new PFX Certificate
   */
  static addPFXCertificate(): string {
    return this.restBaseUrl + 'config/ssl/put';
  }

  /**
   * it get all wina Audit log
   */
  static getAuditDetails(): string {
    return this.restBaseUrl + 'reports/admin/detailed/audit';
  }

  /**
   * it get all Audit Categories
   */
  static getAuditCategories(): string {
    return this.restBaseUrl + 'reports/admin/detailed/audit/categories';
  }

  /**
   * it will get current user info
   */
  static getUser(): string {
    return this.restBaseUrl + 'ldap/users/info/current';
  }

  /**
   * it get session timeout policy url
   */
  static getSessionTimeoutPolicy(): string {
    return this.restBaseUrl + 'session/config/get';
  }

  /**
   * it set session timeout policy url
   */
  static updateSessionTimeoutPolicy(): string {
    return this.restBaseUrl + 'session/config/put';
  }

  /**
   * REST url which returns users temporary access list
   */
  static getTemporaryAccessList(): string {
    return this.restBaseUrl + 'remote/permissions/temporary/list';
  }

  /**
   * REST url which returns users temporary access list
   */
  static updateTemporaryAccess(): string {
    return this.restBaseUrl + 'remote/permissions/temporary/update';
  }

  /**
   * REST url which returns users temporary access list
   */
  static deleteTemporaryAccess(): string {
    return this.restBaseUrl + 'remote/permissions/temporary/delete';
  }

  /** url to banner-display config */
  static bannerDisplayConfig(): string {
    return this.restNewBaseUrl + `banner`;
  }

  /** url to get login-warning message in for user login page */
  static getLoginWarning(): string {
    return this.restNewBaseUrl + `banner/login-warning`;
  }

  /** url to set user token */
  static setUserToken(): string {
    return this.restBaseUrl + `wina/users/token/put`;
  }

  /** url to delete user token */
  static deleteUserToken(): string {
    return this.restBaseUrl + `wina/users/token/delete`;
  }

  /** url to reset user password */
  static resetUserPassword(): string {
    return this.restNewBaseUrl + `local-users/reset-password`;
  }

  /** url to reset current-user password */
  static resetCurrentUserPassword(): string {
    return this.restBaseUrl + `ldap/users/password/change`;
  }

  /**
   * it will get user remote machines
   */
  static getUserRemoteMachines(): string {
    return this.restBaseUrl + `remote/hosts/list`;
  }

  /**
   * it will get all groups that user can join them
   */
  static getPermissionGroups(): string {
    return this.restBaseUrl + `remote/permissions/groups/wina`;
  }

  /**
   * it will get all groups that user is join them
   */
  static getUserPermissionGroups(): string {
    return this.restBaseUrl + `remote/permissions/groups/list`;
  }

  /**
   * it will assign user to Groups
   */
  static assignUserToGroups(): string {
    return this.restBaseUrl + `remote/permissions/groups/assign/groups`;
  }

  /**
   * enable Otp by user
   */
  static enableUserOTP(): string {
    return this.restBaseUrl + 'login/otp/enable';
  }

  /**
   * disable OTP by user
   */
  static disableUserOTP(): string {
    return this.restBaseUrl + 'login/otp/disable';
  }

  /**
   * it will get all users roles
   */
  static getUsersRoles(): string {
    return this.restBaseUrl + `remote/permissions/roles/list`;
  }

  /**
   * it will get all user group
   */
  static getUserGroup(): string {
    return this.restBaseUrl + `remote/permissions/groups/list/all`;
  }

  /**
   * it will get delete user group
   */
  static deleteUserGroup(): string {
    return this.restBaseUrl + `remote/permissions/groups/delete`;
  }

  /**
   * it will get list of ldap
   */
  static getLdapServerList(): string {
    return this.restBaseUrl + `ldap/servers/list`;
  }

  /**
   * it will get list of ldap group
   */
  static getLdapGroupList(): string {
    return this.restBaseUrl + `ldap/groups/list`;
  }

  /**
   * it will get add new user group
   */
  static addUserGroup() {
    return this.restBaseUrl + `remote/permissions/groups/add`;
  }

  /**
   * it will get add new permission
   */
  static addPermission() {
    return this.restBaseUrl + `remote/permissions/roles/add`;
  }

  /**
   * it will assign a user group to new permission
   */
  static addUserGroupToPermission() {
    return this.restBaseUrl + `remote/permissions/roles/replace/role/groups`;
  }

  /**
   * it will get all users in a group
   */
  static getUsersInGroup(id: number) {
    return this.restBaseUrl + `remote/permissions/groups/users/${id}`;
  }

  /**
   * it will get all users in a group
   */
  static getUsersByLdapName(ldapName: string) {
    return this.restBaseUrl + `remote/permissions/users/${ldapName}`;
  }

  /**
   * it will assign users to a group
   */
  static assignUserToGroup() {
    return this.restBaseUrl + `remote/permissions/groups/assign/users`;
  }

  /**
   * it will get a permission of user Group
   */
  static getUserGroupPermission(groupId: number) {
    return this.restBaseUrl + `remote/permissions/roles/list/group/${groupId}`;
  }

  /**
   * it will assign connections to role permission
   */
  static addConnectionsPermission() {
    return this.restBaseUrl + `remote/permissions/roles/add/role/connections`;
  }

  /**
   * it will assign group of remote machines to role permission
   */
  static addRemoteMachineGroupPermission() {
    return this.restBaseUrl + `remote/permissions/roles/add/role/advance/connections/search`;
  }

  /**
   * it will get remove connections from role permission
   */
  static removeConnectionPermission() {
    return this.restBaseUrl + `remote/permissions/roles/remove/role/connections`;
  }

  /**
   * it will handle local users rest api
   */
  static localUsers() {
    return this.restNewBaseUrl + `local-users`;
  }

  /**
   * it will handle monitoring rest api
   */
  static monitoring() {
    return this.restNewBaseUrl + `monitoring-apis`;
  }

  /**
   * it will handle monitoring token rest api
   */
  static monitoringToken() {
    return this.restNewBaseUrl + `monitoring-token`;
  }

  /**
   * it will handle monitoring refresh token rest api
   */
  static monitoringRefreshToken() {
    return this.restNewBaseUrl + `monitoring-token/regenerate`;
  }

  /**
   * it will handle remoteMachine rest api
   */
  static remoteMachine(): string {
    return this.restNewBaseUrl + 'hosts';
  }

  /**
   * rest url to check port connection base on connectionId
   */
  static addDefaultConnection(): string {
    return this.restNewBaseUrl + `hosts/assign-default-connection`;
  }

  /**
   * it will handle remoteMachine category rest api
   */
  static remoteMachineCategories(): string {
    return this.restNewBaseUrl + 'categories';
  }

  /**
   * url to add remote-machines to remote-category
   */
  static remoteMachineCategory(): string {
    return this.restNewBaseUrl + 'categories/edit-hosts';
  }

  /**
   * it will handle connection certificate rest api
   */
  static connectionCertificate(): string {
    return this.restNewBaseUrl + 'host-cert';
  }

  /**
   * it will handle connection hashKey rest api
   */
  static connectionHashKey(): string {
    return this.restNewBaseUrl + 'host-key';
  }

  /**
   * it will handle remote machine agent rest api
   */
  static remoteMachineAgent(): string {
    return this.restNewBaseUrl + 'agent';
  }

  /**
   * it will handle remote machine agent register rest api
   */
  static remoteMachineAgentRegister(): string {
    return this.restNewBaseUrl + 'agent/register';
  }

  /**
   * it will handle active connection rest api
   */
  static activeConnection() {
    return this.restNewBaseUrl + `connections/active`;
  }

  /**
   * it will handle close connection rest api
   */
  static closeConnection() {
    return this.restNewBaseUrl + `connections/close`;
  }

  /**
   * it will handle connection application rest api
   */
  static connectionApplications() {
    return this.restNewBaseUrl + `connections/applications`;
  }

  /**
   * it will handle lock connection rest api
   */
  static connectionLock() {
    return this.restNewBaseUrl + `connection-lockout`;
  }

  /**
   * it will handle unLock connection rest api
   */
  static unLockConnection(): string {
    return this.restNewBaseUrl + `connection-lockout/unlock`;
  }

  /**
   * it will handle connection lock policy rest api
   */
  static connectionLockPolicy(): string {
    return this.restNewBaseUrl + `connection-lockout/policy`;
  }

  /**
   * it will handle remote machine agent unregister rest api
   */
  static remoteMachineAgentUnregister(): string {
    return this.restNewBaseUrl + 'agent/unregister';
  }

  /**
   * user feedback api url
   */
  static feedback() {
    return this.restNewBaseUrl + `feedback`;
  }

  /**
   * it will handle connection rest api
   */
  static connection() {
    return this.restNewBaseUrl + `connections`;
  }

  static getEncoderConfig() {
    return this.restNewBaseUrl + `encoder-config`;
  }

  static setEncoderConfig() {
    return this.restNewBaseUrl + `encoder-config`;
  }

  /** url to vaults config */
  static vaultsConfig(): string {
    return this.restNewBaseUrl + `vaults`;
  }

  /** url to saved-credentials vault config */
  static savedCredentialsVaultsConfig(): string {
    return this.restNewBaseUrl + `saved-credentials`;
  }
}
