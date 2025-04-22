/**
 * it is an entity of user
 */
import { OtpStatus } from '@shared/enums';

export interface UserEntity {
  /**
   * users dn
   */
  dn: string;
  /**
   * users username
   */
  username: string;
  /**
   * users password
   */
  password: string;

  repeatPassword: string;
  /**
   * users first name
   */
  firstName: string;

  /**
   * users last name
   */
  lastName: string;
  /**
   * users employee id
   */
  employeeId: number;
  /**
   * users display name
   */
  displayName: string;
  /**
   * users email address
   */
  email: string;
  /**
   * users telephone number
   */
  telephone: string;
  /**
   * users mobile number
   */
  mobile: string;
  /**
   * users home phone number
   */
  homePhone: string;
  /**
   * users fax number
   */
  fax: string;
  /**
   * users pager number
   */
  pager: string;
  /*
   * users home address
   */
  homeAddress: string;
  /**
   * users state name
   */
  state: string;

  /**
   * users city name
   */
  city: string;
  /**
   * users country name
   */
  country: string;
  /**
   * users office address
   */
  officeAddress: string;
  /**
   * users zip code
   */
  zipCode: string;
  /**
   * users post box address
   */
  postbox: string;
  /**
   * users web address
   */
  webAddress: string;
  /**
   * users company name
   */
  company: string;

  /**
   * users department name
   */
  department: string;
  /**
   * users job title
   */
  jobTitle: string;
  /**
   * a brief description about user
   */
  description: string;
  /**
   * users image in string format
   * we use base64 for encoding user image
   */
  image: string;
  /**
   * this attribute is used for remote admins
   */
  remoteAdmin: boolean;
  /**
   * cert thumbnail
   */
  certThumbprint: string;
  /**
   * serial of token
   */
  tokenSerial: string;
  /**
   * users lockdown state
   */
  lockState: 'LOCK' | 'UNLOCK' | 'LOCKED_BY_ADMIN';
  /**
   * state of uses otp
   */
  otpState: OtpStatus;
}

/**
 * user group class
 */
export interface UserGroup {
  id: number;
  description: string;
  ldapServer: string;
  name: string;
  users: [];
  username: string;
  isJoin?: boolean;
}

/**
 * it is an entity of brief user
 *
 * @publicApi
 */
export interface UserBriefEntity {
  /**
   * users username
   */
  username: string;

  /**
   * users first name
   */
  firstName: string;

  /**
   * users last name
   */
  lastName: string;

  /**
   * users display name
   */
  displayName: string;

  /**
   * it indicates user is already in which ldap server
   */
  ldapServer: string;
}
