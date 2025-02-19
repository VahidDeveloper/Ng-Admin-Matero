import { ConnectionType } from '@shared/enums';
import { RemoteApplication } from '@shared/interfaces';
import { FileTransferSetting } from './file-transfer-setting';
import { ConnectionAudioSetting } from './connection-audio-setting';
import { ConnectionPrimarySetting } from './connection-primary-setting';
import { ConnectionDisplaySetting } from './connection-display-setting';
import { ConnectionPrinterSetting } from './connection-printer-setting';
import { ConnectionClipboardSetting } from './connection-clipboard-setting';
import { ConnectionAuthenticationSetting } from './connection-authentication-setting';
import { ConnectionForbiddenCommandsSetting } from './connection-forbidden-command-setting';

export class ConnectionSetting {
  /**
   * CONSTRUCTOR
   */
  constructor(hostId: number, protocol?: ConnectionType) {
    this.hostId = hostId;
    this.primarySetting = new ConnectionPrimarySetting(protocol);
    this.authentication = new ConnectionAuthenticationSetting();
    this.fileTransfer = new FileTransferSetting();
    this.forbiddenCommands = new ConnectionForbiddenCommandsSetting();
    this.clipboardSetting = new ConnectionClipboardSetting();
    this.displaySetting = new ConnectionDisplaySetting();
    this.audioSetting = new ConnectionAudioSetting();
    this.printerSetting = new ConnectionPrinterSetting();
  }

  /**
   * remote-machine connections id
   */
  id: number | undefined;
  /**
   * the connection belongs to which remote machine
   */
  hostId: number;
  /**
   * remote-machine connections primarySetting
   */
  primarySetting: ConnectionPrimarySetting;
  /**
   * remote-machine connections authentication
   */
  authentication: ConnectionAuthenticationSetting;
  /**
   * remote-machine connections fileTransfer
   */
  fileTransfer: FileTransferSetting;
  /**
   * remote-machine connections forbiddenCommands
   */
  forbiddenCommands: ConnectionForbiddenCommandsSetting;
  /**
   * remote-machine connections clipboardSetting
   */
  clipboardSetting: ConnectionClipboardSetting;
  /**
   * remote-machine connections displaySetting
   */
  displaySetting: ConnectionDisplaySetting;
  /**
   * remote-machine connections audioSetting
   */
  audioSetting: ConnectionAudioSetting;
  /**
   * remote-machine connections printerSetting
   */
  printerSetting: ConnectionPrinterSetting;
  /**
   * list of applications of terminal-service connection.
   */
  applications?: RemoteApplication[];
  /**
   * a flag which indicates whether the connection is the default or not
   */
  isDefault?: boolean;
  /**
   * this prop is created for bind name value from primarySetting to this
   * it use in selector to show name as displayProp and etc...
   */
  name?: string;
}
