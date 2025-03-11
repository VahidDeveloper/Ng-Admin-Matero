/**
 * login constraint configuration
 */
export interface LoginConstraint {
  /**
   * it will show how many times after user entered password wrong the captcha should gets enabled for them.
   * it is counted per session
   */
  captchaSessionThreshold: number;
  /**
   * it will show how many times after user entered password wrong the captcha should gets enabled for them.
   * it is counted per IP address
   */
  captchaIpThreshold: number;
  /**
   * one of available options for sending otp
   */
  defaultOtpMedia: 'email' | 'sms';
  /**
   * The time which user will remain locked after too much invalid try
   */
  lockMinutes: number;
  /**
   * it will show how many times after user entered password wrong they will be locked temporarily from wina.
   */
  lockThreshold: number;
  /**
   * minimum password length for new user created in wina
   */
  minPassLength: number;
  /**
   * If user request to resend OTP code more than what specified here; he wil be sent back to first level of login
   */
  otpResendMax: number;
  /**
   * If user tries wrong OTP code more than what specified here; he wil be sent back to first level of login
   */
  otpRetryMax: number;
  /**
   * After this time, user should request new OTP
   */
  otpValidTimeSeconds: number;
  /**
   * If user tries to enter to system using invalid token more than what specified here; he wil be sent back to first level of login
   */
  tokenRetryMax: number;
}
