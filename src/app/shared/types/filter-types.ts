/**
 * connection protocols type
 */
export type ProtocolType = 'rdp' | 'terminalService' | 'ssh' | 'vnc' | 'telnet';
/**
 * disconnection causes type
 */
export type DisconnectionCauseType =
  | 'stillRunning'
  | 'forbiddenCommand'
  | 'closedByAdmin'
  | 'closedByUser'
  | 'expiredAccess'
  | 'idleConnectionTimeout'
  | 'serverError'
  | 'upstreamTimeout'
  | 'resourceClosed'
  | 'sessionConflict'
  | 'unclear';
/**
 * connections types
 */
export type ConnectionMode = 'wina' | 'transparent';
/**
 * forbidden commands executions type
 */
export type ForbiddenCommandsExecutionType = 'exec' | 'notExec';
/**
 * connections status type
 */
export type ConnectionStatusType = 'success' | 'denied' | 'failed';
