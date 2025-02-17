import { OtpDestinationType } from '@shared/enums';

/**
 * otp destination model
 */

export interface OtpDestination {
  media: OtpDestinationType;
  address: string | null;
  otp?: string;
}
