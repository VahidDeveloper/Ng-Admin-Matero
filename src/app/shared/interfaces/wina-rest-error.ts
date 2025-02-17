import { WinaRestInnerError } from '../models/wina-rest-inner-error';

/**
 * wina-rest response's error
 */
export interface WinaRestError {
  /**
   * information associated with the error
   */
  error: WinaRestInnerError;
  /**
   * error parameters.
   */
  errorParams: any;
}
