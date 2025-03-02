/**
 * this class will provide all error messages from arrived from wina and http for us
 */

import { TranslateService } from '@ngx-translate/core';

export class RestApiErrorCodes {
  static otpTooMuchRequestErrorCode = 1914;
  static otpChangeMethodTooMuchRequestErrorCode = 1916;
  static tokenTooMuchRequestErrorCode = 1922;
  static captchaEnabledErrorCode = 1917;
  static captchaNotCorrectErrorCode = 1904;
  static mustLoginErrorCode = 401;
  static certificateErrorCode = 1008;
  static syslogOrMailServerNotAccessibleError = 408;
  /**
   * all needed error codes from http
   */
  private static readonly httpCodeMsgs = {
    0: `Network Connection Error`,
    400: 'Bad Request',
    [RestApiErrorCodes.mustLoginErrorCode]: `You should login to continued`,
    402: `The requested url not found: 404`,
    403: `You do not have permission to see this part`,
    404: `The requested url not found: 404`,
    405: `The request method not allowed`,
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: `I'm a teapot`,
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Unordered Collection',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    500: `Internal Server Error`,
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended',
    511: 'Network Authentication Required',
  };

  /**
   * all needed error codes from Wina
   */
  private static readonly winaCodeMsgs = {
    [RestApiErrorCodes.otpTooMuchRequestErrorCode]: `Too much unsuccessful requests for sending OTP`,
    [RestApiErrorCodes.otpChangeMethodTooMuchRequestErrorCode]: `Too much request for resending`,
    [RestApiErrorCodes.captchaEnabledErrorCode]: `Captcha enabled`,
    [RestApiErrorCodes.tokenTooMuchRequestErrorCode]: `Too much unsuccessful requests for sending token`,
    [RestApiErrorCodes.syslogOrMailServerNotAccessibleError]: `Selected server not accessible`,
    [RestApiErrorCodes.certificateErrorCode]: `SSL certificate is self signed`,
    [RestApiErrorCodes.captchaNotCorrectErrorCode]: `Captcha not correct!`,

    101: `A general unexpected Exception occurred, contact the support team`,
    102: `An illegal Argument inserted`,
    103: `An invalid number is detected in inputs`,
    106: `An invalid date is detected in inputs`,
    107: `An error occurred while pinging remote machine`,
    108: `The search query have some invalid input in it`,
    110: `Input parameter is invalid`,
    333: `License expired`,
    405: `Invalid HTTP request type`,
    406: `File format is not acceptable`,
    411: `SSL config update error`,
    412: `Invalid zip format`,
    413: `There is a problem with the PFX certificate file`,
    500: `Wina cannot connect to LDAP server`,
    501: `Can not perform LDAP operation`,
    502: `Could not access ldap attribute file, contact support team`,
    503: `Invalid LDAP configuration`,
    504: `Duplicate LDAP server`,
    505: `IP Address is not valid`,
    506: `Name of the ldap server is not valid`,
    507: `The specified user and password is not correct`,
    508: `The entered password format is not correct. Try to enter the one which has at least 3 of these 4: special characters, numbers, small or capital character. The passwords length should be at least 8 character.`,
    509: `Old password and new one cannot be the same`,
    510: `TLS must be enabled to change user password in active directory`,
    511: `Selected LDAP is not active-directory`,
    512: `Group not found in LDAP server`,
    513: `Duplicated LDAP Group`,
    514: `Selected user is not found in LDAP server`,
    515: `Can not assign LDAP group to user`,
    516: `Can not assign user to LDAP group`,
    517: `Can not change group type`,
    518: `Changing this group name is not possible`,
    519: `Changing LDAP server address is not possible`,
    700: `The specified username is duplicated, choose another one`,
    701: `User not found`,
    801: `Connection specified for the permission is not valid`,
    803: `Remote machine's ID is not valid`,
    808: `Group not found`,
    809: `Remote access not found`,
    810: `Remote group not found`,
    811: `Selected remote machine not found. It may be deleted by someone else as you were selecting it. Please refresh your list and try again`,
    813: `Related syslog server not found. contact support`,
    815: `Selected connection not found. refresh list and select again`,
    816: `Each remote machine can only have one primary IP address`,
    817: `The group name is duplicated. Please choose another name for this group`,
    818: `You should choose a name for this group`,
    819: `Saved video frame not found`,
    820: `The group name is duplicated. Please choose another name for this group`,
    821: `You should choose a name for this group`,
    822: `The selected IP address is not valid. Please refresh the page ang try again`,
    823: `Each remote machine should at least have one IP address`,
    824: `Temporary access definition not found`,
    825: `One of IP addresses should be selected as primary IP address`,
    826: `Error processing settings for deleting session files`,
    828: `The chosen partition for saving session files not found. Contact support`,
    829: `Selected Application in not found. Please refresh the list and try again`,
    830: `Choosing an image is necessary for this part`,
    831: `There is already a saved password with these attributes, If it is a different password you can set identifier Key for it and try again`,
    832: `In NLA mode username and password is required`,
    1000: `There is an uncompleted CSR request in system. You can either delete that one or complete it`,
    1001: `The CSR has been completed before`,
    1002: `The CSR does not exist`,
    1003: `Certificate's basicConstraints does not include ca flag`,
    1004: `The certificate not valid (must be in PAM format)`,
    1005: `There is already a CA with this name in wina. Choose another name`,
    1006: `The certified does not comply with existing CSR`,
    1007: `The certificate does not have the attribute associated with a web server (id-kp1).`,
    1009: `The certificate has been revoked`,
    1010: `The certificate is invalid`,
    1011: `The address does not exist in certificate`,
    1200: `Generating report file encountered a problem. Please try again`,
    1201: `The requested report not found`,
    1202: `Excel sheet name can not be empty`,
    1203: `Excel workbook name can not be empty`,
    1204: `An error occurred when trying to send excel file`,
    1205: `Generating excel file encountered a problem. Please try again`,
    1206: `Just excel file is accepted`,
    1207: `An error occurred while processing imported file`,
    1300: `There is already a command group with this name. choose another one`,
    1301: `Selected command group not found`,
    1601: `Error occurred while sending email. check your configuration`,
    1602: `The connection security mechanism is invalid`,
    1603: `Username or password or authentication mechanism is not valid`,
    1604: `Server port is invalid`,
    1605: `Server address is invalid`,
    1606: `Got no response from mail server.(timeout)`,
    1700: `Error in sending SMS occurred`,
    1800: `Error occurred in getting OTP`,
    1900: `Token is not found for the specified user`,
    1901: `User is locked`,
    1902: `User is unlocked`,
    1903: `The user is inactivated due to lots of attempts`,
    1905: `The username or password is not correct`,
    1906: `Token information is invalid`,
    1907: `Token does not belong to this user`,
    1908: `Error in checking token`,
    1909: `Token certificated is invalid`,
    1910: `Token serial is invalid`,
    1911: `First level login is not done yet`,
    1912: `OTP code is invalid`,
    1913: `Error in sending OTP code`,
    1915: `User has already logged in`,
    1918: `OTP is forced by admin`,
    1919: `OTP has already been enabled`,
    1920: `OTP has been disabled`,
    1921: `OTP media is invalid`,
    2100: `Agent not found`,
    2101: `Got no response form agent.(timout)`,
    2102: `There was a problem in connection between wina and agent`,
    2103: `Unable to connect to transparent service`,
    2104: `This Remote Machine already has a agent`,
    2400: `Max upload count exceeded`,
    2401: `Selected version not found`,
    2402: `This file has been uploaded before`,
    2403: `Processing file encountered error. Are you sure the file is not corrupted?`,
    2404: `There is a problem in file encryption. contact support team`,
    2405: `The uploaded file is not valid`,
    2600: `Invalid license`,
    2601: `The license has expired`,
    2602: `The defined number of connections has exceeded the allowable limit`,
    2603: `Not found any license for user`,
    2604: `An error has occurred when reading license`,
  };

  /**
   * default message when we didn't found proper message
   */
  private static readonly defaultErrorMsg = `An Error Has Occurred`;

  constructor() {
    Object.freeze(RestApiErrorCodes.httpCodeMsgs);
    Object.freeze(RestApiErrorCodes.winaCodeMsgs);
  }

  /**
   * this method will return proper error based on error code from httpCodeMsgs
   */
  static getHttpMsgByCode(code: number, _translatorService: TranslateService): string {
    const error = RestApiErrorCodes.httpCodeMsgs[code];
    return error
      ? _translatorService.instant(error)
        ? _translatorService.instant(error)
        : RestApiErrorCodes.httpCodeMsgs[code]
      : _translatorService.instant(RestApiErrorCodes.defaultErrorMsg);
  }

  /**
   * this method will return proper error based on error code from winaCodeMsgs
   */
  static getWinaMsgByCode(code: number, _translatorService: TranslateService): string {
    const error = RestApiErrorCodes.httpCodeMsgs[code];
    return error
      ? _translatorService.instant(error)
        ? _translatorService.instant(error)
        : RestApiErrorCodes.winaCodeMsgs[code]
      : _translatorService.instant(RestApiErrorCodes.defaultErrorMsg);
  }
}
