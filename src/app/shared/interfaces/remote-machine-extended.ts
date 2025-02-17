/**
 * an extended remote machine information.
 */
import { RemoteMachine } from './remote-machine';

export interface RemoteMachineExtended extends RemoteMachine {
  /**
   * primary ip address extracted from ipAddresses field
   */
  primaryIpAddress: string;
  /**
   * concatenated which is extracted from categories field
   */
  concatenatedCategories: string;
}
