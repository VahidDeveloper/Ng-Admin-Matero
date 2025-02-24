/**
 * used for showing error to user
 * it will be part of error handling state management
 */
class ErrorDisplay {
  /**
   * the error itself
   */
  errors: RestApiError[] | undefined;

  /**
   * mostly it is null. It is said that in rare cases, it might have some extra information.
   */
  object?: any;
  /**
   * mostly it is ERROR.
   * But when isWinaLogicalError is false, it may be '404' and something like this.
   */
  status: string | undefined;
  /**
   * when batch mode is active, probably  there will be more than one error.
   * but
   */
  isBatch = false;
  /**
   * location of error
   */
  location: string;
  /**
   * the time error occurred
   */
  time: number;

  constructor(location: string, time: number) {
    this.location = location;
    this.time = time;
  }
}

class RestApiError {
  /**
   * The encountered error. it has value when isWinaLogicalError is true.
   */
  error?: RestInnerError;
  /**
   * The encountered errorParams. it has value when isWinaLogicalError is true.
   */
  errorParams?: any;
}

class RestInnerError {
  /**
   * error code
   */
  code: number | undefined;
  /**
   * error description
   */
  description: string | undefined;
}

export { ErrorDisplay, RestApiError };
