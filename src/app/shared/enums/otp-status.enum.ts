/**
 * this enum is created to show otp status
 * for active or inActive otp in login
 */
export enum OtpStatus {
  /**
   * active otp for login
   */
  ACTIVE = 'ACTIVE',
  /**
   * inActive otp for login
   */
  INACTIVE = 'INACTIVE',
  /**
   * active otp for login by admin
   */
  MANDATORY = 'MANDATORY',
}
