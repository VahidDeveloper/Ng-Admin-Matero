import { RestApiError } from './error-display';

export interface RestResponse<T = any> {
  /**
   * the error itself
   */
  errors: RestApiError[] | undefined;

  /**
   * mostly it is null. It is said that in rare cases, it might have some extra information.
   */
  object: T;
  /**
   * mostly it is ERROR.
   * But when isWinaLogicalError is false, it may be '404' and something like this.
   */
  status: string | undefined;
}
