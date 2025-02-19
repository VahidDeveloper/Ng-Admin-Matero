/**
 * to set otp request on remote machine
 */
import { OtpDestination } from './otp-destination';

export interface SetOtp {
  /**
   * destinations of otp type key value
   */
  destination: OtpDestination;
  /**
   * remote machine id
   */
  hostId: number;
  /**
   * password field
   */
  password: string;
  /**
   * userName field
   */
  username: string;
}
