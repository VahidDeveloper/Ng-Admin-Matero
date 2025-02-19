/**
 * use this class to broadcast messages to all open tabs using broadcast channel
 * it has default value for channel name and message type
 */
export class BroadcastMessage<T = any> {
  channelName = 'wina-main-channel';
  messageType = 'main';
  message: T;

  constructor(message: T, messageType?: string, channelName?: string) {
    this.message = message;
    if (messageType) {
      this.messageType = messageType;
    }
    if (channelName) {
      this.channelName = channelName;
    }
  }
}
