import { WinaRestError } from './wina-rest-error';

/**
 * it is wina RESTS' response body.
 * Note that in batch-mode, it would be an array of this type.
 */
export interface WinaRestBody {
  /**
   * the actual response.
   * If there were no error, it would have contents. Otherwise, it would be null.
   * the format of object defers for each REST.
   */
  object: any;
  /**
   * it contains errors if exists. I there were no error, it would be null.
   */
  errors: WinaRestError[];
  /**
   * the response's status.
   */
  status: 'OK' | 'WARNING' | 'ERROR';
}
