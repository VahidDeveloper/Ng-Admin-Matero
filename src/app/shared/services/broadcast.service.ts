import { filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { BroadcastMessage } from '@shared/models';
import { runInZone } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class BroadcastService {
  private channels: Record<string, BroadcastChannel> = {};
  private onMessageSubject = new Subject<BroadcastMessage>();

  constructor(private ngZone: NgZone) {}

  /**
   * creates a channel with specified name if not exist
   */
  createChannel(channelName: string): void {
    if (!this.channels[channelName]) {
      this.channels[channelName] = new BroadcastChannel(channelName);
      this.channels[channelName].onmessage = receivedMessage =>
        this.onMessageSubject.next(receivedMessage.data);
    }
  }

  /**
   * to publish message to any channel;
   * if channel does not exist it will be created
   */
  publish(message: BroadcastMessage): void {
    this.createChannel(message.channelName);
    this.channels[message.channelName].postMessage(message);
  }

  /**
   * to subscribe to a channel
   * @param channel channel name
   * @param type type of messages
   */
  getMessageOfChannel(channel: string, type?: string): Observable<BroadcastMessage> {
    return this.onMessageSubject.pipe(
      runInZone<BroadcastMessage>(this.ngZone),
      filter(message => message.channelName === channel && (!type || message.messageType === type))
    );
  }
}
