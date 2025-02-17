/**
 * this class would be used to make difference between Wina and http errors
 */
import { RestApiErrorCodes } from './rest-api-error-codes';
import { WinaRestInnerError } from './wina-rest-inner-error';
import { WinaRestError } from '../interfaces/wina-rest-error';
import { TranslateService } from '@ngx-translate/core';

export class WinaRestApiError extends Error {
  /**
   * if it was error from Wina this flag will be true
   */
  isWinaLogicalError: boolean;
  /**
   * The encountered error. it has value when isWinaLogicalError is true.
   */
  error?: WinaRestInnerError;
  /**
   * The encountered errorParams. it has value when isWinaLogicalError is true.
   */
  errorParams?: string;
  /**
   * mostly it is null. It is said that in rare cases, it might have some extra information.
   */
  object?: any;
  /**
   * mostly it is ERROR.
   * But when isWinaLogicalError is false, it may be '404' and something like this.
   */
  status: string;
  /**
   * the location which error occured. usually url + method
   */
  location?: string;

  constructor(
    isWinaLogicalError: boolean,
    status: string,
    errorObj: WinaRestError,
    object: any,
    _translatorService: TranslateService,
    location?: string
  ) {
    super('Error: ' + (isWinaLogicalError ? errorObj.error.code : parseInt(status, 10)));
    const code = isWinaLogicalError ? errorObj.error.code : parseInt(status, 10);
    this.isWinaLogicalError = isWinaLogicalError;
    this.status = isFinite(Number(status)) ? status : '0';
    this.error = errorObj?.error ?? new WinaRestInnerError();
    if (this.error?.code) {
      this.error.description = RestApiErrorCodes.getWinaMsgByCode(
        isFinite(code ?? NaN) ? code! : 0,
        _translatorService
      );
    } else {
      this.error.description = RestApiErrorCodes.getHttpMsgByCode(
        parseInt(this.status, 10),
        _translatorService
      );
    }
    this.errorParams = errorObj?.errorParams;
    this.object = object;
    this.location = location;
  }
}
