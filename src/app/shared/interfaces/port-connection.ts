/**
 * check port connection model
 */
import { PortConnectionStatus } from '@shared/enums';

export interface PortConnection {
  portState: PortConnectionStatus;
  connectTimeMillis?: number;
}
