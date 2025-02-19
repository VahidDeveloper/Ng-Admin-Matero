/**
 * remote access details format gotten from server.
 */
import { RemoteAccessConnectionDetails } from './remote-access-connection-details';
import { RemoteAccessFilesDetails } from './remote-access-files-details';
import { RemoteAccessRecordingDetails } from './remote-access-recording-details';
import { RemoteAccessInteractiveDetails } from './remote-access-interactive-details';

export interface RemoteAccessDetails {
  /**
   * the connection details
   */
  details: RemoteAccessConnectionDetails;
  /**
   * details of uploads during the connection
   */
  uploads: RemoteAccessFilesDetails[];
  /**
   * details of downloads during the connection
   */
  downloads: RemoteAccessFilesDetails[];
  /**
   * details of the connection's video
   */
  recording: RemoteAccessRecordingDetails;
  /**
   * details of interactive connection by other users.
   */
  interactiveDetails: RemoteAccessInteractiveDetails[];
}
