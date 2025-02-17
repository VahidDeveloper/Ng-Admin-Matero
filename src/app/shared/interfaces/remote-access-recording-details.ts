/**
 * remote-access recording details gotten from server.
 */
export interface RemoteAccessRecordingDetails {
  id: string;
  timestamp: number;
  rawVideoFile: string;
  rawVideoFileSize: number;
  textFile: string;
  textFileSize: number;
  type: string;
  videoFile: string;
  videoFileSize: number;
  timingFile: string;
}
