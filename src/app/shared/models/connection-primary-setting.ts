import { checkEnumOptionValidity } from '@shared/utils';
import { ConnectionType } from '@shared/enums';
import { ConnectionImageType } from '@shared/types';

/**
 * main connection setting
 */
export class ConnectionPrimarySetting {
  constructor(protocol?: ConnectionType) {
    this.protocol = checkEnumOptionValidity(ConnectionType, protocol)
      ? protocol
      : ConnectionType.SSH;
  }

  /**
   * remote-machine connections protocol
   */
  protocol: ConnectionType | undefined;

  connectionName: string | undefined;
  /** connection image for web protocol **/
  connectionImage: ConnectionImageType | undefined;
  /**
   * keyboard key pressed log
   */
  enableKeyLog: boolean | undefined;
  /**
   * id of ip address used to connection to remote machine
   */
  ipAddressId: number | undefined;
  /**
   * the ip address used to connection to remote machine
   */
  ipAddress: string | undefined;
  /**
   * should the connection image be processed using ocr to extract text
   */
  ocrEnabled: boolean | undefined;
  /**
   * connections port
   */
  port: number | undefined;
  /**
   * whether to store connection's video or not (not for sshx connections)
   */
  videoRecordEnabled = true;
}
