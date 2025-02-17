import { TransferType } from '@shared/enums';

/**
 * connection setting file transfer setting
 */
export class FileTransferSetting {
  fileTransferEnabled: boolean | undefined;
  downloadPermission: boolean | undefined;
  uploadPermission: boolean | undefined;
  transferType: TransferType | undefined;
  /**
   * save a copy of transferred file on wina or not
   */
  saveFiles: boolean | undefined;
  /**
   * if the transfer type is sftp and the connection itself does not contains ssh connection information. it should be provided here
   */
  sftpExtraInfo: SftpConnectionInfo | undefined;
}

/**
 * it is used to set connection info for sftp file transfer
 */
export interface SftpConnectionInfo {
  username: string;
  password: string;
  sftpDirectory: string;
  sftpPort: number;
  sftpHostKey?: string;
  /**
   * if enabled, sftp key-hash would be ignored.
   * if disabled, when there is problem in key-hash, a prompt would be shown to user to decide whether to proceed or not
   */
  sftpIgnoreKeyHash?: boolean;
}
