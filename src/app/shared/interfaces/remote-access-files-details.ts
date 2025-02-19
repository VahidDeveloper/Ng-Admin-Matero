/**
 * remote-access-report uploaded or downloaded files gotten from server.
 */
export interface RemoteAccessFilesDetails {
  /**
   * the file's size
   */
  fileSize: string;
  /**
   * the file's name
   */
  filename: string;
  /**
   * the unique identifier for the file.
   */
  id: string;
  /**
   * file name which is saved.
   */
  savedFilename: string;
  /**
   * the time (epoch) when this file is uploaded/downloaded.
   */
  timestamp: number;
}
