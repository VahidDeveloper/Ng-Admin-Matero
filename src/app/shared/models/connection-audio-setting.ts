/**
 * Audio Setting for remote connection
 */
export class ConnectionAudioSetting {
  /**
   * is using microphone possible in the connection
   */
  inputEnabled = false;
  /**
   * is Audio output enabled for the remote machine
   */
  outputEnabled = true;
  /**
   * where the audio should be heard.
   * if its client when the system plays a sound; then one who is connection through wina will here it
   * if its 'remote' the sound will be heard near the remote machine itself
   */
  outputLocation: 'client' | 'remote' = 'client';
}
