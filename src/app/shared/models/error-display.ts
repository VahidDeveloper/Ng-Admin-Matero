/**
 * used for showing error to user
 * it will be part of error handling state management
 */
export class ErrorDisplay<T = any> {
  /**
   * the error itself
   */
  errors: T[] | undefined;
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
