import { RemoteMachine, RemoteMachineExtended } from '@shared/interfaces';
import { ConnectionSetting } from './connection-setting';

/**
 * in connectToRemoteMachine's event, such information would be sent
 */
export class ConnectToRemoteMachinePayload {
  /** remote machine's information */
  remoteMachine: RemoteMachineExtended | undefined;
  /** sometimes, connection's id is clear. sometimes it is not clear, which means the user should select a connection */
  connectionId?: string;
  /** if true, remote-machine and connection's info is specified in url. in this case, the opened connection would be shown in full-screen */
  providedInUrl?: boolean;
}

/**
 * in connectToConnection's event, such information would be sent
 */
export class ConnectToConnectionPayload {
  /** remote-machine's information */
  remoteMachine: RemoteMachine | undefined;
  /** remote-connection's information */
  remoteConnection: ConnectionSetting | undefined;
  /** if true, remote-machine and connection's info is specified in url. in this case, the opened connection would be shown in full-screen */
  providedInUrl?: boolean;
}
